"use client";

import { useEffect, useRef } from "react";
import { useChapterNavigation } from "@/lib/useChapterNavigation";
import { useHermeticStore } from "@/lib/hermeticStore";

type SectionMeasure = {
  top: number;
  height: number;
};

export function ScrollOrchestrator() {
  const measuresRef = useRef<SectionMeasure[]>([]);
  const setState = useHermeticStore((state) => state.setState);
  const { goToChapter, slugs } = useChapterNavigation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const measureSections = () => {
      measuresRef.current = slugs
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            top: rect.top + window.scrollY,
            height: rect.height,
          };
        })
        .filter(Boolean) as SectionMeasure[];

      updateScroll();
    };

    let ticking = false;
    let lastChapter = 0;
    const updateScroll = () => {
      const viewportHeight = window.innerHeight || 1;
      const scrollY = window.scrollY || 0;
      const scrollMax = Math.max(document.body.scrollHeight - viewportHeight, 1);
      const overallProgress = clamp(scrollY / scrollMax);

      const progressByChapter = measuresRef.current.map(({ top, height }) => {
        const start = top - viewportHeight * 0.45;
        const end = top + height - viewportHeight * 0.3;
        return clamp((scrollY - start) / Math.max(end - start, 1));
      });

      const activeChapter = progressByChapter.reduce(
        (bestIndex, value, index, arr) =>
          value > arr[bestIndex] ? index : bestIndex,
        0
      );

      const shift = progressByChapter[activeChapter] ?? 0;
      const stillnessMode = useHermeticStore.getState().stillnessMode;
      const clarity = stillnessMode ? 0.9 : 0.6 + overallProgress * 0.2;
      const intensity = stillnessMode ? 0.4 : 0.7 - overallProgress * 0.2;

      setState({
        scrollProgress: overallProgress,
        activeChapter,
        principleId: activeChapter + 1,
        progressByChapter,
        shift,
        clarity,
        intensity,
      });

      if (activeChapter !== lastChapter) {
        const slug = slugs[activeChapter];
        if (slug) {
          window.history.replaceState(null, "", `#${slug}`);
        }
        lastChapter = activeChapter;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateScroll();
        ticking = false;
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      setState({ pointer: { x, y } });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setState({ stillnessMode: true, clarity: 0.95, intensity: 0.35 });
      }
      if (event.key === "ArrowRight") {
        goToChapter(
          Math.min(useHermeticStore.getState().activeChapter + 1, 6)
        );
      }
      if (event.key === "ArrowLeft") {
        goToChapter(
          Math.max(useHermeticStore.getState().activeChapter - 1, 0)
        );
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

    measureSections();
    window.addEventListener("resize", measureSections);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const initialHash = window.location.hash.replace("#", "");
    const hashIndex = slugs.indexOf(initialHash);
    if (hashIndex >= 0) {
      setTimeout(() => goToChapter(hashIndex), 40);
    }

    return () => {
      window.removeEventListener("resize", measureSections);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [goToChapter, setState, slugs]);

  return null;
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}
