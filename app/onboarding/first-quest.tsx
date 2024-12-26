import { StyleSheet, View, Image, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { useRouter } from "expo-router";

export default function FirstQuestScreen() {
  const router = useRouter();

  const handleAcceptQuest = () => {
    // TODO: Start the quest timer/tracking
    router.push("/home");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/onboarding-bg-1.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ThemedView style={[styles.content, { backgroundColor: "transparent" }]}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Your First Quest Awaits
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Your journey begins here.
          </ThemedText>
        </View>

        <View style={styles.questSection}>
          <ThemedText style={styles.questTitle}>
            The Mindful Explorer
          </ThemedText>
          <ThemedText style={styles.questDescription}>
            Take 15 minutes to step away from your phone and into the world
            around you. Let your thoughts roam free as you walk, observe the
            beauty of your surroundings, and reconnect with the present moment.
          </ThemedText>
          <ThemedText style={styles.questReward}>
            Reward: Your character will earn enough experience to level up.
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.acceptButton,
              pressed && styles.acceptButtonPressed,
            ]}
            onPress={handleAcceptQuest}
          >
            <ThemedText style={styles.acceptButtonText}>
              Accept Quest
            </ThemedText>
          </Pressable>
        </View>
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
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "space-between",
  },
  header: {
    gap: Spacing.sm,
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    color: Colors.forest,
    textAlign: "center",
    fontWeight: "600",
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.forest,
    textAlign: "center",
    fontStyle: "italic",
  },
  questSection: {
    gap: Spacing.lg,
    padding: Spacing.xl,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.cream,
  },
  questTitle: {
    fontSize: FontSizes.xl,
    color: Colors.cream,
    textAlign: "center",
    fontWeight: "600",
  },
  questDescription: {
    fontSize: FontSizes.md,
    color: Colors.cream,
    textAlign: "center",
    lineHeight: 24,
  },
  questReward: {
    fontSize: FontSizes.sm,
    color: Colors.cream,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.9,
    marginTop: Spacing.sm,
  },
  footer: {
    gap: Spacing.md,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.pill,
    alignItems: "center",
  },
  acceptButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  acceptButtonText: {
    color: Colors.cream,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
  footerNote: {
    fontSize: FontSizes.sm,
    color: Colors.forest,
    textAlign: "center",
    fontStyle: "italic",
  },
});
