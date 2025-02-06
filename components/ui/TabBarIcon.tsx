import React from "react";
import { ImageSourcePropType, Image, StyleSheet } from "react-native";
import { Colors, BorderRadius, Spacing } from "@/constants/theme";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  source: ImageSourcePropType;
  focused: boolean;
};

export default function TabBarIcon({ source, focused }: Props) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withTiming(focused ? 1.2 : 1, { duration: 200 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        focused && styles.focusedContainer,
      ]}
    >
      <Image source={source} style={styles.icon} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginHorizontal: Spacing.sm,
    // Shadows (optional)
    shadowColor: Colors.background.dark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: Colors.stone,
  },
  focusedContainer: {
    borderColor: Colors.primary,
  },
  icon: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
