"use client";

import { useHermeticStore } from "./hermeticStore";
import { useUiStore } from "./uiStore";

// uiStore.stillness is the persistent "motion off" preference and the single
// source of truth; hermeticStore.stillnessMode mirrors it for the WebGL scene
// (and may additionally go still transiently while Space is held). Every
// persistent toggle must go through here so the two stores cannot drift.

export const setStillness = (next: boolean): void => {
  useUiStore.setState({ stillness: next });
  const { scrollProgress, setState } = useHermeticStore.getState();
  setState({
    stillnessMode: next,
    clarity: next ? 0.95 : 0.6 + scrollProgress * 0.2,
    intensity: next ? 0.35 : 0.7 - scrollProgress * 0.2,
  });
};

export const toggleStillness = (): void => {
  setStillness(!useUiStore.getState().stillness);
};
