import React, { useState, useEffect } from "react";
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
} from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";
import { usePOIStore } from "@/store/poi-store";

// @todo: reapply the changes to the map because it broke the masking.
// import the pois from the poi store.
// loop through the pois and add them to the explored areas.
interface ExploredArea {
  x: number;
  y: number;
}

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

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_, ctx: any) => {
      // Initialize starting position to bottom right
      if (!ctx.hasInitialPosition) {
        translateX.value = minTranslateX;
        translateY.value = minTranslateY;
        ctx.hasInitialPosition = true;
      }
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      const newTranslateX = ctx.startX + event.translationX;
      const newTranslateY = ctx.startY + event.translationY;

      // Clamp the translation values to prevent scrolling past edges
      translateX.value = Math.min(
        Math.max(newTranslateX, minTranslateX),
        maxTranslateX
      );
      translateY.value = Math.min(
        Math.max(newTranslateY, minTranslateY),
        maxTranslateY
      );
    },
  });

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const pois = usePOIStore((state) => state.pois);

  const [exploredAreas, setExploredAreas] = useState<ExploredArea[]>([
    // Create a grid of explored points every 100 units until 1000
    { x: 840, y: 1100 },
  ]);

  function handlePOIPress(poi: any) {
    // Handle POI interaction
    console.log("POI pressed:", poi.name);
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={styles.container}>
          <MaskedView
            style={{ flex: 1 }}
            androidRenderingMode="software" // Necessary for Android
            maskElement={
              <Animated.View style={[styles.mapWrapper, imageStyle]}>
                {exploredAreas.map((area, index) => (
                  <RNImage
                    key={index}
                    source={require("../assets/images/fog-mask-2.png")} // Your mask image
                    style={[
                      styles.maskImage,
                      {
                        position: "absolute",
                        left: area.x - maskWidth / 2,
                        top: area.y - maskHeight / 2,
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
                source={require("../assets/images/map-downscaled.jpg")}
                style={styles.mapImage}
              />

              {/* POI Elements */}
              {pois
                .filter((poi) => poi.isRevealed)
                .map((poi) => (
                  <View
                    key={poi.slug}
                    style={[
                      styles.poiContainer,
                      {
                        left: poi.x,
                        top: poi.y,
                      },
                    ]}
                  >
                    <Pressable onPress={() => handlePOIPress(poi)}>
                      <Text style={styles.poiText}>{poi.name}</Text>
                    </Pressable>
                  </View>
                ))}
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
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 4,
    borderRadius: 4,
  },
  poiText: {
    fontSize: 12,
    color: "#000",
  },
});
