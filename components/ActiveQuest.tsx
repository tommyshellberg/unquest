import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { QuestCard } from "./QuestCard";
import { Colors, FontSizes, Spacing, Typography } from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";

type Props = {
  onComplete: (quest: any) => void;
};

const renderTimeRemaining = (minutes: number, seconds: number) => {
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function ActiveQuest({ onComplete }: Props) {
  const activeQuest = useQuestStore((state) => state.activeQuest);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (activeQuest) {
      const timer = setInterval(() => {
        const now = Date.now();
        const timeElapsed = (now - activeQuest.startTime) / 1000;
        const totalDuration = activeQuest.durationMinutes * 60;
        const timeLeft = totalDuration - timeElapsed;

        if (timeLeft <= 0) {
          clearInterval(timer);
          onComplete(activeQuest);
        } else {
          setRemainingMinutes(Math.ceil(timeLeft / 60));
          setRemainingSeconds(Math.floor(timeLeft % 60));
        }
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [activeQuest]);

  if (!activeQuest) return null;

  return (
    <QuestCard>
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          {activeQuest.title}
        </ThemedText>
        <ThemedText type="subtitle" style={styles.title}>
          {renderTimeRemaining(remainingMinutes, remainingSeconds)}
        </ThemedText>
      </View>

      <ThemedText type="body" style={styles.description}>
        {activeQuest.description}
      </ThemedText>

      <ThemedText type="bodyItalic" style={styles.description}>
        Your character grows stronger with every minute away.
      </ThemedText>
    </QuestCard>
  );
}

const styles = StyleSheet.create({
  container: {
    color: Colors.cream,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    ...Typography.subtitle,
    color: Colors.cream,
  },
  description: {
    ...Typography.body,
    color: Colors.cream,
  },
});
