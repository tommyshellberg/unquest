import BackgroundService from "react-native-bg-actions";
import { Quest, QuestTemplate } from "../store/types";
import { useQuestStore } from "@/store/quest-store";
import { scheduleQuestCompletionNotification } from "@/services/notifications";

export default class QuestTimer {
  private static isPhoneLocked: boolean = false;
  private static questStartTime: number | null = null;
  private static questTemplate: QuestTemplate | null = null;

  // Single entry point - prepare the quest and wait for phone lock
  static async prepareQuest(questTemplate: QuestTemplate) {
    console.log("preparing quest", questTemplate);
    this.questTemplate = questTemplate;
    this.questStartTime = null;

    const options = {
      taskName: "QuestTimer",
      taskTitle: "Quest Ready",
      taskDesc: "Lock your phone to begin your quest",
      taskIcon: {
        name: "ic_launcher",
        type: "mipmap",
      },
      color: "#228B22", // forest green
      progressBar: {
        max: 100,
        value: 0,
        indeterminate: true, // Show indeterminate progress until quest starts
      },
      parameters: {
        questDuration: questTemplate.durationMinutes * 60 * 1000,
        questTitle: questTemplate.title,
      },
    };

    await BackgroundService.start(this.backgroundTask, options);
  }

  // Called from the lock state listener when phone is locked
  static async onPhoneLocked() {
    console.log("Phone locked");
    this.isPhoneLocked = true;

    // If the quest hasn't started yet, start it now
    if (this.questTemplate && !this.questStartTime) {
      this.questStartTime = Date.now();
      console.log("Quest started at", new Date(this.questStartTime));

      // Update the quest in the store with the actual start time
      const questStoreState = useQuestStore.getState();
      questStoreState.startQuest({
        ...this.questTemplate,
        startTime: this.questStartTime,
      });

      console.log("Updating notification to show quest is in progress");
      // Update notification immediately to show quest is in progress
      await BackgroundService.updateNotification({
        taskTitle: `Quest in progress: ${this.questTemplate.title}`,
        taskDesc: `Keep your phone locked for ${this.questTemplate.durationMinutes} minutes to complete the quest`,
        progressBar: {
          max: 100,
          value: 0,
          indeterminate: false,
        },
      });
    }
  }

  // @todo: the expiration of the notification shouldn't just be the quest duration, but the quest duration at the time of the phone being locked.

  // Called from the lock state listener when phone is unlocked
  static async onPhoneUnlocked() {
    console.log("Phone unlocked");
    this.isPhoneLocked = false;
  }

  private static backgroundTask = async (taskData?: {
    questDuration: number;
    questTitle: string;
  }) => {
    console.log("Background task started", taskData);
    if (!taskData) return;

    const { questDuration, questTitle } = taskData;

    // Main background task loop
    while (BackgroundService.isRunning()) {
      // If the phone is locked and the quest has started
      if (this.isPhoneLocked && this.questStartTime) {
        const elapsedTime = Date.now() - this.questStartTime;
        const progress = Math.min((elapsedTime / questDuration) * 100, 100);

        // Update progress bar (no need to update title/description again)
        await BackgroundService.updateNotification({
          progressBar: {
            max: 100,
            value: progress,
            indeterminate: false,
          },
        });

        // Check if quest is complete
        if (elapsedTime >= questDuration) {
          console.log("Quest completed in background");

          // Mark quest as complete in the store
          const questStoreState = useQuestStore.getState();
          questStoreState.completeQuest(true);

          // Trigger the congratulatory notification
          scheduleQuestCompletionNotification();

          // Stop the background quest
          await this.stopQuest();
          break;
        }
      }
      // If the phone is unlocked and the quest has started but not completed
      else if (!this.isPhoneLocked && this.questStartTime) {
        const elapsedTime = Date.now() - this.questStartTime;

        // If the quest hasn't completed yet, it's a failure
        if (elapsedTime < questDuration) {
          console.log("Quest failed - phone unlocked too early");

          // Mark quest as failed in the store
          const questStoreState = useQuestStore.getState();
          questStoreState.failQuest();

          // Stop the background quest
          await this.stopQuest();
          break;
        }
      }
      // If the quest hasn't started yet, just wait
      else if (!this.questStartTime) {
        // Just waiting for phone to be locked
      }

      // Update interval equal to 1% of the question duration, or 1 second whichever is longer
      const updateInterval = Math.max(questDuration / 100, 1000);
      await new Promise((resolve) => setTimeout(resolve, updateInterval));
    }
  };

  static async stopQuest() {
    console.log("Stopping quest");
    if (BackgroundService.isRunning()) {
      await BackgroundService.stop();
    }
    this.questTemplate = null;
    this.questStartTime = null;
  }

  static isRunning(): boolean {
    return BackgroundService.isRunning();
  }
}
