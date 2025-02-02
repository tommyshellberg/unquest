import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Minutes, Quest, Reward } from "./types";
import { AVAILABLE_QUESTS } from "@/app/data/quests";
import { Character } from "@/store/types"; // Ensure this import exists
import { usePOIStore } from "@/store/poi-store"; // Import the POI store
import { useCharacterStore } from "./character-store";

export interface QuestCompletion {
  quest: Quest;
  story: string;
}

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  durationMinutes: Minutes;
  reward: Reward;
  poiSlug: string;
  story: string;
}

interface QuestState {
  activeQuest: Quest | null;
  availableQuests: QuestTemplate[];
  completedQuestIds: string[];
  failQuest: () => void;
  failedQuest: Quest | null;
  startQuest: (quest: Quest) => void;
  completeQuest: (ignoreDuration?: boolean) => QuestCompletion | null;
  refreshAvailableQuests: () => void;
  resetFailedQuest: () => void;
  reset: () => void;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      activeQuest: null,
      availableQuests: [],
      completedQuestIds: [],
      failedQuest: null,

      startQuest: (quest: Quest) => {
        set({ activeQuest: quest });
        set({ availableQuests: [] });
      },

      completeQuest: (ignoreDuration = false) => {
        const { activeQuest, completedQuestIds } = get();
        console.log("activeQuest", activeQuest);
        console.log("completedQuestIds", completedQuestIds);
        const character = useCharacterStore.getState().character;
        if (activeQuest && activeQuest.startTime && character) {
          const completionTime = Date.now();
          const duration = (completionTime - activeQuest.startTime) / 1000;
          if (ignoreDuration || duration >= activeQuest.durationMinutes * 60) {
            // Quest completed successfully
            console.log("Quest completed successfully");
            set({
              activeQuest: null,
              completedQuestIds: [...completedQuestIds, activeQuest.id],
            });
            // Generate the story
            const story = activeQuest.story;

            // Reveal the associated POI
            usePOIStore.getState().revealLocation(activeQuest.poiSlug);

            // Return quest completion data for UI
            return {
              quest: activeQuest,
              story,
            };
          } else {
            // Quest failed
            console.log("Quest failed");
            get().failQuest();
            return null;
          }
        }
        return null;
      },

      failQuest: () => {
        const { activeQuest } = get();
        if (activeQuest) {
          set({ failedQuest: activeQuest, activeQuest: null });
        }
      },

      refreshAvailableQuests: () => {
        const { activeQuest, completedQuestIds } = get();
        if (!activeQuest) {
          // Get the next quest in AVAILABLE_QUESTS that hasn't been completed
          const nextQuest = AVAILABLE_QUESTS.find(
            (quest) => !completedQuestIds.includes(quest.id)
          );
          if (nextQuest) {
            set({ availableQuests: [nextQuest] });
          } else {
            // All quests completed
            set({ availableQuests: [] });
          }
        }
      },

      resetFailedQuest: () => {
        set({ failedQuest: null });
      },

      reset: () => {
        set({
          activeQuest: null,
          availableQuests: [],
          completedQuestIds: [],
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