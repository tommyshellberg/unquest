import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OnboardingState = {
  selectedCharacterId: string | null;
  currentScreenTime: number | null;
  goalScreenTime: number | null;
  // Actions
  setSelectedCharacter: (id: string) => void;
  setScreenTimes: (current: number, goal: number) => void;
  resetOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      selectedCharacterId: null,
      currentScreenTime: null,
      goalScreenTime: null,

      setSelectedCharacter: (id) => set({ selectedCharacterId: id }),

      setScreenTimes: (current, goal) =>
        set({
          currentScreenTime: current,
          goalScreenTime: goal,
        }),

      resetOnboarding: () =>
        set({
          selectedCharacterId: null,
          currentScreenTime: null,
          goalScreenTime: null,
        }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
