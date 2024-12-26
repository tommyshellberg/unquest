import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Quest = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  startedAt: number | null; // Unix timestamp
};

type QuestState = {
  activeQuest: Quest | null;
  // Actions
  startQuest: (quest: Omit<Quest, "startedAt">) => void;
  completeQuest: () => void;
  abandonQuest: () => void;
};

export const useQuestStore = create<QuestState>()(
  persist(
    (set) => ({
      activeQuest: null,

      startQuest: (quest) =>
        set({
          activeQuest: {
            ...quest,
            startedAt: Date.now(),
          },
        }),

      completeQuest: () => set({ activeQuest: null }),

      abandonQuest: () => set({ activeQuest: null }),
    }),
    {
      name: "quest-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Define our first quest
export const FIRST_QUEST: Omit<Quest, "startedAt"> = {
  id: "first-quest",
  title: "The Mindful Explorer",
  description:
    "Take 15 minutes to step away from your phone and into the world around you. Let your thoughts roam free as you walk, observe the beauty of your surroundings, and reconnect with the present moment.",
  durationMinutes: 15,
};
