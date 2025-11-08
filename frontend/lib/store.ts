import { create } from "zustand";
import type { Analysis } from "@/types";

interface AppState {
  currentAnalysis: Analysis | null;
  setCurrentAnalysis: (analysis: Analysis | null) => void;

  userScore: number | null;
  setUserScore: (score: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentAnalysis: null,
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  userScore: null,
  setUserScore: (score) => set({ userScore: score }),
}));

