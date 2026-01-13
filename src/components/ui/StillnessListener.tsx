"use client";

import { useEffect } from "react";
import { useHermeticStore } from "@/lib/hermeticStore";

export function StillnessListener() {
  const setState = useHermeticStore((state) => state.setState);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setState({ stillnessMode: true, clarity: 0.95, intensity: 0.35 });
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        const scrollProgress = useHermeticStore.getState().scrollProgress;
        setState({
          stillnessMode: false,
          clarity: 0.6 + scrollProgress * 0.2,
          intensity: 0.7 - scrollProgress * 0.2,
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [setState]);

  return null;
}
