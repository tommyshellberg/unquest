import React from "react";
import { ImageSourcePropType, Image, StyleSheet, Text } from "react-native";
import { Colors, BorderRadius, Spacing } from "@/constants/theme";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  source: ImageSourcePropType;
  focused: boolean;
  label: string;
};

export default function TabBarIcon({ source, focused, label }: Props) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withTiming(focused ? 1.2 : 1, { duration: 200 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, focused && styles.focusedWrapper]}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          focused && styles.focusedContainer,
        ]}
      >
        <Image source={source} style={styles.icon} />
      </Animated.View>
      <Text
        style={[styles.label, focused && styles.focusedLabel]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xs,
    width: 70,
  },
  focusedWrapper: {
    // Optional styling for the entire wrapper when focused
  },
  container: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginHorizontal: Spacing.sm,
    // Shadows
    shadowColor: Colors.background.dark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  focusedContainer: {
    borderColor: Colors.primary,
  },
  icon: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  label: {
    marginTop: Spacing.sm,
    fontSize: 16,
    color: Colors.text.light,
    textAlign: "center",
    fontWeight: "500",
    width: "100%",
  },
  focusedLabel: {
    color: Colors.text.light,
    fontWeight: "900",
  },
});
