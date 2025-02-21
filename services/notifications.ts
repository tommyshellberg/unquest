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
      title: "Congratulations!",
      body: "You completed the quest. Uncover more about yourself and the kingdom.",
    },
    trigger: null, // null trigger means present immediately
  });
};
