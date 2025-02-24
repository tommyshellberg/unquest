import { useEffect, useRef } from "react";
import { NativeEventEmitter, NativeModules, Platform } from "react-native";
import { useQuestStore } from "@/store/quest-store";
import QuestTimer from "@/services/quest-timer";

export default function useLockStateDetection() {
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

    const onUnlocked = async () => {
      console.log("Device Unlocked");
      const timeNow = Date.now();

      console.log("backgroundTimestamp", backgroundTimestamp.current);

      if (backgroundTimestamp.current) {
        const questStoreState = useQuestStore.getState();
        const activeQuest = questStoreState.activeQuest;

        const { completeQuest, failQuest } = questStoreState;

        console.log("activeQuest", activeQuest);

        if (activeQuest) {
          // There was an active quest
          const questDurationInSeconds = activeQuest.durationMinutes * 60;
          const timeSinceQuestStarted =
            (timeNow - activeQuest.startTime) / 1000;

          console.log("timeSinceQuestStarted", timeSinceQuestStarted);
          try {
            await QuestTimer.stopQuest();
          } catch (error) {
            console.error("Error stopping quest", error);
          }

          if (timeSinceQuestStarted >= questDurationInSeconds) {
            // Quest duration has passed, complete the quest
            console.log("Quest completed because time has passed");
            completeQuest();
          } else {
            // Quest failed because user returned before time
            console.log("Quest failed because user returned before time");
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
}
