import React, { useEffect, useState } from "react";
import { View, StyleSheet, ImageBackground, FlatList } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors, FontSizes, Spacing, Typography } from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";
import { BlurView } from "expo-blur";
import { layoutStyles } from "@/styles/layouts";

type Props = {
  onComplete: (quest: any) => void;
};

const renderTimeRemaining = (minutes: number, seconds: number) => {
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const exampleActivities = [
  { description: "Take a relaxing walk outside." },
  { description: "Catch up with someone you care about." },
  { description: "Read a book or write in a journal." },
];

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
          setRemainingMinutes(Math.floor(timeLeft / 60));
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
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/background/active-quest.jpg")}
        style={layoutStyles.backgroundImage}
      >
        <BlurView
          intensity={30}
          tint="regular"
          style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
        />

        <View
          style={[
            layoutStyles.contentContainer,
            {
              padding: 0,
              marginTop: 0,
            },
          ]}
        >
          <View
            style={
              (styles.header, { margin: 0, backgroundColor: Colors.stone })
            }
          >
            <ThemedText
              type="subtitle"
              style={{
                ...Typography.subtitle,
                padding: Spacing.sm,
                textAlign: "center",
                verticalAlign: "middle",
                marginBottom: 0,
              }}
            >
              {activeQuest.title}
            </ThemedText>
          </View>

          <View style={{ padding: Spacing.md }}>
            <ThemedText
              type="bodyBold"
              style={{
                ...Typography.bodyBold,
                textAlign: "center",
                marginBottom: Spacing.lg,
              }}
            >
              Time Remaining:{" "}
              {renderTimeRemaining(remainingMinutes, remainingSeconds)}
            </ThemedText>
            <ThemedText type="body" style={styles.instructions}>
              Close the app and enjoy some time away from the screen. Here are
              some ideas:
            </ThemedText>
            <FlatList
              data={exampleActivities}
              renderItem={({ item }) => (
                <ThemedText type="body" style={styles.activityItem}>
                  - {item.description}
                </ThemedText>
              )}
              keyExtractor={(item) => item.description}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.md,
  },
  instructions: {
    marginBottom: Spacing.md,
    textAlign: "left",
  },
  activityItem: {
    marginBottom: Spacing.sm,
  },
});
