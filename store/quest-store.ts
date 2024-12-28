import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Quest } from "./types";

// Quest definitions
export const AVAILABLE_QUESTS: Array<Omit<Quest, "startedAt">> = [
  {
    id: "first-quest",
    title: "The Mindful Explorer",
    description:
      "Take 15 minutes to step away from your phone and into the world around you. Let your thoughts roam free as you walk, observe the beauty of your surroundings, and reconnect with the present moment.",
    durationMinutes: 5 / 60, // 5 seconds for testing, @todo: change to 5 minutes
    reward: {
      xp: 100,
    },
    minLevel: 1,
  },
  {
    id: "plan-tomorrow",
    title: "The Day Weaver",
    description:
      "Take 10 minutes to mindfully plan your day ahead. Write down your intentions, priorities, and moments where you can practice mindfulness.",
    durationMinutes: 10,
    reward: {
      xp: 150,
    },
    minLevel: 2,
  },
  {
    id: "meditation-basics",
    title: "The Silent Observer",
    description:
      "Spend 10 minutes in meditation. Find a quiet space, close your eyes, and focus on your breath. Let thoughts come and go without judgment.",
    durationMinutes: 10,
    reward: {
      xp: 150,
    },
    minLevel: 2,
  },
  {
    id: "mindful-stretch",
    title: "The Gentle Warrior",
    description:
      "Dedicate 10 minutes to mindful stretching. Move slowly, breathe deeply, and pay attention to how your body feels in each pose.",
    durationMinutes: 10,
    reward: {
      xp: 150,
    },
    minLevel: 2,
  },
];

interface QuestState {
  activeQuest: Quest | null;
  completedQuests: Quest[];
  availableQuests: Array<Omit<Quest, "startedAt">>;
  setActiveQuest: (quest: Omit<Quest, "startedAt">) => void;
  completeQuest: () => void;
  abandonQuest: () => void;
  refreshAvailableQuests: (characterLevel: number) => void;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      activeQuest: null,
      completedQuests: [],
      availableQuests: [],

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

      refreshAvailableQuests: (characterLevel: number) => {
        const { completedQuests } = get();

        // Filter quests that:
        // 1. Meet the level requirement
        // 2. Haven't been completed
        // 3. Randomly select 3 quests from the filtered list
        const eligibleQuests = AVAILABLE_QUESTS.filter(
          (quest) =>
            quest.minLevel <= characterLevel &&
            !completedQuests.some((completed) => completed.id === quest.id)
        );

        // Randomly select up to 3 quests
        const selectedQuests = eligibleQuests
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        set({ availableQuests: selectedQuests });
      },
    }),
    {
      name: "quest-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
