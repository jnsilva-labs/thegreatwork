"use client";

import { useEffect } from "react";
import { useHermeticStore } from "@/lib/hermeticStore";
import { getEngine, setPreset, setVolume, stop } from "@/lib/audio/engine";

export function AudioLayer() {
  const soundEnabled = useHermeticStore((state) => state.soundEnabled);
  const soundPreset = useHermeticStore((state) => state.soundPreset);
  const soundVolume = useHermeticStore((state) => state.soundVolume);
  const setSoundPlaying = useHermeticStore((state) => state.setSoundPlaying);

  useEffect(() => {
    if (!soundEnabled) {
      stop();
      setSoundPlaying(false);
    }
  }, [setSoundPlaying, soundEnabled]);

  useEffect(() => {
    if (!getEngine()) return;
    setPreset(soundPreset);
  }, [soundPreset]);

  useEffect(() => {
    if (!getEngine()) return;
    setVolume(soundVolume);
  }, [soundVolume]);

  return null;
}
