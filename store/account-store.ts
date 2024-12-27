import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Account, Minutes } from "./types";

interface AccountState {
  account: Account | null;
  createAccount: (screenTime: Minutes, goalTime: Minutes) => void;
  updateScreenTimeGoal: (minutes: Minutes) => void;
  updateAverageScreenTime: (minutes: Minutes) => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      account: null,

      createAccount: (screenTime, goalTime) =>
        set({
          account: {
            id: "1",
            averageScreenTimeMinutes: screenTime,
            screenTimeGoalMinutes: goalTime,
            created: Date.now(),
            lastActive: Date.now(),
          },
        }),

      updateScreenTimeGoal: (minutes) =>
        set((state) => ({
          account: state.account
            ? { ...state.account, screenTimeGoalMinutes: minutes }
            : null,
        })),

      updateAverageScreenTime: (minutes) =>
        set((state) => ({
          account: state.account
            ? { ...state.account, averageScreenTimeMinutes: minutes }
            : null,
        })),
    }),
    {
      name: "account-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
