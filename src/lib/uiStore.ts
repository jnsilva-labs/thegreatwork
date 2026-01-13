"use client";

import { create } from "zustand";

type UiState = {
  stillness: boolean;
  showUi: boolean;
  toggleStillness: () => void;
  toggleUi: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  stillness: false,
  showUi: true,
  toggleStillness: () => set((state) => ({ stillness: !state.stillness })),
  toggleUi: () => set((state) => ({ showUi: !state.showUi })),
}));
