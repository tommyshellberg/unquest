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
import { INITIAL_POIS } from "../data/pois";
import { ThemedText } from "@/components/ThemedText";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const imageWidth = 1200;
const imageHeight = 834;
const maskWidth = 500;
const maskHeight = 500;

// Debug the image source immediately
const MAP_IMAGE = require("@/assets/images/map-1.jpg");
const MASK_IMAGE = require("@/assets/images/fog-mask-2.png");

export default function MapScreen() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Shared value for new mask animations
  const newMaskScale = useSharedValue(0.1);

  const maxTranslateX = 0;
  const minTranslateX = screenWidth - imageWidth;
  const maxTranslateY = 0;
  const minTranslateY = screenHeight - imageHeight - 200;

  const pois = usePOIStore((state) => state.pois);
  const lastRevealedPOISlug = usePOIStore((state) => state.lastRevealedPOISlug);
  console.log("lastRevealedPOISlug", lastRevealedPOISlug);
  const resetLastRevealedPOI = usePOIStore(
    (state) => state.resetLastRevealedPOI
  );

  const poiScale = useSharedValue(1);

  // Memoize filtered POIs
  const revealedPOIS = useMemo(
    () => pois.filter((poi) => poi.isRevealed),
    [pois]
  );

  // Add a ref to track if we're currently animating
  const isAnimating = useRef(false);

  const handleLoadStart = useCallback(() => {
    console.log("Map image load started");
  }, []);

  const handleLoad = useCallback(() => {
    console.log("Map image loaded successfully");
    setIsMapLoaded(true);
  }, []);

  const handleError = useCallback((error: any) => {
    console.error("Map image load error:", error.nativeEvent.error);
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

  // Separate the POI animation logic into its own effect
  useEffect(() => {
    let isActive = true;

    if (lastRevealedPOISlug && !isAnimating.current) {
      console.log("we have a last revealed poi");
      const poi = pois.find((p) => p.slug === lastRevealedPOISlug);
      console.log("poi", poi);

      if (poi && isActive) {
        isAnimating.current = true;

        const centerX = -(poi.x - screenWidth / 2);
        const centerY = -(poi.y - screenHeight / 2);

        translateX.value = Math.max(
          Math.min(centerX, maxTranslateX),
          minTranslateX
        );
        translateY.value = Math.max(
          Math.min(centerY, maxTranslateY),
          minTranslateY
        );

        // Reset initial values
        poiScale.value = 0.1;
        newMaskScale.value = 0.1;

        try {
          // Animate POI scale
          poiScale.value = withTiming(1, { duration: 1500 });

          // Animate mask with spring for a more dynamic reveal
          newMaskScale.value = withSpring(1, {
            damping: 12,
            stiffness: 90,
          });

          // Use a separate timing animation to handle completion
          withTiming(1, { duration: 2500 }, (finished) => {
            if (finished && isActive) {
              runOnJS(() => {
                console.log("Animation sequence complete");
                isAnimating.current = false;
                if (isActive) {
                  console.log("resetting last revealed poi");
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
                source={MAP_IMAGE}
                style={styles.mapImage}
                onLoadStart={handleLoadStart}
                onLoad={handleLoad}
                onError={handleError}
                resizeMode="contain"
                fadeDuration={0}
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
  loadingText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },
  mapWrapper: {
    width: imageWidth,
    height: imageHeight,
  },
  mapImage: {
    width: imageWidth,
    height: imageHeight,
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
