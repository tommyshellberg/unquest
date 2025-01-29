import React, { useState } from "react";
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
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  ClipPath,
} from "react-native-svg";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const imageWidth = 2000;
const imageHeight = 2000;

// Dimensions of your mask image
const maskWidth = 400; // Adjust to your mask image width
const maskHeight = 400; // Adjust to your mask image height

// Define your POIs
const POIs = [
  {
    id: "poi-1",
    name: "The Twilight Spire",
    x: 320, // x-coordinate on the image
    y: 320, // y-coordinate on the image
  },
  {
    id: "poi-2",
    name: "Dragon's Cave",
    x: 1500,
    y: 500,
  },
  // Add more POIs as needed
];

// Define Explored Areas
type ExploredArea = {
  x: number;
  y: number;
};

export default function MapScreen() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Calculate the maximum translation based on image and screen sizes
  const maxTranslateX = 0;
  const minTranslateX = screenWidth - imageWidth;
  const maxTranslateY = 0;
  const minTranslateY = screenHeight - imageHeight;

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_, ctx: any) => {
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

  const [exploredAreas, setExploredAreas] = useState<ExploredArea[]>([
    // Start with the initial explored area
    { x: 300, y: 300 },
    { x: 600, y: 600 },
  ]);

  // Function to reveal a new area
  function revealArea(x: number, y: number) {
    setExploredAreas((prevAreas) => [...prevAreas, { x, y }]);
  }

  function handlePOIPress(poi: any) {
    // Handle POI interaction
    console.log("POI pressed:", poi.name);
    revealArea(poi.x, poi.y);
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
                source={require("../assets/images/map.jpg")}
                style={styles.mapImage}
              />

              {/* POI Elements */}
              {POIs.map((poi) => (
                <View
                  key={poi.id}
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
