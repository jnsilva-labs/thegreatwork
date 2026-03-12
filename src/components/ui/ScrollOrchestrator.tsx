"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useHermeticStore } from "@/lib/hermeticStore";
import { useUiStore } from "@/lib/uiStore";

type SectionMeasure = {
  id: string;
  top: number;
  height: number;
};

type ScrollOrchestratorProps = {
  slugs: string[];
};

declare global {
  interface Window {
    __AP_LENIS__?: Lenis;
  }
}

export function ScrollOrchestrator({ slugs }: ScrollOrchestratorProps) {
  const measuresRef = useRef<SectionMeasure[]>([]);
  const heroMeasureRef = useRef<SectionMeasure | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeChapterRef = useRef(0);
  const setState = useHermeticStore((state) => state.setState);
  const reducedMotion = usePrefersReducedMotion();
  const stillness = useUiStore((state) => state.stillness);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionDisabled = reducedMotion || stillness;

    const measure = () => {
      heroMeasureRef.current = measureElement("hero");
      measuresRef.current = slugs
        .map((id) => measureElement(id))
        .filter(Boolean) as SectionMeasure[];
    };

    const updateScrollState = (scrollY: number) => {
      const viewportHeight = window.innerHeight || 1;
      const scrollMax = Math.max(
        document.documentElement.scrollHeight - viewportHeight,
        1
      );
      const overallProgress = clamp(scrollY / scrollMax);
      const heroMeasure = heroMeasureRef.current;
      const heroProgress = heroMeasure
        ? clamp(
            (scrollY - heroMeasure.top) /
              Math.max(heroMeasure.height - viewportHeight * 0.2, 1)
          )
        : 0;

      const progressByChapter = measuresRef.current.map(({ top, height }) => {
        const start = top - viewportHeight * 0.85;
        const end = top + height - viewportHeight * 0.15;
        return clamp((scrollY - start) / Math.max(end - start, 1));
      });

      const activeChapter = progressByChapter.reduce(
        (bestIndex, value, index, arr) =>
          value > arr[bestIndex] ? index : bestIndex,
        0
      );
      const shift = progressByChapter[activeChapter] ?? 0;
      const stillnessMode = useHermeticStore.getState().stillnessMode;
      const clarity = stillnessMode ? 0.9 : 0.58 + overallProgress * 0.26;
      const intensity = stillnessMode ? 0.4 : 0.82 - overallProgress * 0.28;

      setState({
        scrollProgress: overallProgress,
        heroProgress,
        activeChapter,
        principleId: activeChapter + 1,
        progressByChapter,
        activeAlchemyStage: deriveAlchemyStage(progressByChapter[1] ?? 0),
        shift,
        clarity,
        intensity,
      });

      if (activeChapter !== activeChapterRef.current) {
        const slug = slugs[activeChapter];
        if (slug) {
          window.history.replaceState(null, "", `#${slug}`);
        }
        activeChapterRef.current = activeChapter;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      setState({ pointer: { x, y } });
    };

    const scrollToChapter = (index: number) => {
      const slug = slugs[index];
      const element = slug ? document.getElementById(slug) : null;
      if (!element) return;

      if (lenisRef.current && !motionDisabled) {
        lenisRef.current.scrollTo(element, {
          offset: -48,
          duration: 1.2,
          lerp: 0.08,
        });
        return;
      }

      element.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setState({ stillnessMode: true, clarity: 0.95, intensity: 0.35 });
      }
      if (event.key === "ArrowRight") {
        scrollToChapter(
          Math.min(useHermeticStore.getState().activeChapter + 1, slugs.length - 1)
        );
      }
      if (event.key === "ArrowLeft") {
        scrollToChapter(Math.max(useHermeticStore.getState().activeChapter - 1, 0));
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        const scrollProgress = useHermeticStore.getState().scrollProgress;
        setState({
          stillnessMode: false,
          clarity: 0.58 + scrollProgress * 0.26,
          intensity: 0.82 - scrollProgress * 0.28,
        });
      }
    };

    const onResize = () => {
      measure();
      const scrollY = lenisRef.current?.scroll ?? window.scrollY ?? 0;
      updateScrollState(scrollY);
    };

    measure();

    if (!motionDisabled) {
      const lenis = new Lenis({
        duration: 1.2,
        lerp: 0.08,
        smoothWheel: true,
        wheelMultiplier: 0.92,
        touchMultiplier: 1.1,
      });
      lenisRef.current = lenis;
      window.__AP_LENIS__ = lenis;

      lenis.on("scroll", ({ scroll }) => {
        updateScrollState(scroll);
      });

      const raf = (time: number) => {
        lenis.raf(time);
        rafRef.current = window.requestAnimationFrame(raf);
      };
      rafRef.current = window.requestAnimationFrame(raf);
      updateScrollState(lenis.scroll);
    } else {
      const onScroll = () => updateScrollState(window.scrollY || 0);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      const initialHash = window.location.hash.replace("#", "");
      const hashIndex = slugs.indexOf(initialHash);
      if (hashIndex >= 0) {
        window.setTimeout(() => scrollToChapter(hashIndex), 40);
      }

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
      };
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const initialHash = window.location.hash.replace("#", "");
    const hashIndex = slugs.indexOf(initialHash);
    if (hashIndex >= 0) {
      window.setTimeout(() => scrollToChapter(hashIndex), 40);
    }

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      lenisRef.current?.destroy();
      lenisRef.current = null;
      delete window.__AP_LENIS__;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [reducedMotion, setState, slugs, stillness]);

  return null;
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function measureElement(id: string) {
  const el = document.getElementById(id);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    id,
    top: rect.top + window.scrollY,
    height: rect.height,
  };
}

function deriveAlchemyStage(progress: number) {
  if (progress < 0.25) return 0;
  if (progress < 0.5) return 1;
  if (progress < 0.75) return 2;
  return 3;
}
