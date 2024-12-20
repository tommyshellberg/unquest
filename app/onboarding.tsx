import { Image, StyleSheet, Platform, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export default function OnboardingScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#2C3E50", dark: "#1A2530" }}
      headerImage={
        <Image
          source={require("@/assets/images/onboarding-bg.png")}
          style={styles.backgroundImage}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.appName}>
            UnQuest
          </ThemedText>
          <ThemedText type="subtitle" style={styles.headline}>
            Level Up By Logging Off
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.descriptionSection}>
          <ThemedText style={styles.description}>
            The only game that rewards you for not playing it. Put down your
            phone and watch your hero rise.
          </ThemedText>

          <ThemedText style={styles.subDescription}>
            UnQuest isn't just another app—it's the antidote to them. Every
            minute offline powers your character's next adventure.
          </ThemedText>
        </ThemedView>

        <Pressable style={styles.ctaButton}>
          <ThemedText style={styles.ctaText}>Begin Your Journey</ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 32,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    minHeight: "100%",
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
  },
  heroSection: {
    gap: 16,
    alignItems: "center",
    marginTop: 40,
  },
  appName: {
    fontSize: 48,
    textAlign: "center",
  },
  headline: {
    fontSize: 24,
    textAlign: "center",
    opacity: 0.9,
  },
  descriptionSection: {
    gap: 24,
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 28,
  },
  subDescription: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 16,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
