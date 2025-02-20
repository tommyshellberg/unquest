import { StyleSheet, View, Pressable, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, FontSizes } from "@/constants/theme";
import { buttonStyles } from "@/styles/buttons";
import { Quest } from "@/store/types";
type Props = {
  quest: Quest;
  onAcknowledge: () => void;
};

export function QuestFailed({ quest, onAcknowledge }: Props) {
  // Create animated values for header, message, and button animations
  const headerAnim = useSharedValue(0);
  const messageAnim = useSharedValue(0);
  const buttonAnim = useSharedValue(0);

  // Trigger animations in sequence on mount
  React.useEffect(() => {
    headerAnim.value = withTiming(1, { duration: 500 });
    messageAnim.value = withDelay(600, withTiming(1, { duration: 500 }));
    buttonAnim.value = withDelay(1200, withTiming(1, { duration: 500 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerAnim.value,
    transform: [{ translateY: 20 * (1 - headerAnim.value) }],
  }));

  const messageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: messageAnim.value,
    transform: [{ translateY: 20 * (1 - messageAnim.value) }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonAnim.value,
    transform: [{ translateY: 20 * (1 - buttonAnim.value) }],
  }));

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/background/onboarding.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Animated.View style={[styles.content, headerAnimatedStyle]}>
        <ThemedText type="title">Quest Failed</ThemedText>
      </Animated.View>
      <Animated.View style={[styles.content, messageAnimatedStyle]}>
        <ThemedText type="bodyBold" style={styles.message}>
          It's okay to fail – every setback teaches you a lesson.
        </ThemedText>
        <ThemedText type="body" style={styles.message}>
          Resist unlocking out of boredom.
        </ThemedText>
        <ThemedText type="body" style={styles.message}>
          Using your phone less helps build focus and mindfulness.
        </ThemedText>
      </Animated.View>
      <Animated.View style={[styles.content, buttonAnimatedStyle]}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPressOut={onAcknowledge}
        >
          <ThemedText type="bodyBold" style={buttonStyles.primaryText}>
            Keep Going!
          </ThemedText>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  content: {
    marginBottom: Spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  message: {
    fontSize: FontSizes.md,
    textAlign: "center",
    marginVertical: Spacing.md,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
  },
  buttonPressed: {
    backgroundColor: Colors.secondary,
  },
});
