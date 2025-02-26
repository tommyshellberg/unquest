import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Quest, QuestTemplate } from "./types";
import { AVAILABLE_QUESTS } from "@/app/data/quests";
import { usePOIStore } from "@/store/poi-store";
import QuestTimer from "@/services/quest-timer";

interface QuestState {
  activeQuest: Quest | null;
  pendingQuest: QuestTemplate | null;
  availableQuests: QuestTemplate[];
  failedQuest: Quest | QuestTemplate | null;
  completedQuests: Quest[];
  recentCompletedQuest: Quest | null;
  cancelQuest: () => void;
  startQuest: (quest: Quest) => void;
  completeQuest: (ignoreDuration?: boolean) => Quest | null;
  failQuest: () => void;
  refreshAvailableQuests: () => void;
  resetFailedQuest: () => void;
  clearRecentCompletedQuest: () => void;
  reset: () => void;
  getCompletedQuests: () => Quest[];
  prepareQuest: (quest: QuestTemplate) => void;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set, get) => ({
      activeQuest: null,
      pendingQuest: null,
      availableQuests: [],
      failedQuest: null,
      completedQuests: [],
      recentCompletedQuest: null,

      prepareQuest: (quest: QuestTemplate) => {
        set({ pendingQuest: quest, availableQuests: [] });
      },

      startQuest: (quest: Quest) => {
        const startedQuest = {
          ...quest,
          startTime: Date.now(),
        };
        set({ activeQuest: startedQuest, pendingQuest: null });
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
              recentCompletedQuest: completedQuest,
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

      cancelQuest: () => {
        const { activeQuest, pendingQuest } = get();
        if (activeQuest || pendingQuest) {
          set({ activeQuest: null, pendingQuest: null });
        }
        QuestTimer.stopQuest();
      },

      failQuest: () => {
        const { activeQuest, pendingQuest } = get();
        if (activeQuest || pendingQuest) {
          set({
            failedQuest: activeQuest || pendingQuest,
            activeQuest: null,
            pendingQuest: null,
          });
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

      clearRecentCompletedQuest: () => {
        set({ recentCompletedQuest: null });
      },

      getCompletedQuests: () => {
        return get().completedQuests;
      },

      reset: () => {
        set({
          activeQuest: null,
          pendingQuest: null,
          availableQuests: [],
          completedQuests: [],
          failedQuest: null,
          recentCompletedQuest: null,
        });
      },
    }),
    {
      name: "quest-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);