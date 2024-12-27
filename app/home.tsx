import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ActiveQuest } from "@/components/ActiveQuest";
import { QuestComplete } from "@/components/QuestComplete";
import { Colors, FontSizes, Spacing } from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";
import { useCharacterStore } from "@/store/character-store";
import { Quest } from "@/store/types";

export default function HomeScreen() {
  const activeQuest = useQuestStore((state) => state.activeQuest);
  const completeQuest = useQuestStore((state) => state.completeQuest);
  const addXP = useCharacterStore((state) => state.addXP);

  const [showingCompletion, setShowingCompletion] = useState(false);
  const [completedQuest, setCompletedQuest] = useState<Quest | null>(null);

  const handleQuestComplete = (quest: Quest) => {
    setCompletedQuest(quest);
    setShowingCompletion(true);
  };

  const handleClaimReward = () => {
    if (!completedQuest) return;

    // Add XP from quest reward
    addXP(completedQuest.reward.xp);

    // Mark quest as complete
    completeQuest();

    // Reset completion state
    setShowingCompletion(false);
    setCompletedQuest(null);
  };

  if (showingCompletion && completedQuest) {
    return <QuestComplete quest={completedQuest} onClaim={handleClaimReward} />;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {activeQuest ? (
          <>
            <View style={styles.header}>
              <ThemedText style={styles.title}>Active Quest</ThemedText>
              <ThemedText style={styles.subtitle}>
                Your character is growing stronger while you're away
              </ThemedText>
            </View>
            <ActiveQuest onComplete={handleQuestComplete} />
            <ThemedText style={styles.instruction}>
              Close the app and return when your quest timer is complete. Your
              progress will be saved automatically.
            </ThemedText>
          </>
        ) : (
          <View style={styles.noQuestContainer}>
            <ThemedText style={styles.noQuestTitle}>No Active Quest</ThemedText>
            <ThemedText style={styles.noQuestText}>
              Your previous quest is complete! Ready for another adventure?
            </ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    alignItems: "center",
    marginVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: "600",
    color: Colors.forest,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.forest,
    textAlign: "center",
    opacity: 0.9,
  },
  instruction: {
    fontSize: FontSizes.md,
    color: Colors.forest,
    textAlign: "center",
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    lineHeight: 24,
    fontStyle: "italic",
  },
  noQuestContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.xl,
  },
  noQuestTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.forest,
    textAlign: "center",
  },
  noQuestText: {
    fontSize: FontSizes.md,
    color: Colors.forest,
    textAlign: "center",
    opacity: 0.9,
  },
});
