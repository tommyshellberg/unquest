import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // This means even in-app, we show the alert.
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const scheduleQuestCompletionNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Quest Completed!",
      body: "Your quest has been completed successfully. Claim your reward!",
      data: { screen: "quest-complete" },
    },
    trigger: null, // Show immediately
  });
};

export function setupNotifications() {
  // Configure how notifications appear when the app is in the foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}
