/* Replace the existing content of hooks/useLockStateDetection.ts with the following code */
import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

// Import the module directly
import addLockListener from "@/modules/lock-state";
import QuestTimer from "@/services/quest-timer";

export default function useLockStateDetection() {
  useEffect(() => {
    console.log("useLockStateDetection");
    if (Platform.OS !== "android") {
      // This module is only implemented for Android
      return;
    }

    console.log("useLockStateDetection registering listeners");

    // Subscribe to the device locking
    const lockSub = addLockListener("LOCKED", async () => {
      console.log("Device locked!");

      // Notify QuestTimer that the phone is locked
      await QuestTimer.onPhoneLocked();
    });

    // Subscribe to the device unlocking
    const unlockSub = addLockListener("UNLOCKED", async () => {
      console.log("Device unlocked!");

      // Notify QuestTimer that the phone is unlocked
      await QuestTimer.onPhoneUnlocked();
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
