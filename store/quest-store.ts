import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Quest } from "./types";
import { useCharacterStore } from "./character-store";

// Create a QuestTemplate type that doesn't include startedAt
export type QuestTemplate = Omit<Quest, "startedAt">;

export interface QuestCompletion {
  quest: Quest; // Store the full quest object in completion
  completedAt: number;
  story: string;
}

interface QuestState {
  activeQuest: Quest | null;
  availableQuests: Quest[];
  completedQuests: QuestCompletion[];
  startQuest: (quest: QuestTemplate) => void;
  completeQuest: () => QuestCompletion | null;
  refreshAvailableQuests: (characterLevel: number) => void;
}

// Use QuestTemplate type for available quests
export const AVAILABLE_QUESTS: QuestTemplate[] = [
  {
    id: "forest-meditation",
    title: "The Whispering Woods",
    description:
      "Take 15 minutes to step away from your phone and into the world around you. Let your thoughts roam free as you walk, observe the beauty of your surroundings, and reconnect with the present moment.",
    durationMinutes: 15,
    reward: { xp: 100 },
    minLevel: 1,
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `In a moment of profound stillness, ${character.name} discovered more than just peace in the Whispering Woods. 
      As the ancient trees swayed gently overhead, their wisdom seemed to seep into ${character.name}'s very being. 
      Through this simple act of presence, ${character.name} found that true strength often lies in moments of quiet contemplation. 
      The forest had taught a lesson that would resonate far beyond its peaceful borders.`;
    },
  },
  {
    id: "helping-stranger",
    title: "The Unexpected Friend",
    description: "Choose to help someone in need along your path.",
    durationMinutes: 20,
    reward: { xp: 150 },
    minLevel: 2,
    generateStory: (character) => {
      if (!character) throw new Error("Character not found");

      return `What began as a simple act of kindness blossomed into something extraordinary. 
      ${character.name} encountered a traveler struggling with their own journey, and without hesitation, offered assistance. 
      In that moment of connection, both ${character.name} and the stranger were reminded that the greatest adventures often come 
      from reaching out to others. Sometimes the most heroic acts are the smallest ones.`;
    },
  },
  // Add more quests with their own unique story generators
];

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      activeQuest: null,
      availableQuests: [],
      completedQuests: [],

      startQuest: (questTemplate) => {
        // Convert QuestTemplate to Quest by adding startedAt
        const quest: Quest = {
          ...questTemplate,
          startedAt: Date.now(),
        };
        set({ activeQuest: quest });
      },

      completeQuest: () => {
        const { activeQuest } = get();
        const character = useCharacterStore.getState().character;

        if (activeQuest && character) {
          const completion: QuestCompletion = {
            quest: activeQuest, // Store the full quest
            completedAt: Date.now(),
            story: activeQuest.generateStory(character),
          };

          set((state) => ({
            activeQuest: null,
            completedQuests: [...state.completedQuests, completion],
          }));

          return completion;
        }
        return null;
      },

      refreshAvailableQuests: (characterLevel) => {
        const availableQuests = AVAILABLE_QUESTS.filter(
          (quest) => quest.minLevel <= characterLevel
        )
          .map((quest) => ({
            ...quest,
            startedAt: Date.now(), // Convert to full Quest when making available
          }))
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        set({ availableQuests });
      },
    }),
    {
      name: "quest-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
