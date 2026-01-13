"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { WebGLGuard } from "@/components/ui/WebGLGuard";
import { FallbackEngraving } from "@/components/ui/FallbackEngraving";
import { RitualCanvas } from "@/components/scene/RitualCanvas";
import { PlateSVG } from "@/components/PlateSVG";
import { ripleyScrollPanels } from "@/data/ripleyScroll";
import { getRipleyPreset } from "@/lib/scene/ripleyPresets";
import { useHermeticStore } from "@/lib/hermeticStore";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import {
  createEngine,
  setPreset,
  setVolume,
  start,
  stop,
} from "@/lib/audio/engine";

const romanNumerals = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
];

export default function RipleyScrollPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [readingMode, setReadingMode] = useState(false);
  const [visiblePanels, setVisiblePanels] = useState<Record<string, boolean>>({});
  const [isDesktop, setIsDesktop] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const soundEnabled = useHermeticStore((state) => state.soundEnabled);
  const soundPlaying = useHermeticStore((state) => state.soundPlaying);
  const soundPreset = useHermeticStore((state) => state.soundPreset);
  const soundVolume = useHermeticStore((state) => state.soundVolume);
  const setSoundEnabled = useHermeticStore((state) => state.setSoundEnabled);
  const setSoundPlaying = useHermeticStore((state) => state.setSoundPlaying);
  const setSoundPreset = useHermeticStore((state) => state.setSoundPreset);
  const setSoundVolume = useHermeticStore((state) => state.setSoundVolume);
  const setState = useHermeticStore((state) => state.setState);


  const applyPreset = useCallback(
    (index: number) => {
    const panel = ripleyScrollPanels[index];
    if (!panel) return;
    const preset = getRipleyPreset(panel.scenePreset);
    const progressByChapter = Array.from({ length: 7 }, (_, idx) =>
      idx === preset.chapterIndex ? 0.85 : 0.1
    );
    const scrollProgress =
      ripleyScrollPanels.length > 1 ? index / (ripleyScrollPanels.length - 1) : 0;

    const target = {
      intensity: clamp(preset.intensity + (readingMode ? -0.12 : 0)),
      clarity: clamp(preset.clarity + (readingMode ? 0.18 : 0)),
      shift: clamp(preset.shift),
      lineOpacityScale: clamp(preset.lineOpacityScale + (readingMode ? 0.1 : 0), 0.2, 1.5),
      lineRadiusScale: clamp(preset.lineRadiusScale + (readingMode ? 0.1 : 0), 0.6, 1.4),
      particleScale: clamp(preset.particleScale + (readingMode ? -0.15 : 0), 0.6, 1.6),
      particleBrightness: clamp(
        preset.particleBrightness + (readingMode ? -0.12 : 0),
        0.6,
        1.4
      ),
      veilIntensity: clamp(preset.veilIntensity + (readingMode ? -0.2 : 0.05), 0.4, 1.4),
      postBoost: clamp(preset.postBoost + (readingMode ? -0.04 : 0), 0, 0.3),
    };

    const startState = useHermeticStore.getState();
    const start = {
      intensity: startState.intensity,
      clarity: startState.clarity,
      shift: startState.shift,
      lineOpacityScale: startState.lineOpacityScale,
      lineRadiusScale: startState.lineRadiusScale,
      particleScale: startState.particleScale,
      particleBrightness: startState.particleBrightness,
      veilIntensity: startState.veilIntensity,
      postBoost: startState.postBoost,
    };

    const duration = reducedMotion ? 0 : 1400;
    const startTime = performance.now();

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const tick = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min(1, (now - startTime) / duration);
      const eased = easeInOut(progress);
      setState({
        intensity: lerp(start.intensity, target.intensity, eased),
        clarity: lerp(start.clarity, target.clarity, eased),
        shift: lerp(start.shift, target.shift, eased),
        lineOpacityScale: lerp(start.lineOpacityScale, target.lineOpacityScale, eased),
        lineRadiusScale: lerp(start.lineRadiusScale, target.lineRadiusScale, eased),
        particleScale: lerp(start.particleScale, target.particleScale, eased),
        particleBrightness: lerp(start.particleBrightness, target.particleBrightness, eased),
        veilIntensity: lerp(start.veilIntensity, target.veilIntensity, eased),
        postBoost: lerp(start.postBoost, target.postBoost, eased),
      });
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(tick);
      }
    };

    setState({
      activeChapter: preset.chapterIndex,
      principleId: preset.principleId,
      progressByChapter,
      scrollProgress,
      cameraOverride: {
        position: preset.cameraPosition,
        target: preset.cameraTarget,
      },
    });

    animationRef.current = requestAnimationFrame(tick);

    if (soundEnabled && soundPlaying) {
      setSoundPreset(preset.soundPreset);
      setPreset(preset.soundPreset);
    }
    },
    [readingMode, reducedMotion, soundEnabled, soundPlaying, setSoundPreset, setState]
  );

  useEffect(() => {
    applyPreset(activeIndex);
  }, [activeIndex, applyPreset]);

  useEffect(() => {
    return () => {
      setState({
        cameraOverride: null,
        lineOpacityScale: 1,
        lineRadiusScale: 1,
        particleScale: 1,
        particleBrightness: 1,
        veilIntensity: 1,
        postBoost: 0,
      });
    };
  }, [setState]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const sections = panelRefs.current.filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sections.indexOf(entry.target as HTMLElement);
          if (index === -1) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            setActiveIndex(index);
          }
          if (entry.intersectionRatio >= 0.25) {
            setVisiblePanels((prev) => ({ ...prev, [ripleyScrollPanels[index].id]: true }));
          }
        });
      },
      {
        root: isDesktop ? container : null,
        threshold: [0.25, 0.55],
      }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isDesktop]);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      setState({ pointer: { x, y } });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setState({ stillnessMode: true, clarity: 0.95, intensity: 0.35 });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        applyPreset(activeIndex);
        setState({ stillnessMode: false });
      }
    };

    window.addEventListener("pointermove", handlePointer);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeIndex, applyPreset, setState]);

  const handleAudioToggle = async () => {
    if (soundPlaying) {
      stop();
      setSoundPlaying(false);
      return;
    }
    const audio = createEngine();
    await audio.ctx.resume();
    setVolume(soundVolume);
    start(soundPreset);
    setSoundEnabled(true);
    setSoundPlaying(true);
  };


  return (
    <div className="relative min-h-screen text-[color:var(--bone)]">
      <WebGLGuard fallback={<FallbackEngraving />}>
        <RitualCanvas />
      </WebGLGuard>
      <div className="grain-overlay fixed inset-0 z-0 opacity-40" />
      <div className="vellum-overlay fixed inset-0 z-0" />
      <div className="scrim fixed inset-0 z-0" />
      {readingMode && (
        <div className="pointer-events-none fixed inset-0 z-0 bg-[color:var(--obsidian)]/35" />
      )}

      <main className="relative z-10 px-6 py-16 sm:px-10 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.6fr_1.4fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
                  Ripley Scroll
                </p>
                <h1 className="font-ritual text-4xl">The Great Work</h1>
              </div>
              <div className="space-y-6">
                <div className="h-48 w-px bg-[color:var(--copper)]/40">
                  <div
                    className="w-px bg-[color:var(--gilt)] transition-all"
                    style={{
                      height: `${((activeIndex + 1) / ripleyScrollPanels.length) * 100}%`,
                    }}
                  />
                </div>
                <ol className="space-y-4 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                  {ripleyScrollPanels.map((panel, index) => (
                    <li key={panel.id}>
                      <button
                        type="button"
                        onClick={() => scrollToPanel(index, panelRefs)}
                        className={`flex items-center gap-4 text-left transition ${
                          index === activeIndex
                            ? "text-[color:var(--bone)]"
                            : "hover:text-[color:var(--bone)]"
                        }`}
                      >
                        <span className="font-ritual text-sm text-[color:var(--gilt)]">
                          {romanNumerals[index]}
                        </span>
                        <span>{panel.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  onClick={() => setReadingMode((prev) => !prev)}
                  className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                >
                  {readingMode ? "Reading On" : "Reading Mode"}
                </button>
                <div className="rounded-2xl border border-[color:var(--copper)]/50 bg-[color:var(--char)]/70 p-4 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                  <div className="flex items-center justify-between gap-3">
                    <span>Sound</span>
                    <button
                      type="button"
                      onClick={() => void handleAudioToggle()}
                      className="rounded-full border border-[color:var(--copper)]/60 px-3 py-1 text-[0.6rem] uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                    >
                      {soundPlaying ? "Stop" : "Play"}
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-[0.55rem]">{soundPreset.replace("-", " ")}</span>
                    <input
                      type="range"
                      min={0}
                      max={0.4}
                      step={0.01}
                      value={soundVolume}
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        setSoundVolume(next);
                        setVolume(next);
                      }}
                      className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[color:var(--copper)]/40"
                      aria-label="Sound volume"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--obsidian)]/60 p-4 lg:hidden">
              <button
                type="button"
                onClick={() => setReadingMode((prev) => !prev)}
                className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-[0.6rem] uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
              >
                {readingMode ? "Reading On" : "Reading Mode"}
              </button>
              <button
                type="button"
                onClick={() => void handleAudioToggle()}
                className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-[0.6rem] uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
              >
                {soundPlaying ? "Stop" : "Play"}
              </button>
            </div>
            <div
              ref={scrollContainerRef}
              className={`ripley-scroll space-y-10 rounded-3xl border border-[color:var(--copper)]/40 px-6 py-12 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:snap-y lg:snap-mandatory ${
                readingMode ? "ripley-scroll--reading" : ""
              }`}
            >
              {ripleyScrollPanels.map((panel, index) => {
                const isVisible = visiblePanels[panel.id];
                return (
                  <article
                    key={panel.id}
                    ref={(node) => {
                      panelRefs.current[index] = node;
                    }}
                    data-active={index === activeIndex}
                    className={`ripley-panel snap-start rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--char)]/70 p-6 backdrop-blur-md ${
                      isVisible ? "ripley-panel--visible" : ""
                    }`}
                  >
                    <div className="grid gap-6 lg:grid-cols-[1fr_0.5fr]">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
                          <span className="font-ritual text-sm text-[color:var(--gilt)]">
                            {romanNumerals[index]}
                          </span>
                          {panel.title}
                        </div>
                        {panel.subtitle && (
                          <h2 className="font-ritual text-2xl sm:text-3xl">{panel.subtitle}</h2>
                        )}
                        <p className="text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                          {panel.body}
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                            Marginalia
                            <ul className="mt-3 space-y-2 text-[0.7rem] text-[color:var(--bone)]">
                              {panel.marginalia.map((note) => (
                                <li key={note}>— {note}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-3 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                            {panel.principleSlug && (
                              <Link
                                href={`/principles/${panel.principleSlug}`}
                                className="inline-flex rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-[0.6rem] tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                              >
                                Open Principle
                              </Link>
                            )}
                            {panel.geometrySlug && (
                              <Link
                                href={`/gallery/${panel.geometrySlug}`}
                                className="inline-flex rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-[0.6rem] tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                              >
                                Open Geometry
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start justify-center lg:justify-end">
                        <div className="w-full max-w-[220px]">
                          <PlateSVG
                            slug={panel.plateSlug}
                            variant="thumbnail"
                            className="w-full opacity-90"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-4 lg:hidden">
                      <button
                        type="button"
                        onClick={() => scrollToPanel(Math.max(0, index - 1), panelRefs)}
                        className="flex-1 rounded-full border border-[color:var(--copper)]/60 px-4 py-3 text-[0.6rem] uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          scrollToPanel(
                            Math.min(ripleyScrollPanels.length - 1, index + 1),
                            panelRefs
                          )
                        }
                        className="flex-1 rounded-full border border-[color:var(--copper)]/60 px-4 py-3 text-[0.6rem] uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                      >
                        Next
                      </button>
                    </div>
                  </article>
                );
              })}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--copper)]/30 pt-6 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                <Link
                  href="/principles"
                  className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 transition hover:border-[color:var(--gilt)]"
                >
                  Back to Principles
                </Link>
                <Link
                  href="/gallery"
                  className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 transition hover:border-[color:var(--gilt)]"
                >
                  Open Gallery
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <nav className="pointer-events-auto fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {ripleyScrollPanels.map((panel, index) => (
          <button
            key={panel.id}
            type="button"
            onClick={() => scrollToPanel(index, panelRefs)}
            className={`h-3 w-3 rounded-full border transition ${
              index === activeIndex
                ? "border-[color:var(--gilt)] bg-[color:var(--gilt)]"
                : "border-[color:var(--copper)]/60"
            }`}
            aria-label={`Jump to ${panel.title}`}
          />
        ))}
      </nav>
    </div>
  );
}

function scrollToPanel(index: number, panelRefs: { current: (HTMLElement | null)[] }) {
  const node = panelRefs.current[index];
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
