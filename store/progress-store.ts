"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { learningUnits } from "@/data/learning-units";
import { INITIAL_BRAINCELLS } from "@/lib/progress";

type ProgressState = {
  version: 1;
  aura: number;
  braincells: number;
  completedUnits: string[];
  completedChallenges: string[];
  currentUnit?: string;
  debugUnlockAll: boolean;
  awardChallenge: (challengeId: string, aura: number, braincellCost: number) => boolean;
  completeUnit: (unitId: string) => boolean;
  setCurrentUnit: (unitId?: string) => void;
  setDebugUnlockAll: (enabled: boolean) => void;
  resetProgress: () => void;
};

export const initialProgress = {
  version: 1 as const,
  aura: 0,
  braincells: INITIAL_BRAINCELLS,
  completedUnits: [] as string[],
  completedChallenges: [] as string[],
  currentUnit: undefined,
  debugUnlockAll: false,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialProgress,
      awardChallenge: (challengeId, aura, braincellCost) => {
        if (get().completedChallenges.includes(challengeId)) return false;

        set((state) => ({
          aura: state.aura + aura,
          braincells: Math.max(0, state.braincells - braincellCost),
          completedChallenges: [...state.completedChallenges, challengeId],
        }));
        return true;
      },
      completeUnit: (unitId) => {
        if (get().completedUnits.includes(unitId)) return false;

        set((state) => ({
          aura: state.aura + 5,
          completedUnits: [...state.completedUnits, unitId],
          currentUnit: undefined,
        }));
        return true;
      },
      setCurrentUnit: (currentUnit) => set({ currentUnit }),
      setDebugUnlockAll: (debugUnlockAll) => set({ debugUnlockAll }),
      resetProgress: () => set(initialProgress),
    }),
    {
      name: "vods-meme-progress",
      version: 1,
    }
  )
);

export function isUnitUnlocked(
  unitId: string,
  completedUnits: string[],
  debugUnlockAll: boolean
) {
  const unitIndex = learningUnits.findIndex((unit) => unit.id === unitId);
  if (unitIndex <= 0 || debugUnlockAll) return true;
  return completedUnits.includes(learningUnits[unitIndex - 1].id);
}
