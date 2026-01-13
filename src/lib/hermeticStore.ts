"use client";

import { create } from "zustand";

export type QualityTier = "low" | "medium" | "high";

export type PointerVector = {
  x: number;
  y: number;
};

export type SoundPreset =
  | "aether-drone"
  | "cathedral"
  | "lunar-pulse"
  | "mercury-glass"
  | "saturn-deep";

export type CameraOverride = {
  position: [number, number, number];
  target: [number, number, number];
};

type HermeticState = {
  principleId: number;
  shift: number;
  intensity: number;
  clarity: number;
  lineOpacityScale: number;
  lineRadiusScale: number;
  particleScale: number;
  particleBrightness: number;
  veilIntensity: number;
  postBoost: number;
  cameraOverride: CameraOverride | null;
  stillnessMode: boolean;
  qualityTier: QualityTier;
  autoQuality: boolean;
  soundEnabled: boolean;
  soundPlaying: boolean;
  soundPreset: SoundPreset;
  soundVolume: number;
  pointer: PointerVector;
  scrollProgress: number;
  activeChapter: number;
  progressByChapter: number[];
  setState: (data: Partial<HermeticState>) => void;
  setQuality: (tier: QualityTier) => void;
  setAutoQuality: (auto: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundPreset: (preset: SoundPreset) => void;
  setSoundPlaying: (playing: boolean) => void;
  setSoundVolume: (volume: number) => void;
};

export const useHermeticStore = create<HermeticState>((set) => ({
  principleId: 1,
  shift: 0,
  intensity: 0.6,
  clarity: 0.5,
  lineOpacityScale: 1,
  lineRadiusScale: 1,
  particleScale: 1,
  particleBrightness: 1,
  veilIntensity: 1,
  postBoost: 0,
  cameraOverride: null,
  stillnessMode: false,
  qualityTier: "high",
  autoQuality: true,
  soundEnabled: false,
  soundPlaying: false,
  soundPreset: "aether-drone",
  soundVolume: 0.15,
  pointer: { x: 0, y: 0 },
  scrollProgress: 0,
  activeChapter: 0,
  progressByChapter: Array.from({ length: 7 }, () => 0),
  setState: (data) => set((state) => ({ ...state, ...data })),
  setQuality: (tier) => set({ qualityTier: tier }),
  setAutoQuality: (auto) => set({ autoQuality: auto }),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setSoundPreset: (preset) => set({ soundPreset: preset }),
  setSoundPlaying: (playing) => set({ soundPlaying: playing }),
  setSoundVolume: (volume) => set({ soundVolume: volume }),
}));
