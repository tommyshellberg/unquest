import * as Notifications from "expo-notifications";
import { Quest } from "@/store/types";

export async function scheduleQuestCompletionNotification(quest: Quest) {
  const trigger = new Date(Date.now() + quest.durationMinutes * 60 * 1000);

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
      navigation.navigate("QuestComplete", { questId });
    }
  );

  return () => subscription.remove();
}
