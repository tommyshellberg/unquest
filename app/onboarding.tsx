import { Image, StyleSheet, Platform, Pressable, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/onboarding-bg-1.jpg")}
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
            <ThemedText type="title" style={styles.appName}>
              unQuest
            </ThemedText>
            <ThemedText type="subtitle" style={styles.headline}>
              Level Up By Logging Off
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[
              styles.descriptionSection,
              { backgroundColor: "transparent" },
            ]}
          >
            <ThemedText style={styles.description}>
              The only game that rewards you for not playing it. Put down your
              phone and watch your hero rise.
            </ThemedText>

            <ThemedText style={styles.subDescription}>
              UnQuest isn't just another app—it's the antidote to them. Every
              minute offline powers your character's next adventure.
            </ThemedText>
          </ThemedView>

          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}
          >
            <ThemedText style={styles.ctaText}>Begin Your Journey</ThemedText>
          </Pressable>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay.dark,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "center",
    gap: Spacing.xl,
  },
  heroSection: {
    gap: Spacing.md,
    alignItems: "center",
  },
  appName: {
    fontSize: FontSizes.xxxl,
    textAlign: "center",
    color: Colors.forest,
    fontWeight: "bold",
  },
  headline: {
    fontSize: FontSizes.xl,
    textAlign: "center",
    color: Colors.text.light,
    opacity: 0.9,
  },
  descriptionSection: {
    gap: Spacing.lg,
  },
  description: {
    fontSize: FontSizes.lg,
    textAlign: "center",
    lineHeight: 28,
    color: Colors.text.light,
  },
  subDescription: {
    fontSize: FontSizes.md,
    textAlign: "center",
    color: Colors.text.light,
    opacity: 0.8,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.pill,
    alignItems: "center",
    marginTop: Spacing.md,
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
