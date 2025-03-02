import {
  Image,
  StyleSheet,
  Platform,
  Pressable,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
  Typography,
} from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import { buttonStyles } from "@/styles/buttons";
import { useAuth } from "@/contexts/AuthContext";
import { BlurView } from "expo-blur";
import LoginForm from "@/components/LoginForm";

export default function OnboardingScreen() {
  const router = useRouter();
  const { login, isLoggedIn, isLoading } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const loginFormAnim = useRef(new Animated.Value(0)).current;

  // Hide status bar
  useEffect(() => {
    console.log("Setting status bar to hidden");
    StatusBar.setHidden(true, "fade");
    return () => StatusBar.setHidden(false, "fade");
  }, []);

  // Redirect if logged in (reacting to changes in isLoggedIn from AuthContext)
  useEffect(() => {
    console.log("Checking if user is logged in");
    if (isLoggedIn) {
      console.log("User is logged in, redirecting to home");
      router.replace("/(app)/home");
    } else {
      console.log("User is not logged in, showing login form");
    }
  }, [isLoggedIn]);

  const handleShowLogin = () => {
    console.log("Showing login form");
    // Fade out buttons
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowLoginForm(true);
      // Fade in login form
      Animated.timing(loginFormAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleCancelLogin = () => {
    console.log("Cancelling login");
    // Fade out login form
    Animated.timing(loginFormAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowLoginForm(false);
      // Fade in buttons
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
    // This will be implemented later
  };

  // If AuthContext is loading, display a loading indicator to avoid white screen
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/background/onboarding.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ThemedView style={[styles.overlay, { backgroundColor: "transparent" }]}>
        <ThemedView
          style={[styles.content, { backgroundColor: "transparent" }]}
        >
          <ThemedView
            style={[styles.heroSection, { backgroundColor: "transparent" }]}
          >
            <Image
              source={require("@/assets/images/unquestlogo-downscaled.png")}
              style={styles.logo}
            />
            <ThemedText type="title">unQuest</ThemedText>
            <ThemedText type="bodyBold">Level Up By Logging Off</ThemedText>
          </ThemedView>

          <ThemedView
            style={[
              styles.descriptionSection,
              { backgroundColor: "transparent" },
            ]}
          >
            <ThemedText
              type="body"
              style={[Typography.body, { textAlign: "center" }]}
            >
              {`The only game that rewards you 
for not playing it.`}
            </ThemedText>
          </ThemedView>

          <View style={styles.buttonContainer}>
            {!showLoginForm ? (
              <Animated.View style={{ opacity: fadeAnim }}>
                <BlurView
                  intensity={80}
                  tint="dark"
                  style={styles.loginLinkBlur}
                >
                  <Pressable
                    onPress={handleShowLogin}
                    style={styles.loginLink}
                    accessibilityRole="button"
                    accessibilityLabel="Login to existing account"
                  >
                    <ThemedText style={styles.loginText}>
                      Already have an account? Login
                    </ThemedText>
                  </Pressable>
                </BlurView>

                <Pressable
                  style={({ pressed }) => [
                    buttonStyles.primary,
                    pressed && buttonStyles.primaryPressed,
                    { marginTop: Spacing.md },
                  ]}
                  onPress={() => router.push("/onboarding/choose-character")}
                  accessibilityRole="button"
                  accessibilityLabel="Begin your journey"
                >
                  <ThemedText style={buttonStyles.primaryText}>
                    Begin Your Journey
                  </ThemedText>
                </Pressable>
              </Animated.View>
            ) : (
              <Animated.View
                style={[
                  styles.loginFormContainer,
                  {
                    opacity: loginFormAnim,
                    transform: [
                      {
                        translateY: loginFormAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LoginForm
                  onLogin={login}
                  onCancel={handleCancelLogin}
                  onForgotPassword={handleForgotPassword}
                />
              </Animated.View>
            )}
          </View>
        </ThemedView>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  logo: {
    width: 120,
    height: 120,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay.dark,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  heroSection: {
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  descriptionSection: {
    gap: Spacing.lg,
    marginTop: "25%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: "10%",
    left: Spacing.xl,
    right: Spacing.xl,
  },
  loginLinkBlur: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  loginLink: {
    alignItems: "center",
    padding: Spacing.sm,
  },
  loginText: {
    color: Colors.cream,
    fontSize: FontSizes.md,
    textDecorationLine: "underline",
  },
  loginFormContainer: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background.dark,
  },
});
