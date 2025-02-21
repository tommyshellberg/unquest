import BackgroundService from "react-native-background-actions";
import { Quest, QuestTemplate } from "../store/types";

export class QuestTimer {
  private static activeQuest: Quest | null = null;
  private static startTime: number | null = null;

  static async startQuest(questTemplate: QuestTemplate) {
    console.log("starting quest", questTemplate);
    const quest = { ...questTemplate, startTime: Date.now() };
    this.activeQuest = quest;
    this.startTime = Date.now();

    const options = {
      taskName: "QuestTimer",
      taskTitle: `Quest started: ${quest.title}`,
      taskDesc: `Keep your phone locked for ${quest.durationMinutes} minutes to complete the quest`,
      taskIcon: {
        name: "ic_launcher",
        type: "mipmap",
      },
      color: "#228B22", // forest green
      progressBar: {
        max: quest.durationMinutes * 60,
        value: 0,
        indeterminate: false,
      },
      parameters: {
        questDuration: quest.durationMinutes * 60 * 1000,
      },
    };

    await BackgroundService.start(this.backgroundTask, options);
  }

  private static backgroundTask = async (taskData?: {
    questDuration: number;
  }) => {
    console.log("Background task started");
    console.log("taskData", taskData);
    if (!taskData) return;

    const { questDuration } = taskData;

    while (BackgroundService.isRunning()) {
      const elapsedTime = Date.now() - (this.startTime || 0);
      const progress = Math.min((elapsedTime / questDuration) * 100, 100);

      // Update notification progress bar
      console.log("Updating notification progress bar", progress);
      await BackgroundService.updateNotification({
        progressBar: {
          max: 100,
          value: progress,
          indeterminate: false,
        },
      });

      // Check if quest is complete
      if (elapsedTime >= questDuration) {
        console.log("Quest completed");
        await this.stopQuest();
        break;
      }

      // Update every second
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  };

  static async stopQuest() {
    console.log("Stopping quest");
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
