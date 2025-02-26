import React from "react";
import { View } from "react-native";
import { QuestComplete as QuestCompleteComponent } from "@/components/QuestComplete";
import { useQuestStore } from "@/store/quest-store";
import { useCharacterStore } from "@/store/character-store";
import { router } from "expo-router";
import { layoutStyles } from "@/styles/layouts";

export default function QuestCompleteScreen() {
  console.log("QuestCompleteScreen");
  const recentCompletedQuest = useQuestStore(
    (state) => state.recentCompletedQuest
  );
  const clearRecentCompletedQuest = useQuestStore(
    (state) => state.clearRecentCompletedQuest
  );
  const addXP = useCharacterStore((state) => state.addXP);
  console.log("recentCompletedQuest", recentCompletedQuest);

  // If there's no quest to display, redirect to home
  if (!recentCompletedQuest) {
    console.log("no quest to display, redirecting to home");
    router.replace("/home");
    return <View style={layoutStyles.fullScreen} />;
  }

  const handleClaimReward = async () => {
    try {
      // Add XP for completing the quest
      addXP(recentCompletedQuest.reward.xp);

      // Clear the recent completed quest state
      clearRecentCompletedQuest();

      // Navigate to profile screen
      router.replace("/profile");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <QuestCompleteComponent
      quest={recentCompletedQuest}
      onClaim={handleClaimReward}
      story={recentCompletedQuest.story}
    />
  );
}
