import { Image, StyleSheet, Platform, Pressable, View } from "react-native";
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
import { useEffect } from "react";
import { buttonStyles } from "@/styles/buttons";

export default function OnboardingScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log("onboarding screen mounted");
  }, []);

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
            <Pressable
              style={({ pressed }) => [
                styles.ctaButton,
                pressed && styles.ctaButtonPressed,
              ]}
              onPress={() => router.push("/onboarding/choose-character")}
            >
              <ThemedText style={buttonStyles.primaryText}>
                Begin Your Journey
              </ThemedText>
            </Pressable>
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
  appName: {
    textAlign: "center",
    color: Colors.forest,
    fontWeight: "bold",
  },
  headline: {
    textAlign: "center",
    color: Colors.text.light,
  },
  descriptionSection: {
    gap: Spacing.lg,
    marginTop: "25%",
  },
  description: {
    textAlign: "center",
    lineHeight: 28,
    color: Colors.text.light,
  },
  buttonContainer: {
    position: "absolute",
    bottom: "10%",
    left: Spacing.xl,
    right: Spacing.xl,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.pill,
    alignItems: "center",
  },
  ctaButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  ctaText: {
    color: Colors.cream,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
});
