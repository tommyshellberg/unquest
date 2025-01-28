import React from "react";
import { StyleSheet, Image, Dimensions, Text, Pressable } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const imageWidth = 2000;
const imageHeight = 2000;

// Define your POIs
const POIs = [
  {
    id: "poi-1",
    name: "Village of Beginnings",
    x: 500, // x-coordinate on the image
    y: 1500, // y-coordinate on the image
  },
  {
    id: "poi-2",
    name: "Dragon's Cave",
    x: 1500,
    y: 500,
  },
  // Add more POIs as needed
];

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

  function handlePOIPress(poi: any) {
    // @todo: show a modal with the POI details.
    console.log("POI pressed:", poi.name);
  }

  return (
    <PanGestureHandler onGestureEvent={panGesture}>
      <Animated.View style={styles.container}>
        <Animated.Image
          source={require("../assets/images/map.jpg")}
          style={[styles.mapImage, imageStyle]}
          resizeMode="contain"
        />
        {POIs.map((poi) => (
          <Animated.View
            key={poi.id}
            style={[
              styles.poiContainer,
              {
                left: poi.x,
                top: poi.y,
              },
              imageStyle, // So the POI moves with the map
            ]}
          >
            <Pressable onPressOut={() => handlePOIPress(poi)}>
              <Text style={styles.poiText}>{poi.name}</Text>
            </Pressable>
          </Animated.View>
        ))}
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapImage: {
    width: imageWidth,
    height: imageHeight,
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
