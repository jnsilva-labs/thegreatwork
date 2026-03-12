"use client";

import { useEffect, useMemo, useState } from "react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { principles } from "@/data/principles";
import { journeyMeditations, journeySessionIntro } from "@/data/journeyMeditations";
import { GalleryViewer, type CameraMode } from "@/components/gallery/GalleryViewer";
import { generateGeometry } from "@/lib/geometry/generators";
import { geometryToLineSet } from "@/lib/geometry/convertToLineSet";
import type { LineSet } from "@/lib/geometry";
import { useHermeticStore } from "@/lib/hermeticStore";
import { setPreset } from "@/lib/audio/engine";

type JourneyChapter = {
  slug: string;
  geometryId: Parameters<typeof generateGeometry>[0];
  particle: {
    size: number;
    alpha: number;
    density: number;
    flow: number;
  };
  scale: number;
  audioPreset: Parameters<typeof setPreset>[0];
};

const journeyChapters: JourneyChapter[] = [
  {
    slug: "mentalism",
    geometryId: "seed-of-life",
    particle: { size: 16, alpha: 0.95, density: 1.1, flow: 0.45 },
    scale: 1.05,
    audioPreset: "aether-drone",
  },
  {
    slug: "correspondence",
    geometryId: "flower-of-life",
    particle: { size: 17, alpha: 1, density: 1.25, flow: 0.5 },
    scale: 1,
    audioPreset: "cathedral",
  },
  {
    slug: "vibration",
    geometryId: "golden-spiral",
    particle: { size: 18, alpha: 1.1, density: 1.35, flow: 0.9 },
    scale: 1.15,
    audioPreset: "mercury-glass",
  },
  {
    slug: "polarity",
    geometryId: "vesica-piscis",
    particle: { size: 16, alpha: 0.95, density: 1.15, flow: 0.6 },
    scale: 1,
    audioPreset: "lunar-pulse",
  },
  {
    slug: "rhythm",
    geometryId: "fibonacci-rectangles",
    particle: { size: 16, alpha: 0.9, density: 1.05, flow: 0.35 },
    scale: 1.1,
    audioPreset: "cathedral",
  },
  {
    slug: "cause-effect",
    geometryId: "metatrons-cube",
    particle: { size: 17, alpha: 0.95, density: 1.2, flow: 0.55 },
    scale: 1,
    audioPreset: "saturn-deep",
  },
  {
    slug: "gender",
    geometryId: "torus",
    particle: { size: 17, alpha: 1, density: 1.15, flow: 0.7 },
    scale: 1.2,
    audioPreset: "lunar-pulse",
  },
];

export default function JourneyPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionPaused, setSessionPaused] = useState(false);
  const [breathStepIndex, setBreathStepIndex] = useState(0);
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(
    journeyMeditations[0]?.breathPattern[0]?.seconds ?? 0,
  );
  const [cameraMode] = useState<CameraMode>("cinematic");
  const soundEnabled = useHermeticStore((state) => state.soundEnabled);
  const soundPlaying = useHermeticStore((state) => state.soundPlaying);
  const stillnessMode = useHermeticStore((state) => state.stillnessMode);
  const setSoundPreset = useHermeticStore((state) => state.setSoundPreset);
  const setHermeticState = useHermeticStore((state) => state.setState);

  const chapters = useMemo(() => {
    return principles.map((principle) => {
      const chapter = journeyChapters.find((entry) => entry.slug === principle.slug);
      const meditation = journeyMeditations.find((entry) => entry.slug === principle.slug);
      return { principle, chapter, meditation };
    });
  }, []);

  const lineCache = useMemo(() => {
    const cache = new Map<string, { lines: LineSet; radius: number }>();
    journeyChapters.forEach((chapter) => {
      const geometry = generateGeometry(chapter.geometryId, { size: 2.6, detail: 160 });
      const lines = geometryToLineSet(geometry, 200);
      cache.set(chapter.slug, { lines, radius: getBoundsRadius(lines) });
    });
    return cache;
  }, []);

  useEffect(() => {
    const chapter = journeyChapters[activeIndex];
    if (!chapter || !sessionStarted) return;
    if (soundEnabled && soundPlaying) {
      setSoundPreset(chapter.audioPreset);
      setPreset(chapter.audioPreset);
    }
  }, [activeIndex, sessionStarted, setSoundPreset, soundEnabled, soundPlaying]);

  useEffect(() => {
    const pattern = chapters[activeIndex]?.meditation?.breathPattern;
    if (!sessionStarted || sessionPaused || !pattern || pattern.length === 0) return;

    const interval = window.setInterval(() => {
      if (breathSecondsLeft > 1) {
        setBreathSecondsLeft(breathSecondsLeft - 1);
        return;
      }

      const nextIndex = (breathStepIndex + 1) % pattern.length;
      setBreathStepIndex(nextIndex);
      setBreathSecondsLeft(pattern[nextIndex]?.seconds ?? pattern[0]?.seconds ?? 0);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [activeIndex, breathSecondsLeft, breathStepIndex, chapters, sessionPaused, sessionStarted]);

  const activeChapter = journeyChapters[activeIndex];
  const activeLines = activeChapter ? lineCache.get(activeChapter.slug)?.lines : [];
  const activeRadius = activeChapter ? lineCache.get(activeChapter.slug)?.radius ?? 1 : 1;
  const activeEntry = chapters[activeIndex];
  const activeBreathStep = activeEntry.meditation?.breathPattern[breathStepIndex];
  const isComplete = sessionStarted && activeIndex === chapters.length - 1 && !sessionPaused;

  const resetBreathCycle = (index: number) => {
    const pattern = chapters[index]?.meditation?.breathPattern;
    setBreathStepIndex(0);
    setBreathSecondsLeft(pattern?.[0]?.seconds ?? 0);
  };

  const handleBegin = () => {
    setActiveIndex(0);
    setSessionStarted(true);
    setSessionPaused(false);
    resetBreathCycle(0);
  };

  const handlePause = () => {
    setSessionPaused((current) => !current);
  };

  const handleStep = (direction: -1 | 1) => {
    const nextIndex = Math.min(chapters.length - 1, Math.max(0, activeIndex + direction));
    setSessionStarted(true);
    setSessionPaused(false);
    setActiveIndex(nextIndex);
    resetBreathCycle(nextIndex);
  };

  const handleJumpTo = (index: number) => {
    setSessionStarted(true);
    setSessionPaused(false);
    setActiveIndex(index);
    resetBreathCycle(index);
  };

  const toggleStillness = () => {
    setHermeticState({ stillnessMode: !stillnessMode });
  };

  return (
    <div className="journey-ritual min-h-screen px-6 py-14 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-12 sm:space-y-16">
        <header className="space-y-8 pt-6">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
              {journeySessionIntro.eyebrow}
            </p>
            <h1 className="font-ritual text-4xl sm:text-6xl">{journeySessionIntro.title}</h1>
            <p className="max-w-3xl text-base leading-relaxed text-[color:#D5D0C6] sm:text-lg">
              {journeySessionIntro.body}
            </p>
          </div>
          <div className="journey-invocation max-w-3xl space-y-4">
            <p className="text-xs uppercase tracking-[0.34em] text-[color:var(--gilt)]">Invocation</p>
            <p className="text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
              {journeySessionIntro.arrivalLine}
            </p>
            <p className="font-ritual text-2xl leading-relaxed text-[color:var(--bone)] sm:text-[2.2rem]">
              Stay until the form stops being decorative and begins to feel like a threshold.
            </p>
          </div>
        </header>

        <section className="journey-altar editorial-panel vellum-smoke rounded-[2rem] p-4 sm:p-6">
          {activeChapter && activeLines ? (
            <GalleryViewer
              lines={activeLines}
              cameraMode={cameraMode}
              forceStillness={sessionPaused || !sessionStarted}
              containerClassName="h-[38vh] sm:h-[46vh] lg:h-[54vh]"
              particleSize={activeChapter.particle.size}
              particleAlpha={activeChapter.particle.alpha}
              particleDensity={activeChapter.particle.density}
              flowStrength={
                sessionPaused || !sessionStarted
                  ? activeChapter.particle.flow * 0.28
                  : activeChapter.particle.flow
              }
              trailAmount={sessionPaused ? 0.06 : 0.18}
              scale={activeChapter.scale * 0.9}
              boundsRadius={activeRadius}
              fitKey={activeIndex}
            />
          ) : null}

          <div className="journey-altar__caption mt-6 grid gap-6 border-t border-[color:var(--copper)]/18 px-2 pt-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-2xl space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">
                  Active passage
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[color:var(--mist)]">
                  {toRoman(activeIndex + 1)} · {activeEntry.principle.title}
                </p>
              </div>
              <p className="max-w-xl font-ritual text-[1.9rem] leading-[1.08] text-[color:var(--bone)] sm:text-[2.25rem]">
                {activeEntry.meditation?.meditationTitle}
              </p>
              <p className="max-w-xl text-sm leading-relaxed text-[color:#D5D0C6] sm:text-base">
                {activeEntry.meditation?.meditationBody[0]}
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                {!sessionStarted ? (
                  <button
                    type="button"
                    onClick={handleBegin}
                    className="home-cta inline-flex min-h-[48px] items-center rounded-full border px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--bone)] transition"
                  >
                    Begin Session
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePause}
                    className="home-cta inline-flex min-h-[48px] items-center rounded-full border px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--bone)] transition"
                  >
                    {sessionPaused ? "Resume" : "Pause"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleStillness}
                  className="inline-flex min-h-[48px] items-center rounded-full border border-[color:var(--copper)]/55 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
                >
                  {stillnessMode ? "Stillness On" : "Stillness"}
                </button>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-[1.4rem] border border-[color:var(--copper)]/20 bg-[color:var(--obsidian)]/28 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Breath cue</p>
                    <p className="font-ritual text-[2rem] leading-none text-[color:var(--bone)] sm:text-[2.5rem]">
                      {activeBreathStep?.label ?? "Breathe"}
                    </p>
                    <p className="max-w-sm text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                      {activeEntry.meditation?.breathCue}
                    </p>
                  </div>
                  <div className="journey-breath-counter self-start sm:self-center">
                    <span>
                      {String(Math.max(1, breathSecondsLeft || activeBreathStep?.seconds || 0)).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {activeEntry.meditation?.breathPattern.map((step, index) => (
                    <div
                      key={`${step.label}-${step.seconds}`}
                      className={`rounded-full border px-3 py-2 text-[0.62rem] uppercase tracking-[0.24em] ${
                        index === breathStepIndex
                          ? "border-[color:var(--gilt)] text-[color:var(--bone)]"
                          : "border-[color:var(--copper)]/30 text-[color:var(--mist)]"
                      }`}
                    >
                      {step.label} · {step.seconds}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-[color:var(--copper)]/16 bg-[color:var(--obsidian)]/18 p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Focus</p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                  {activeEntry.meditation?.focusLine}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="journey-utility flex flex-col gap-4 border-y border-[color:var(--copper)]/18 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] sm:ml-auto">
            <button
              type="button"
              onClick={() => handleStep(-1)}
              disabled={activeIndex === 0}
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/45 px-4 py-2 transition hover:border-[color:var(--gilt)] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Previous
            </button>
            <span>
              {String(activeIndex + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => handleStep(1)}
              disabled={activeIndex === chapters.length - 1}
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/45 px-4 py-2 transition hover:border-[color:var(--gilt)] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next
            </button>
          </div>
        </section>

        <section className="journey-flow space-y-8">
          <div className="journey-index flex flex-wrap gap-2">
            {chapters.map(({ principle }, index) => (
              <button
                key={principle.slug}
                type="button"
                onClick={() => handleJumpTo(index)}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] transition ${
                  index === activeIndex
                    ? "border-[color:var(--gilt)] text-[color:var(--bone)]"
                    : "border-[color:var(--copper)]/32 text-[color:var(--mist)] hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
                }`}
              >
                {principle.title}
              </button>
            ))}
          </div>

          <div className="space-y-10">
            {chapters.map(({ principle, meditation }, index) => {
              const isActive = index === activeIndex;
              const isPast = index < activeIndex;

              return (
                <article
                  key={principle.slug}
                  className={`journey-chapter relative border-t border-[color:var(--copper)]/18 pt-10 ${
                    isActive ? "is-active" : isPast ? "is-past" : ""
                  }`}
                >
                  <div className="journey-threshold" aria-hidden="true" />
                  <div className="grid gap-8 lg:grid-cols-[0.2fr_0.8fr]">
                    <div className="space-y-3">
                      <p className="font-ritual text-4xl text-[color:var(--gilt)]/72">
                        {toRoman(index + 1)}
                      </p>
                      <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">
                        {principle.title}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h2 className="font-ritual text-3xl text-[color:var(--bone)] sm:text-4xl">
                          {principle.title}
                        </h2>
                        <p className="font-ritual text-xl text-[color:var(--bone)]/88 sm:text-2xl">
                          {meditation?.meditationTitle}
                        </p>
                      </div>

                      <div className="space-y-5 text-base leading-relaxed text-[color:#D5D0C6] sm:text-lg">
                        {meditation?.meditationBody.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>

                      <div className="journey-reflection grid gap-6 border-t border-[color:var(--copper)]/18 pt-6 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">
                            Reflection
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                            {meditation?.reflectionPrompt}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">
                            Integration
                          </p>
                          <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                            {meditation?.integrationLine}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="editorial-panel rounded-[2rem] p-6 sm:p-8">
          {isComplete ? (
            <>
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">
                {journeySessionIntro.completionTitle}
              </p>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
                {journeySessionIntro.completionBody}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">
                Ritual flow
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                <li>1. Settle the breath and soften the eyes.</li>
                <li>2. Let the form hold your attention without forcing meaning.</li>
                <li>3. Read slowly and stay with one sentence that opens something.</li>
                <li>4. Leave with one reflection, not ten ideas.</li>
              </ol>
            </>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedLink
              href="/principles"
              location="journey:footer"
              label="Study the Principles"
              variant="journey"
              className="home-cta inline-flex min-h-[48px] items-center rounded-full border px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--bone)] transition"
            >
              Study the Principles
            </TrackedLink>
            <TrackedLink
              href="/study"
              location="journey:footer"
              label="Continue Through the Path"
              variant="journey"
              className="inline-flex min-h-[48px] items-center rounded-full border border-[color:var(--copper)]/45 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
            >
              Continue Through the Path
            </TrackedLink>
          </div>
        </section>
      </div>
    </div>
  );
}

function getBoundsRadius(lines: LineSet) {
  let max = 1;
  for (const line of lines) {
    for (const point of line) {
      const radius = Math.hypot(point.x, point.y, point.z ?? 0);
      if (radius > max) max = radius;
    }
  }
  return max;
}

function toRoman(value: number) {
  const numerals = ["I", "II", "III", "IV", "V", "VI", "VII"];
  return numerals[value - 1] ?? String(value);
}
