import React, { useEffect, useState } from "react";
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
import * as Notifications from "expo-notifications";
import { setupNotifications } from "@/services/notifications";

// Define the steps of our onboarding flow
enum OnboardingStep {
  WELCOME,
  NOTIFICATIONS,
  PERMISSIONS_REQUESTED,
}

export default function AppIntroductionScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    OnboardingStep.WELCOME
  );
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Animation values for a smooth fade/scale-in effect.
  const contentOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.9);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    console.log("app introduction screen mounted");
    return () => {
      console.log("app introduction screen unmounted");
    };
  }, []);

  // Reset and play animations when step changes
  useEffect(() => {
    // Reset animations
    contentOpacity.value = 0;
    contentScale.value = 0.9;
    buttonOpacity.value = 0;

    // Start new animations
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    contentScale.value = withDelay(
      300,
      withSequence(withSpring(1.05), withSpring(1))
    );
    buttonOpacity.value = withDelay(1200, withTiming(1, { duration: 500 }));
  }, [currentStep]);

  // Check if permissions are already granted
  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionsGranted(status === "granted");
    };

    if (currentStep === OnboardingStep.PERMISSIONS_REQUESTED) {
      checkPermissions();
    }
  }, [currentStep]);

  // Request notification permissions
  const requestPermissions = async () => {
    try {
      setupNotifications();
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      setPermissionsGranted(status === "granted");
    } catch (error) {
      console.error("Error requesting permissions:", error);
      // Even if there's an error, we'll continue the flow
      setPermissionsGranted(false);
    }

    // Move to the next step regardless of permission result
    setCurrentStep(OnboardingStep.PERMISSIONS_REQUESTED);
  };

  // Handle button press based on current step
  const handleButtonPress = () => {
    switch (currentStep) {
      case OnboardingStep.WELCOME:
        setCurrentStep(OnboardingStep.NOTIFICATIONS);
        break;
      case OnboardingStep.NOTIFICATIONS:
        requestPermissions();
        break;
      case OnboardingStep.PERMISSIONS_REQUESTED:
        router.replace("/(app)/home");
        break;
    }
  };

  // Create animated styles based on shared values
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  // Render content based on current step
  const renderContent = () => {
    switch (currentStep) {
      case OnboardingStep.WELCOME:
        return (
          <>
            <ThemedText type="title">Welcome to unQuest</ThemedText>
            <ThemedText
              type="bodyBold"
              style={{
                ...Typography.bodyBold,
                color: Colors.text.light,
                marginBottom: Spacing.xl,
              }}
            >
              Discover quests and embrace your journey.
            </ThemedText>
            <ThemedText
              type="body"
              style={{ ...Typography.body, ...styles.paragraph }}
            >
              In unQuest, you'll embark on a mindful adventure by stepping away
              from the digital world and reconnecting with the beauty of the
              real world.
            </ThemedText>
            <ThemedText
              type="body"
              style={{ ...Typography.body, ...styles.paragraph }}
            >
              Each quest is a unique challenge that rewards you for taking a
              break from screen time.
            </ThemedText>
          </>
        );

      case OnboardingStep.NOTIFICATIONS:
        return (
          <>
            <ThemedText type="title">Notifications</ThemedText>
            <ThemedText
              type="bodyBold"
              style={{
                ...Typography.bodyBold,
                color: Colors.text.light,
                marginBottom: Spacing.xl,
              }}
            >
              Stay updated on your quests
            </ThemedText>
            <ThemedText
              type="body"
              style={{ ...Typography.body, ...styles.paragraph }}
            >
              unQuest works best with lock screen notifications enabled. This
              allows you to:
            </ThemedText>
            <ThemedText
              type="body"
              style={{ ...Typography.body, ...styles.bulletPoint }}
            >
              • See your quest progress while your phone is locked
            </ThemedText>
            <ThemedText
              type="body"
              style={{
                ...Typography.body,
                ...styles.bulletPoint,
                marginBottom: Spacing.md,
              }}
            >
              • Receive notifications when your quest is complete
            </ThemedText>
            <ThemedText
              type="bodyBold"
              style={{ ...Typography.bodyBold, ...styles.paragraph }}
            >
              For the best experience, please set your lock screen notification
              settings to "Show conversations and notifications"
            </ThemedText>
          </>
        );

      case OnboardingStep.PERMISSIONS_REQUESTED:
        return (
          <>
            <ThemedText type="title">
              {permissionsGranted ? "You're all set!" : "Let's continue anyway"}
            </ThemedText>
            <ThemedText
              type="bodyBold"
              style={{
                ...Typography.bodyBold,
                color: Colors.text.light,
                marginBottom: Spacing.xl,
              }}
            >
              {permissionsGranted
                ? "Notifications are enabled"
                : "You can enable notifications later"}
            </ThemedText>
            <ThemedText
              type="body"
              style={{ ...Typography.body, ...styles.paragraph }}
            >
              {permissionsGranted
                ? "Great! You'll receive updates about your quests on your lock screen."
                : "You can still use unQuest without notifications, but you'll miss out on some features."}
            </ThemedText>
            <ThemedText
              type="body"
              style={{ ...Typography.body, ...styles.paragraph }}
            >
              You're now ready to start your first quest and begin your journey
              of mindful breaks.
            </ThemedText>
          </>
        );
    }
  };

  // Get button text based on current step
  const getButtonText = () => {
    switch (currentStep) {
      case OnboardingStep.WELCOME:
        return "Got it";
      case OnboardingStep.NOTIFICATIONS:
        return "Enable notifications";
      case OnboardingStep.PERMISSIONS_REQUESTED:
        return "Start my journey";
    }
  };

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
        <Animated.View style={[styles.contentContainer, contentStyle]}>
          {renderContent()}
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <Pressable
            style={({ pressed }) => [
              buttonStyles.primary,
              pressed && buttonStyles.primaryPressed,
            ]}
            onPress={handleButtonPress}
          >
            <ThemedText style={buttonStyles.primaryText}>
              {getButtonText()}
            </ThemedText>
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
    justifyContent: "space-between",
  },
  contentContainer: {
    marginTop: Spacing.xl,
  },
  paragraph: {
    marginBottom: Spacing.lg,
  },
  bulletPoint: {
    marginBottom: Spacing.sm,
    marginLeft: Spacing.md,
  },
  highlight: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.md,
    overflow: "hidden",
  },
  buttonContainer: {
    marginBottom: Spacing.xl,
  },
});
