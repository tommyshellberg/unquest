import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
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
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useRouter } from "expo-router";
import { buttonStyles } from "@/styles/buttons";
import * as Notifications from "expo-notifications";
import { setupNotifications } from "@/services/notifications";
import { registerUser } from "@/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

enum OnboardingStep {
  WELCOME,
  NOTIFICATIONS,
  REGISTRATION,
  READY_TO_START,
}

export default function AppIntroductionScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    OnboardingStep.WELCOME
  );
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  // Registration form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  // Animation values for a smooth fade/scale-in effect.
  const contentOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.9);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    console.log("name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("isRegistering", isRegistering);
    console.log("registrationError", registrationError);
    return () => {
      console.log("app introduction screen unmounted");
    };
  }, [name, email, password, isRegistering, registrationError]);

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

    checkPermissions();
  }, []);

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

    // Move to the registration step after permissions
    setCurrentStep(OnboardingStep.REGISTRATION);
  };

  const handleRegistration = async () => {
    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setRegistrationError("All fields are required");
      return;
    }

    if (password.length < 8) {
      setRegistrationError("Password must be at least 8 characters");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setRegistrationError("Please enter a valid email address");
      return;
    }

    setIsRegistering(true);
    setRegistrationError("");

    try {
      // Temporarily use AsyncStorage instead of SecureStore until the native module issue is fixed
      const response = await registerUser(name, email, password);
      console.log("Registration successful:", response);

      // Store the registered user data
      setRegisteredUser(response.user);

      // Move to the ready to start step
      setCurrentStep(OnboardingStep.READY_TO_START);
    } catch (error: any) {
      // Handle registration errors
      console.error("Registration failed:", error);
      if (error.response?.data?.message) {
        setRegistrationError(error.response.data.message);
      } else {
        setRegistrationError("Registration failed. Please try again.");
      }
    } finally {
      setIsRegistering(false);
    }
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
      case OnboardingStep.REGISTRATION:
        handleRegistration();
        break;
      case OnboardingStep.READY_TO_START:
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

      case OnboardingStep.REGISTRATION:
        return (
          <>
            <ThemedText type="title">Create Your Account</ThemedText>
            <ThemedText
              type="bodyBold"
              style={{
                ...Typography.bodyBold,
                color: Colors.text.light,
                marginBottom: Spacing.xl,
              }}
            >
              Just a few details to get started
            </ThemedText>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor={Colors.forest}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={Colors.forest}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password (min 8 characters)"
                placeholderTextColor={Colors.forest}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {registrationError ? (
                <ThemedText type="body" style={styles.errorText}>
                  {registrationError}
                </ThemedText>
              ) : null}
            </View>

            <ThemedText
              type="body"
              style={{ ...Typography.body, ...styles.paragraph }}
            >
              By creating an account, you agree to our Terms of Service and
              Privacy Policy.
            </ThemedText>
          </>
        );

      case OnboardingStep.READY_TO_START:
        return (
          <>
            <ThemedText type="title">You're All Set!</ThemedText>
            <ThemedText
              type="bodyBold"
              style={{
                ...Typography.bodyBold,
                color: Colors.text.light,
                marginBottom: Spacing.xl,
              }}
            >
              Welcome, {registeredUser?.name || "Adventurer"}!
            </ThemedText>

            <ThemedText
              type="body"
              style={{ ...Typography.body, ...styles.paragraph }}
            >
              Your account has been created successfully.
              {permissionsGranted
                ? " You'll receive notifications about your quests on your lock screen."
                : " You can enable notifications later in your device settings."}
            </ThemedText>

            <ThemedText
              type="body"
              style={{ ...Typography.body, ...styles.paragraph }}
            >
              You're now ready to start your first quest and begin your journey
              of mindful breaks. Each quest will challenge you to step away from
              your screen and reconnect with the world around you.
            </ThemedText>

            <ThemedText
              type="bodyBold"
              style={{ ...Typography.bodyBold, ...styles.paragraph }}
            >
              Are you ready to embark on this adventure?
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
      case OnboardingStep.REGISTRATION:
        return isRegistering ? "Creating account..." : "Create account";
      case OnboardingStep.READY_TO_START:
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
              isRegistering && styles.disabledButton,
            ]}
            onPress={handleButtonPress}
            disabled={isRegistering}
          >
            {isRegistering ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.text.light} />
                <ThemedText
                  style={[buttonStyles.primaryText, styles.loadingText]}
                >
                  Creating account...
                </ThemedText>
              </View>
            ) : (
              <ThemedText style={buttonStyles.primaryText}>
                {getButtonText()}
              </ThemedText>
            )}
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
  disabledButton: {
    opacity: 0.7,
  },
  formContainer: {
    marginBottom: Spacing.lg,
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorText: {
    color: "#ff6b6b", // Error color
    marginBottom: Spacing.sm,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: Spacing.sm,
  },
});
