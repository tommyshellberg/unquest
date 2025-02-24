import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Quest, QuestTemplate } from "./types";
import { AVAILABLE_QUESTS } from "@/app/data/quests";
import { usePOIStore } from "@/store/poi-store";
import QuestTimer from "@/services/quest-timer";

interface QuestState {
  activeQuest: Quest | null;
  availableQuests: QuestTemplate[];
  failedQuest: Quest | null;
  completedQuests: Quest[];
  startQuest: (quest: Quest) => void;
  completeQuest: (ignoreDuration?: boolean) => Quest | null;
  failQuest: () => void;
  refreshAvailableQuests: () => void;
  resetFailedQuest: () => void;
  reset: () => void;
  getCompletedQuests: () => Quest[];
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      activeQuest: null,
      availableQuests: [],
      failedQuest: null,
      completedQuests: [],

      startQuest: (quest: Quest) => {
        const startedQuest = {
          ...quest,
          startTime: Date.now(),
        };
        set({ activeQuest: startedQuest, availableQuests: [] });
        QuestTimer.startQuest(quest);
      },

      completeQuest: (ignoreDuration = false) => {
        const { activeQuest } = get();
        if (activeQuest && activeQuest.startTime) {
          const completionTime = Date.now();
          const duration = (completionTime - activeQuest.startTime) / 1000;
          if (ignoreDuration || duration >= activeQuest.durationMinutes * 60) {
            // Quest completed successfully
            const completedQuest = {
              ...activeQuest,
              completedAt: completionTime,
            };

            set((state) => ({
              activeQuest: null,
              completedQuests: [...state.completedQuests, completedQuest],
            }));

            // Reveal the associated POI
            usePOIStore.getState().revealLocation(activeQuest.poiSlug);

            return completedQuest;
          } else {
            // Quest failed
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
        QuestTimer.stopQuest();
      },

      refreshAvailableQuests: () => {
        const { activeQuest, completedQuests } = get();
        if (!activeQuest) {
          // Get the next quest in AVAILABLE_QUESTS that hasn't been completed
          const nextQuest = AVAILABLE_QUESTS.find(
            (quest) =>
              !completedQuests.some((completed) => completed.id === quest.id)
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

      getCompletedQuests: () => {
        return get().completedQuests;
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