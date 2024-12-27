import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Character, CharacterType, XP } from "./types";

interface CharacterState {
  character: Character | null;
  createCharacter: (type: CharacterType, name: string) => void;
  addXP: (amount: XP) => void;
}

const INITIAL_CHARACTER: Omit<Character, "type" | "name"> = {
  id: "1",
  level: 1,
  currentXP: 0,
  xpToNextLevel: 100,
};

const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const useCharacterStore = create<CharacterState>()(
  persist(
    (set, get) => ({
      character: null,

      createCharacter: (type, name) =>
        set({
          character: {
            ...INITIAL_CHARACTER,
            type,
            name,
          },
        }),

      addXP: (amount) => {
        const { character } = get();
        if (!character) return;

        let newXP = character.currentXP + amount;
        let newLevel = character.level;
        let xpToNext = character.xpToNextLevel;

        // Level up logic
        while (newXP >= xpToNext) {
          newXP -= xpToNext;
          newLevel++;
          xpToNext = calculateXPForLevel(newLevel);
        }

        set({
          character: {
            ...character,
            level: newLevel,
            currentXP: newXP,
            xpToNextLevel: xpToNext,
          },
        });
      },
    }),
    {
      name: "character-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
