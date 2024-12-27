import * as Notifications from "expo-notifications";

// Configure notifications to show in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });
  return status === "granted";
}

export async function updateQuestProgressNotification(
  title: string,
  minutesRemaining: number,
  totalMinutes: number
) {
  const progress = 1 - minutesRemaining / totalMinutes;

  await Notifications.setNotificationChannelAsync("quest-progress", {
    name: "Quest Progress",
    importance: Notifications.AndroidImportance.DEFAULT,
    enableVibrate: false,
    showBadge: false,
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Quest in Progress: ${title}`,
      body: `${minutesRemaining} minutes remaining`,
      // Android specific
      progress: progress,
      ongoing: true,
      sticky: true,
      // iOS specific
      subtitle: `${Math.round(progress * 100)}% Complete`,
    },
    trigger: null,
    identifier: "quest-progress",
  });
}

export async function removeQuestProgressNotification() {
  await Notifications.dismissNotificationAsync("quest-progress");
}
