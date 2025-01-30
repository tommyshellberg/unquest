import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { INITIAL_POIS } from "@/app/data/pois";

export type POI = {
  slug: string;
  name: string;
  x: number;
  y: number;
  isRevealed: boolean;
};

interface POIState {
  pois: POI[];
  revealLocation: (slug: string) => void;
  reset: () => void;
}

export const usePOIStore = create<POIState>()(
  persist(
    (set, get) => ({
      pois: INITIAL_POIS,

      revealLocation: (slug) => {
        set((state) => ({
          pois: state.pois.map((poi) =>
            poi.slug === slug ? { ...poi, isRevealed: true } : poi
          ),
        }));
      },
      reset: () => {
        set({
          pois: INITIAL_POIS,
        });
      },
    }),
    {
      name: "poi-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
