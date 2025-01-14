import BackgroundService from "react-native-background-actions";
import { Quest } from "../store/types";

export class QuestTimer {
  private static activeQuest: Quest | null = null;
  private static startTime: number | null = null;

  static async startQuest(quest: Quest) {
    this.activeQuest = quest;
    this.startTime = Date.now();

    const options = {
      taskName: "QuestTimer",
      taskTitle: quest.title,
      taskDesc: quest.description,
      taskIcon: {
        name: "ic_launcher",
        type: "mipmap",
      },
      color: "#228B22", // forest green
      linkingURI: "unquest://quest", // Deep link back to app
      progressBar: {
        max: quest.durationMinutes * 60,
        value: 0,
        indeterminate: false,
      },
      parameters: {
        questDuration: quest.durationMinutes * 60 * 1000,
      },
      // Android specific options
      notification: {
        channelId: "quest-timer",
        channelName: "Quest Timer",
        channelDescription: "Shows progress of active quests",
        color: "#228B22",
        priority: "high",
        visibility: "public",
        ongoing: true,
      },
    };

    await BackgroundService.start(this.backgroundTask, options);
  }

  private static backgroundTask = async (taskData?: {
    questDuration: number;
  }) => {
    if (!taskData) return;

    const { questDuration } = taskData;

    while (BackgroundService.isRunning()) {
      const elapsedTime = Date.now() - (this.startTime || 0);
      const progress = Math.min((elapsedTime / questDuration) * 100, 100);

      // Update notification progress bar
      await BackgroundService.updateNotification({
        progressBar: {
          max: 100,
          value: progress,
          indeterminate: false,
        },
      });

      // Check if quest is complete
      if (elapsedTime >= questDuration) {
        await this.stopQuest();
        break;
      }

      // Update every second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  static async stopQuest() {
    if (BackgroundService.isRunning()) {
      await BackgroundService.stop();
    }
    this.activeQuest = null;
    this.startTime = null;
  }

  static isRunning(): boolean {
    return BackgroundService.isRunning();
  }
}
