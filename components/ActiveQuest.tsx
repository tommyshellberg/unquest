import { View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { ThemedText } from "./ThemedText";
import { QuestCard } from "./QuestCard";
import { Colors, FontSizes, Spacing } from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";
import {
  updateQuestProgressNotification,
  removeQuestProgressNotification,
  requestNotificationPermissions,
} from "@/services/notification-service";

type Props = {
  onComplete: (quest: any) => void;
};

export function ActiveQuest({ onComplete }: Props) {
  const activeQuest = useQuestStore((state) => state.activeQuest);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    if (!activeQuest?.startedAt) {
      removeQuestProgressNotification();
      return;
    }

    const updateTimer = async () => {
      if (!activeQuest?.startedAt) {
        removeQuestProgressNotification();
        return;
      }

      const now = Date.now();
      const elapsedMs = now - activeQuest.startedAt;
      const remainingMs = activeQuest.durationMinutes * 60 * 1000 - elapsedMs;

      if (remainingMs <= 0) {
        await removeQuestProgressNotification();
        onComplete(activeQuest);
        return;
      }

      const newRemainingMinutes = Math.floor(remainingMs / (60 * 1000));
      const newRemainingSeconds = Math.floor(
        (remainingMs % (60 * 1000)) / 1000
      );

      setRemainingMinutes(newRemainingMinutes);
      setRemainingSeconds(newRemainingSeconds);

      await updateQuestProgressNotification(
        activeQuest.title,
        newRemainingMinutes,
        activeQuest.durationMinutes
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(interval);
      removeQuestProgressNotification();
    };
  }, [activeQuest, onComplete]);

  if (!activeQuest) return null;

  return (
    <QuestCard>
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
    </QuestCard>
  );
}

const styles = StyleSheet.create({
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
    marginTop: Spacing.md,
  },
  encouragement: {
    fontSize: FontSizes.sm,
    fontStyle: "italic",
    color: Colors.cream,
    opacity: 0.8,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
