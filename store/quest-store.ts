import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Quest } from "./types";
import { useCharacterStore } from "./character-store";
import { AVAILABLE_QUESTS } from "@/app/data/quests";
import { usePOIStore } from "./poi-store";
// Create a QuestTemplate type that doesn't include startedAt
export type QuestTemplate = Omit<Quest, "startedAt">;

export interface QuestCompletion {
  quest: Quest; // Store the full quest object in completion
  completedAt: number;
  story: string;
}

interface QuestState {
  activeQuest: Quest | null;
  availableQuests: QuestTemplate[];
  completedQuests: QuestCompletion[];
  failedQuest: Quest | null;
  startQuest: (questTemplate: QuestTemplate, startedAt?: number) => void;
  completeQuest: () => QuestCompletion | null;
  refreshAvailableQuests: (characterLevel: number) => void;
  failQuest: () => void;
  resetFailedQuest: () => void;
  reset: () => void;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      activeQuest: null,
      availableQuests: [],
      completedQuests: [],
      failedQuest: null,

      startQuest: (questTemplate, startedAt?: number) => {
        const quest: Quest = {
          ...questTemplate,
          startedAt: startedAt ?? Date.now(),
        };
        set({ activeQuest: quest });
      },

      completeQuest: () => {
        const { activeQuest } = get();
        const character = useCharacterStore.getState().character;

        if (activeQuest && character) {
          // Retrieve the original quest template
          const questTemplate = AVAILABLE_QUESTS.find(
            (quest) => quest.id === activeQuest.id
          );

          if (!questTemplate || !questTemplate.generateStory) {
            console.error(
              `generateStory not found for quest with id ${activeQuest.id}`
            );
            return null;
          }

          const completion: QuestCompletion = {
            quest: activeQuest, // Store the full quest object (without functions)
            completedAt: Date.now(),
            story: questTemplate.generateStory(character),
          };

          usePOIStore.getState().revealLocation(activeQuest.poiSlug);

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
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        set({ availableQuests });
      },

      failQuest: () => {
        const { activeQuest } = get();
        if (activeQuest) {
          set({
            failedQuest: activeQuest,
            activeQuest: null,
          });
        }
      },

      resetFailedQuest: () => {
        set({ failedQuest: null });
      },

      reset: () => {
        set({
          activeQuest: null,
          availableQuests: [],
          completedQuests: [],
          failedQuest: null,
        });
      },
    }),
    {
      name: "quest-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
