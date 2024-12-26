import { View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";

export function ActiveQuest() {
  const activeQuest = useQuestStore((state) => state.activeQuest);
  const completeQuest = useQuestStore((state) => state.completeQuest);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!activeQuest?.startedAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const elapsedMs = now - activeQuest.startedAt;
      const remainingMs = activeQuest.durationMinutes * 60 * 1000 - elapsedMs;

      if (remainingMs <= 0) {
        completeQuest();
        return;
      }

      setRemainingMinutes(Math.floor(remainingMs / (60 * 1000)));
      setRemainingSeconds(Math.floor((remainingMs % (60 * 1000)) / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [activeQuest]);

  if (!activeQuest) return null;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{activeQuest.title}</ThemedText>
        <ThemedText style={styles.timer}>
          {remainingMinutes}:{remainingSeconds.toString().padStart(2, "0")}
        </ThemedText>
      </View>

      <ThemedText style={styles.description}>
        {activeQuest.description}
      </ThemedText>

      <ThemedText style={styles.encouragement}>
        Your character grows stronger with every minute away.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.forest,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.cream,
  },
  timer: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.cream,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.cream,
    opacity: 0.9,
  },
  encouragement: {
    fontSize: FontSizes.sm,
    fontStyle: "italic",
    color: Colors.cream,
    opacity: 0.8,
    textAlign: "center",
    marginTop: Spacing.sm,
  },
});
