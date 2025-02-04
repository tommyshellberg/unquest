import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  Pressable,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ActiveQuest } from "@/components/ActiveQuest";
import { QuestComplete } from "@/components/QuestComplete";
import { QuestList } from "@/components/QuestList";
import { QuestFailed } from "@/components/QuestFailed";
import { Colors, FontSizes, Spacing, BorderRadius } from "@/constants/theme";
import { useQuestStore } from "@/store/quest-store";
import { useCharacterStore } from "@/store/character-store";
import { Quest, QuestCompletion, QuestTemplate } from "@/store/types";
import Constants from "expo-constants";
import { useLockStateDetection } from "@/hooks/useLockStateDetection";
import { router } from "expo-router";
import { TAB_BAR_HEIGHT } from "./_layout";

export default function HomeScreen() {
  const activeQuest = useQuestStore((state) => state.activeQuest);
  const completeQuest = useQuestStore((state) => state.completeQuest);
  const startQuest = useQuestStore((state) => state.startQuest);
  const refreshAvailableQuests = useQuestStore(
    (state) => state.refreshAvailableQuests
  );
  const availableQuests = useQuestStore((state) => state.availableQuests);
  const failedQuest = useQuestStore((state) => state.failedQuest);
  const resetFailedQuest = useQuestStore((state) => state.resetFailedQuest);

  const character = useCharacterStore((state) => state.character);
  const addXP = useCharacterStore((state) => state.addXP);

  const [showingCompletion, setShowingCompletion] = useState(false);
  const [currentCompletion, setCurrentCompletion] =
    useState<QuestCompletion | null>(null);

  useLockStateDetection();

  // Refresh available quests when there's no active quest
  useEffect(() => {
    if (!activeQuest) {
      refreshAvailableQuests();
    }
  }, [activeQuest]);

  const handleQuestComplete = (ignoreDuration = false) => {
    if (!character) return;
    const completion = completeQuest(ignoreDuration);
    if (completion) {
      setCurrentCompletion(completion);
      setShowingCompletion(true);
    }
  };

  const handleClaimReward = () => {
    if (!currentCompletion || !character) return;

    // Add XP before completing quest
    addXP(currentCompletion.reward.xp);

    // Reset completion state
    setShowingCompletion(false);
    setCurrentCompletion(null);
    // Navigate to level progress screen after claiming reward
    router.push("/profile");
  };

  const handleSelectQuest = (quest: QuestTemplate) => {
    startQuest({ ...quest, startTime: Date.now() });
  };

  const handleAcknowledgeFailure = () => {
    resetFailedQuest();
  };

  // Development helper function
  const handleDevComplete = () => {
    if (activeQuest) {
      handleQuestComplete(true);
    }
  };

  // Render logic
  if (failedQuest) {
    // Render the QuestFailed component when a quest has failed
    return (
      <QuestFailed
        quest={failedQuest}
        onAcknowledge={handleAcknowledgeFailure}
      />
    );
  }

  if (showingCompletion && currentCompletion) {
    return (
      <QuestComplete
        quest={currentCompletion}
        onClaim={handleClaimReward}
        story={currentCompletion.story}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/onboarding-bg-2.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          {activeQuest ? (
            <>
              <View style={styles.header}>
                <ThemedText type="title">Active Quest</ThemedText>
                <ThemedText type="subtitle">
                  Your character is growing stronger while you're away
                </ThemedText>
              </View>
              <ActiveQuest onComplete={handleQuestComplete} />

              {/* Development Mode Button */}
              {Constants.expoConfig?.extra?.development && (
                <Pressable
                  style={styles.devButton}
                  onPressOut={handleDevComplete}
                >
                  <ThemedText type="bodyBold" style={styles.devButtonText}>
                    [DEV] Complete Quest Now
                  </ThemedText>
                </Pressable>
              )}

              <ThemedText type="bodyBold">
                Close the app and return when your quest timer is complete. Your
                progress will be saved automatically.
              </ThemedText>
            </>
          ) : (
            <View style={styles.availableQuestsContainer}>
              <View style={styles.header}>
                <ThemedText type="title">Next Quest</ThemedText>
                <ThemedText type="subtitle">Continue your journey</ThemedText>
              </View>

              {availableQuests.length > 0 ? (
                <QuestList
                  quests={availableQuests}
                  onSelectQuest={handleSelectQuest}
                />
              ) : (
                <ThemedView style={styles.noQuestsContainer}>
                  <ThemedText type="bodyLight">
                    No quests available at the moment. Complete your current
                    quest or check back later.
                  </ThemedText>
                </ThemedView>
              )}
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    padding: Spacing.md,
    paddingBottom: TAB_BAR_HEIGHT + Spacing.xl,
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
  questContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cream,
    padding: Spacing.lg,
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
  availableQuestsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  noQuestsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cream,
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  noQuestsText: {
    fontSize: FontSizes.md,
    color: Colors.cream,
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 24,
  },
  devButton: {
    backgroundColor: "#FF0000",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
    opacity: 0.8,
  },
  devButtonText: {
    color: Colors.cream,
    textAlign: "center",
    fontWeight: "600",
  },
});
