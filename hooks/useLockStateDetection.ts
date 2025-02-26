/* Replace the existing content of hooks/useLockStateDetection.ts with the following code */
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

// Import the module directly. According to Expo docs, we can import our module like this.
import addLockListener from "@/modules/lock-state";

import { useQuestStore } from "@/store/quest-store";
import QuestTimer from "@/services/quest-timer";

export default function useLockStateDetection() {
  const backgroundTimestamp = useRef<number | null>(null);

  useEffect(() => {
    console.log("useLockStateDetection");
    if (Platform.OS !== "android") {
      // This module is only implemented for Android
      return;
    }

    console.log("useLockStateDetection registering listeners");

    // Subscribe to the device locking
    const lockSub = addLockListener("LOCKED", () => {
      console.log("Device locked!");
      backgroundTimestamp.current = Date.now();
    });

    // Subscribe to the device unlocking
    const unlockSub = addLockListener("UNLOCKED", async () => {
      console.log("Device unlocked!");
      const timeNow = Date.now();

      if (backgroundTimestamp.current) {
        const questStoreState = useQuestStore.getState();
        const activeQuest = questStoreState.activeQuest;
        const { completeQuest, failQuest } = questStoreState;

        // Only handle active quests
        if (activeQuest) {
          // Calculate quest duration and elapsed time
          const questDurationInSeconds = activeQuest.durationMinutes * 60;
          const timeSinceQuestStarted =
            (timeNow - activeQuest.startTime) / 1000;

          try {
            // Stop the background timer regardless of outcome
            await QuestTimer.stopQuest();
          } catch (error) {
            console.error("Error stopping quest", error);
          }

          if (timeSinceQuestStarted >= questDurationInSeconds) {
            // Quest should be completed - this is a fallback in case the background task failed
            console.log("Quest completed via unlock detection (fallback)");
            completeQuest();
            // Navigation will be handled by the useCompletedQuestCheck hook
          } else {
            // Quest failed because user returned too early
            console.log("Quest failed because user returned before time");
            failQuest();
            // The _layout.tsx will handle showing the failed quest screen
          }
        }

        backgroundTimestamp.current = null;
      }
    });

    // Set up notification handler for deep linking
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.screen === "quest-complete") {
          // The navigation will be handled by the useCompletedQuestCheck hook
          // when the recentCompletedQuest state is detected
        }
      }
    );

    return () => {
      // Clean up the subscriptions
      lockSub.remove();
      unlockSub.remove();
      subscription.remove();
    };
  }, []);

  return;
}
