import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  StyleSheet,
  Image,
  Dimensions,
  Text,
  Pressable,
  View,
  Image as RNImage,
  ActivityIndicator,
} from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  withSpring,
} from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import { usePOIStore } from "@/store/poi-store";
import { useQuestStore } from "@/store/quest-store";
import { getMapForQuest } from "@/utils/mapUtils";
import { MAP_IMAGES, MapId } from "@/app/data/maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Asset } from "expo-asset";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 834;
const maskWidth = 500;
const maskHeight = 500;

// Define the height of your bottom navigation
const BOTTOM_NAV_HEIGHT = 60; // Adjust this to match your actual navigation height

// Debug the image source immediately
const MASK_IMAGE = require("@/assets/images/fog-mask-2.png");

export default function MapScreen() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Shared value for new mask animations
  const newMaskScale = useSharedValue(0.1);

  const insets = useSafeAreaInsets();

  // Calculate the effective screen height (accounting for bottom navigation)
  const effectiveScreenHeight = screenHeight - BOTTOM_NAV_HEIGHT;

  // Calculate boundaries with explicit consideration for bottom navigation
  const maxTranslateX = 1;
  const minTranslateX = screenWidth - IMAGE_WIDTH;
  const maxTranslateY = 1;
  const minTranslateY = effectiveScreenHeight - IMAGE_HEIGHT;

  const pois = usePOIStore((state) => state.pois);
  const lastRevealedPOISlug = usePOIStore((state) => state.lastRevealedPOISlug);
  const resetLastRevealedPOI = usePOIStore(
    (state) => state.resetLastRevealedPOI
  );

  const poiScale = useSharedValue(1);

  // Add a ref to track if we're currently animating
  const isAnimating = useRef(false);

  // Get the last completed quest
  const completedQuests = useQuestStore((state) => state.completedQuests);
  const lastCompletedQuest = completedQuests[completedQuests.length - 1];

  console.log("minTranslateX", minTranslateX);
  console.log("minTranslateY", minTranslateY);
  console.log("translateX", translateX.value);
  console.log("translateY", translateY.value);

  // Determine the map to display
  const mapId = useMemo<MapId>(
    () => getMapForQuest(lastCompletedQuest?.id || ""),
    [lastCompletedQuest]
  );

  // Memoize filtered POIs
  const revealedPOIS = useMemo(
    () =>
      pois.filter((poi) => poi.isRevealed).filter((poi) => poi.mapId === mapId),
    [pois, mapId]
  );

  // Get the map image
  const mapImage = MAP_IMAGES[mapId];

  // Preload the map image when the mapImage changes.
  useEffect(() => {
    if (mapImage) {
      Asset.fromModule(mapImage)
        .downloadAsync()
        .catch((error) => console.error("Error preloading map image", error));
    }
  }, [mapImage]);

  const handleLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  const handleError = useCallback((error: any) => {
    setLoadError(error.nativeEvent.error);
  }, []);

  // Add cleanup for animations
  useEffect(() => {
    return () => {
      // Reset shared values on unmount
      if (translateX) translateX.value = 0;
      if (translateY) translateY.value = 0;
      if (poiScale) poiScale.value = 1;
      if (newMaskScale) newMaskScale.value = 0.1;
    };
  }, []);

  // This effect positions the map based on the state of `lastRevealedPOISlug`
  useEffect(() => {
    let isActive = true;

    if (lastRevealedPOISlug && !isAnimating.current) {
      const poi = pois.find((p) => p.slug === lastRevealedPOISlug);
      if (poi && isActive) {
        isAnimating.current = true;
        // Calculate center if a POI has been revealed:
        const centerX = -(poi.x - screenWidth / 2);
        const centerY = -(poi.y - screenHeight / 2);
        console.log("centerX", centerX);
        console.log("centerY", centerY);

        // Bound the translation so that it doesn't move off the map
        translateX.value = Math.max(
          Math.min(centerX, maxTranslateX),
          minTranslateX
        );
        translateY.value = Math.max(
          Math.min(centerY, maxTranslateY),
          minTranslateY
        );

        // Initialize animations
        poiScale.value = 0.1;
        newMaskScale.value = 0.1;
        try {
          poiScale.value = withTiming(1, { duration: 1500 });
          newMaskScale.value = withSpring(1, {
            damping: 12,
            stiffness: 90,
          });
          withTiming(1, { duration: 2500 }, (finished) => {
            if (finished && isActive) {
              runOnJS(() => {
                isAnimating.current = false;
                if (isActive) {
                  resetLastRevealedPOI();
                }
              })();
            }
          });
        } catch (error) {
          console.error("Animation error:", error);
          isAnimating.current = false;
        }
      }
    } else {
      // No quest revealed or no lastRevealedPOISlug, so position the map at (0,0)
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    }

    return () => {
      isActive = false;
      isAnimating.current = false;
    };
  }, [lastRevealedPOISlug]);

  const panGesture = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const newTranslateX = ctx.startX + event.translationX;
      const newTranslateY = ctx.startY + event.translationY;

      // Apply constraints to prevent scrolling beyond map boundaries
      translateX.value = Math.max(
        Math.min(newTranslateX, maxTranslateX),
        minTranslateX
      );
      translateY.value = Math.max(
        Math.min(newTranslateY, maxTranslateY),
        minTranslateY
      );
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    try {
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
        ],
      };
    } catch (error) {
      console.error("Image style error:", error);
      return {};
    }
  });

  const handlePOIPress = useCallback((slug: string) => {
    console.log("POI pressed:", slug);
  }, []);

  const poiAnimatedStyle = useAnimatedStyle(() => {
    try {
      return {
        transform: [{ scale: poiScale.value }],
      };
    } catch (error) {
      console.error("POI style error:", error);
      return {};
    }
  });

  // Animated style for new mask reveals
  const maskAnimatedStyle = useAnimatedStyle(() => {
    try {
      return {
        transform: [{ scale: newMaskScale.value }],
      };
    } catch (error) {
      console.error("Mask style error:", error);
      return {};
    }
  });

  if (loadError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error loading map: {loadError}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Show a loading overlay until the map image loads */}
      {!isMapLoaded && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={[styles.container]}>
          <MaskedView
            style={{ flex: 1 }}
            androidRenderingMode="software"
            maskElement={
              <Animated.View style={[styles.mapWrapper, imageStyle]}>
                {revealedPOIS.map((poi, index) => {
                  const isLastRevealed = poi.slug === lastRevealedPOISlug;
                  console.log("poi", poi);
                  console.log("isLastRevealed", isLastRevealed);
                  return (
                    <Animated.View
                      key={index}
                      style={[
                        {
                          position: "absolute",
                          left: poi.x - maskWidth / 2,
                          top: poi.y - maskHeight / 2,
                        },
                        isLastRevealed ? maskAnimatedStyle : undefined,
                      ]}
                    >
                      <RNImage
                        source={MASK_IMAGE}
                        style={styles.maskImage}
                        progressiveRenderingEnabled={true}
                      />
                    </Animated.View>
                  );
                })}
              </Animated.View>
            }
          >
            <Animated.View style={[styles.mapWrapper, imageStyle]}>
              <RNImage
                source={mapImage}
                style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
                onLoad={handleLoad}
                onError={handleError}
                resizeMode="contain"
              />

              {revealedPOIS.map((poi) => {
                const isLastRevealed = poi.slug === lastRevealedPOISlug;
                return (
                  <Animated.View
                    key={poi.slug}
                    style={[
                      styles.poiContainer,
                      {
                        left: poi.x,
                        top: poi.y,
                        backgroundColor: poi.isRevealed ? "white" : "grey",
                        opacity: poi.isRevealed ? 1 : 0.5,
                      },
                      isLastRevealed ? poiAnimatedStyle : undefined,
                    ]}
                  >
                    <Pressable
                      onPress={() => handlePOIPress(poi.slug)}
                      disabled={!poi.isRevealed}
                    >
                      <Text style={styles.poiText}>{poi.name}</Text>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </Animated.View>
          </MaskedView>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(61, 73, 78, 0.92)",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "rgba(61, 73, 78, 0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },
  mapWrapper: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  mapImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  maskImage: {
    width: maskWidth,
    height: maskHeight,
  },
  poiContainer: {
    position: "absolute",
    padding: 4,
    borderRadius: 4,
  },
  poiText: {
    fontSize: 12,
    color: "#000",
  },
  errorText: {
    color: "#ff4444",
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    padding: 20,
  },
});
