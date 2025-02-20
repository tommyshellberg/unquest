import * as Notifications from "expo-notifications";
import { Quest } from "@/store/types";

export async function scheduleQuestCompletionNotification(quest: Quest) {
  const trigger = new Date(Date.now() + quest.durationMinutes * 60 * 1000);
  console.log("Scheduling quest completion notification for", trigger);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Quest Complete! 🎉",
      body: `${quest.title} has been completed. Click to read your tale of adventure!`,
      data: { questId: quest.id },
    },
    trigger,
  });
}

export function setupNotificationHandler(navigation: any) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Handle notification taps
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const questId = response.notification.request.content.data.questId;
      console.log("Navigating to QuestComplete", questId);
      navigation.navigate("QuestComplete", { questId });
    }
  );

  return () => subscription.remove();
}

// Request permissions for notifications
export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.warn("Failed to get push token for notifications!");
    return;
  }
}

// Schedules a static local notification.
// The endTime should be a timestamp (in ms) after which the quest would be completed.
export async function scheduleQuestNotification(endTime: number) {
  const date = new Date(endTime);
  const formattedTime = date.toLocaleTimeString(); // Format as desired

  const content = {
    title: "Quest In Progress",
    body: `Your character has started a quest! Stay off your phone until ${formattedTime} to complete the quest.`,
    sound: true,
  };

  console.log("Scheduling quest notification for", formattedTime);

  // Schedule the notification immediately.
  await Notifications.scheduleNotificationAsync({
    content,
    trigger: endTime,
  });
}
