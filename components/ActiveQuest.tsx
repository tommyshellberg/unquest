import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { QuestCard } from "./QuestCard";
import { Colors, FontSizes, Spacing } from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";

type Props = {
  onComplete: (quest: any) => void;
};

export function ActiveQuest({ onComplete }: Props) {
  const activeQuest = useQuestStore((state) => state.activeQuest);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (activeQuest) {
      const timer = setInterval(() => {
        const now = Date.now();
        const timeElapsed = (now - activeQuest.startedAt) / 1000;
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
        <ThemedText type="title">{activeQuest.title}</ThemedText>
        <ThemedText type="subtitle">
          {remainingMinutes}:{remainingSeconds.toString().padStart(2, "0")}
        </ThemedText>
      </View>

      <ThemedText type="body">{activeQuest.description}</ThemedText>

      <ThemedText type="bodyItalic">
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
});
