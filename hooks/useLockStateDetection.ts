import { useEffect, useRef } from "react";
import { NativeEventEmitter, NativeModules, Platform } from "react-native";
import { useQuestStore } from "@/store/quest-store";
import type { Quest, QuestTemplate } from "@/store/types";

export function useLockStateDetection() {
  const { LockState } = NativeModules;

  const backgroundTimestamp = useRef<number | null>(null);

  useEffect(() => {
    if (Platform.OS !== "android") {
      // This module is only implemented for Android
      return;
    }

    const lockStateEmitter = new NativeEventEmitter(LockState);

    const onLocked = () => {
      console.log("Device Locked");
      backgroundTimestamp.current = Date.now();
    };

    const onUnlocked = () => {
      console.log("Device Unlocked");
      const timeNow = Date.now();

      console.log("backgroundTimestamp", backgroundTimestamp.current);

      if (backgroundTimestamp.current) {
        const timeWentToBackground = backgroundTimestamp.current;
        const timeSpentInBackground = (timeNow - timeWentToBackground) / 1000; // in seconds

        const questStoreState = useQuestStore.getState();
        const activeQuest = questStoreState.activeQuest;
        const availableQuests = questStoreState.availableQuests;
        const completeQuest = questStoreState.completeQuest;
        const failQuest = questStoreState.failQuest;

        console.log("Active Quest:", activeQuest);
        console.log("Available Quests:", availableQuests);

        if (!activeQuest && availableQuests.length > 0) {
          // No active quest, start a new quest retroactively
          const questToStart = availableQuests[0];
          startQuestAt(questToStart, timeWentToBackground);

          const questDurationInSeconds = questToStart.durationMinutes * 60;
          const timeSinceQuestStarted = (timeNow - timeWentToBackground) / 1000;

          if (timeSinceQuestStarted >= questDurationInSeconds) {
            // Quest duration has passed, complete the quest
            completeQuest();
          } else {
            // Quest is still active
          }
        } else if (activeQuest) {
          // There was an active quest
          const questDurationInSeconds = activeQuest.durationMinutes * 60;
          const timeSinceQuestStarted =
            (timeNow - activeQuest.startTime) / 1000;

          if (timeSinceQuestStarted >= questDurationInSeconds) {
            // Quest duration has passed, complete the quest
            completeQuest();
          } else {
            // Quest failed because user returned before time
            failQuest();
          }
        }

        backgroundTimestamp.current = null;
      }
    };

    const lockedListener = lockStateEmitter.addListener("LOCKED", onLocked);
    const unlockedListener = lockStateEmitter.addListener(
      "UNLOCKED",
      onUnlocked
    );

    return () => {
      lockedListener.remove();
      unlockedListener.remove();
    };
  }, []);

  // Helper function to start a quest at a specific time
  const startQuestAt = (questTemplate: QuestTemplate, startTime: number) => {
    const quest: Quest = {
      ...questTemplate,
      startTime,
    };
    useQuestStore.setState({ activeQuest: quest });
  };
}
