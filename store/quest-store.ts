import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Quest, Reward } from "./types";

interface QuestState {
  activeQuest: Quest | null;
  completedQuests: Quest[];
  setActiveQuest: (quest: Omit<Quest, "startedAt">) => void;
  completeQuest: () => void;
  abandonQuest: () => void;
}

// Quest definitions
export const FIRST_QUEST: Omit<Quest, "startedAt"> = {
  id: "first-quest",
  title: "The Mindful Explorer",
  description:
    "Take 15 minutes to step away from your phone and into the world around you. Let your thoughts roam free as you walk, observe the beauty of your surroundings, and reconnect with the present moment.",
  durationMinutes: 5 / 60, // 5 seconds for testing
  reward: {
    xp: 100,
  },
};

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      activeQuest: null,
      completedQuests: [],

      setActiveQuest: (quest) =>
        set({
          activeQuest: {
            ...quest,
            startedAt: Date.now(),
          },
        }),

      completeQuest: () => {
        const { activeQuest, completedQuests } = get();
        if (activeQuest) {
          set({
            activeQuest: null,
            completedQuests: [...completedQuests, activeQuest],
          });
        }
      },

      abandonQuest: () => set({ activeQuest: null }),
    }),
    {
      name: "quest-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
