import React, { useEffect } from "react";
import { StyleSheet, View, Image, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { layoutStyles } from "@/styles/layouts";
import { Colors, FontSizes, Spacing, Typography } from "@/constants/theme";
import { useRouter } from "expo-router";
import { buttonStyles } from "@/styles/buttons";

export default function FirstQuestScreen() {
  const router = useRouter();

  // Animation values for a smooth fade/scale-in effect.
  const headerOpacity = useSharedValue(0);
  const welcomeScale = useSharedValue(0.9);
  const descriptionOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    console.log("first quest screen mounted");
    return () => {
      console.log("first quest screen unmounted");
    };
  }, []);

  useEffect(() => {
    // Animate header: fade in and scale.
    headerOpacity.value = withDelay(450, withTiming(1, { duration: 1000 }));
    welcomeScale.value = withDelay(
      450,
      withSequence(withSpring(1.1), withSpring(1))
    );

    // Animate description text.
    descriptionOpacity.value = withDelay(
      1500,
      withTiming(1, { duration: 1000 })
    );

    // Animate the button last.
    buttonOpacity.value = withDelay(2400, withTiming(1, { duration: 625 }));
  }, []);

  // When the user taps the "I'm ready" button, navigate to the home page.
  const handleReady = () => {
    router.replace("/home");
  };

  // Create animated styles based on shared values.
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ scale: welcomeScale.value }],
  }));

  const descriptionStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <View style={layoutStyles.fullScreen}>
      <View style={layoutStyles.backgroundImageContainer}>
        <Image
          source={require("@/assets/images/background/onboarding.jpg")}
          style={layoutStyles.backgroundImage}
          resizeMode="cover"
        />
        <View style={[layoutStyles.darkOverlay, styles.lightOverlay]} />
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.header, headerStyle]}>
          <ThemedText type="title">Welcome to unQuest</ThemedText>
          <ThemedText
            type="bodyBold"
            style={{ ...Typography.bodyBold, color: Colors.text.light }}
          >
            Discover quests and embrace your journey.
          </ThemedText>
        </Animated.View>

        <Animated.View style={[styles.description, descriptionStyle]}>
          <ThemedText type="body">
            In unQuest, you'll embark on a mindful adventure by stepping away
            from the digital world and reconnecting with the beauty of the real
            world.
          </ThemedText>
          <ThemedText type="body">
            Each quest is a unique challenge that rewards you for taking a break
            from screen time.
          </ThemedText>
          <ThemedText type="body">
            When you're ready, press "I'm ready" to explore your journey.
          </ThemedText>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <Pressable
            style={({ pressed }) => [
              buttonStyles.primary,
              pressed && buttonStyles.primaryPressed,
            ]}
            onPress={handleReady}
          >
            <ThemedText style={buttonStyles.primaryText}>I'm ready</ThemedText>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lightOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  description: {
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
  },
});
