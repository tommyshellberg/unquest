import React, { useEffect } from "react";
import {
  StyleSheet,
  Image,
  Dimensions,
  Text,
  Pressable,
  View,
  Image as RNImage,
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
} from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import { usePOIStore } from "@/store/poi-store";
import { INITIAL_POIS } from "../data/pois";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const imageWidth = 1200;
const imageHeight = 1200;

// Dimensions of your mask image
const maskWidth = 200; // Adjust to your mask image width
const maskHeight = 200; // Adjust to your mask image height

export default function MapScreen() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Calculate the maximum translation based on image and screen sizes
  const maxTranslateX = 0;
  const minTranslateX = screenWidth - imageWidth;
  const maxTranslateY = 0;
  const minTranslateY = screenHeight - imageHeight - 200; // @todo: find a real fix for the bottom getting cut off.

  const pois = usePOIStore((state) => state.pois);
  const lastRevealedPOISlug = usePOIStore((state) => state.lastRevealedPOISlug);
  const resetLastRevealedPOI = usePOIStore(
    (state) => state.resetLastRevealedPOI
  );

  // Animated value for POI reveal
  const poiScale = useSharedValue(1);

  // Center map on initial location or last revealed POI
  useEffect(() => {
    if (lastRevealedPOISlug) {
      const poi = pois.find((p) => p.slug === lastRevealedPOISlug);
      if (poi) {
        // Center the map on the POI
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

        // Animate the POI reveal
        poiScale.value = 0.1; // Start from a small scale
        poiScale.value = withTiming(1, { duration: 1000 }, (isFinished) => {
          if (isFinished) {
            // Reset lastRevealedPOISlug after animation completes
            runOnJS(resetLastRevealedPOI)();
          }
        });
      }
    } else {
      // Center on the first location (shrouded-forest) when no POI was just revealed
      const initialPOI = INITIAL_POIS[0];
      if (initialPOI) {
        const centerX = -(initialPOI.x - screenWidth / 2);
        const centerY = -(initialPOI.y - screenHeight / 2);

        translateX.value = Math.max(
          Math.min(centerX, maxTranslateX),
          minTranslateX
        );
        translateY.value = Math.max(
          Math.min(centerY, maxTranslateY),
          minTranslateY
        );
      }
    }
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

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const revealedPOIS = pois.filter((poi) => poi.isRevealed);
  console.log("revealedPOIS", revealedPOIS);

  function handlePOIPress(slug: string) {
    // Handle POI interaction
    console.log("POI pressed:", slug);
  }

  // Create a single animated style that all POIs will use
  const poiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: poiScale.value }],
    opacity: poiScale.value,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={[styles.container]}>
          <MaskedView
            style={{ flex: 1 }}
            androidRenderingMode="software" // Necessary for Android
            maskElement={
              <Animated.View style={[styles.mapWrapper, imageStyle]}>
                {revealedPOIS.map((poi, index) => (
                  <RNImage
                    key={index}
                    source={require("@/assets/images/fog-mask-2.png")} // Your mask image
                    style={[
                      styles.maskImage,
                      {
                        position: "absolute",
                        left: poi.x - maskWidth / 2,
                        top: poi.y - maskHeight / 2,
                      },
                    ]}
                  />
                ))}
              </Animated.View>
            }
          >
            {/* Map and overlays */}
            <Animated.View style={[styles.mapWrapper, imageStyle]}>
              {/* The entire map image */}
              <RNImage
                source={require("@/assets/images/map-downscaled.jpg")}
                style={styles.mapImage}
              />

              {/* POI Elements */}
              {pois
                .filter((poi) => poi.isRevealed)
                .map((poi) => {
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
                        // Only apply the animation style to the last revealed POI
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
});
