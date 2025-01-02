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
  {
    id: "gratitude-reflection",
    title: "The Grateful Sage",
    description:
      "Spend 15 minutes reflecting on three things you're grateful for. Write them down and consider how they’ve impacted your life.",
    durationMinutes: 15,
    reward: {
      xp: 200,
    },
    minLevel: 3,
  },
  {
    id: "create-something",
    title: "The Inspired Artisan",
    description:
      "Spend 15 minutes creating something—draw, write, or build. Let your imagination guide you without distractions.",
    durationMinutes: 15,
    reward: {
      xp: 200,
    },
    minLevel: 3,
  },
  {
    id: "learn-something-new",
    title: "The Curious Scholar",
    description:
      "Dedicate 15 minutes to learning something new. Read an article, watch an educational video, or try a new skill.",
    durationMinutes: 15,
    reward: {
      xp: 200,
    },
    minLevel: 3,
  },

  // Level 4 Quests
  {
    id: "forest-bathing",
    title: "The Nature Walker",
    description:
      "Spend 20 minutes walking in nature. Leave your phone behind and immerse yourself in the sights, sounds, and smells of the natural world.",
    durationMinutes: 20,
    reward: {
      xp: 250,
    },
    minLevel: 4,
  },
  {
    id: "declutter-space",
    title: "The Order Bringer",
    description:
      "Take 20 minutes to declutter a small area of your home or workspace. Create a sense of order and calm in your surroundings.",
    durationMinutes: 20,
    reward: {
      xp: 250,
    },
    minLevel: 4,
  },
  {
    id: "practice-kindness",
    title: "The Heartful Companion",
    description:
      "Spend 20 minutes practicing kindness. Write a thoughtful message, help someone in need, or connect with a loved one.",
    durationMinutes: 20,
    reward: {
      xp: 250,
    },
    minLevel: 4,
  },

  // Level 5 Quests
  {
    id: "cook-a-meal",
    title: "The Culinary Alchemist",
    description:
      "Spend 25 minutes preparing a simple meal from scratch. Focus on the ingredients, the process, and the joy of creating something nourishing.",
    durationMinutes: 25,
    reward: {
      xp: 300,
    },
    minLevel: 5,
  },
  {
    id: "focus-deep-work",
    title: "The Silent Mastermind",
    description:
      "Set aside 25 minutes for deep, focused work on a project or task. No distractions—just you and your goal.",
    durationMinutes: 25,
    reward: {
      xp: 300,
    },
    minLevel: 5,
  },
  {
    id: "self-care-ritual",
    title: "The Healing Mystic",
    description:
      "Dedicate 25 minutes to a self-care ritual. Take a bath, practice skincare, or simply relax in a way that rejuvenates you.",
    durationMinutes: 25,
    reward: {
      xp: 300,
    },
    minLevel: 5,
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
