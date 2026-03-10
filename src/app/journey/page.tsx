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

  const activeChapter = journeyChapters[activeIndex];
  const activeLines = activeChapter ? lineCache.get(activeChapter.slug)?.lines : [];
  const activeRadius = activeChapter ? lineCache.get(activeChapter.slug)?.radius ?? 1 : 1;
  const activeEntry = chapters[activeIndex];
  const isComplete = sessionStarted && activeIndex === chapters.length - 1 && !sessionPaused;

  const handleBegin = () => {
    setActiveIndex(0);
    setSessionStarted(true);
    setSessionPaused(false);
  };

  const handlePause = () => {
    setSessionPaused((current) => !current);
  };

  const handleStep = (direction: -1 | 1) => {
    setSessionStarted(true);
    setSessionPaused(false);
    setActiveIndex((current) => Math.min(chapters.length - 1, Math.max(0, current + direction)));
  };

  const handleJumpTo = (index: number) => {
    setSessionStarted(true);
    setSessionPaused(false);
    setActiveIndex(index);
  };

  const toggleStillness = () => {
    setHermeticState({ stillnessMode: !stillnessMode });
  };

  return (
    <div className="min-h-screen px-6 py-16 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            {journeySessionIntro.eyebrow}
          </p>
          <h1 className="font-ritual text-4xl sm:text-6xl">{journeySessionIntro.title}</h1>
          <p className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
            {journeySessionIntro.body}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <section className="rounded-[2rem] border border-[color:var(--copper)]/35 bg-[color:var(--char)]/55 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Arrival</p>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                {journeySessionIntro.arrivalLine}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {!sessionStarted ? (
                  <button
                    type="button"
                    onClick={handleBegin}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/15 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                  >
                    Begin Session
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePause}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/15 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                  >
                    {sessionPaused ? "Resume" : "Pause"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleStillness}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
                >
                  {stillnessMode ? "Stillness On" : "Stillness"}
                </button>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[color:var(--copper)]/25 bg-[color:var(--obsidian)]/50 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">
                    Principle
                  </p>
                  <p className="mt-2 font-ritual text-3xl">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </p>
                </div>
                <div className="h-px flex-1 bg-[color:var(--copper)]/20" />
                <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                  {chapters.length} stages
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {chapters.map(({ principle }, index) => (
                  <button
                    key={principle.slug}
                    type="button"
                    onClick={() => handleJumpTo(index)}
                    className={`min-h-[44px] rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition ${
                      index === activeIndex
                        ? "border-[color:var(--gilt)] text-[color:var(--bone)]"
                        : "border-[color:var(--copper)]/40 text-[color:var(--mist)] hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
                    }`}
                  >
                    {principle.title}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[color:var(--copper)]/25 bg-[color:var(--char)]/40 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Ritual flow</p>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
                <li>1. Settle the breath and soften the eyes.</li>
                <li>2. Let the form hold your attention without forcing meaning.</li>
                <li>3. Read slowly and stay with one sentence that opens something.</li>
                <li>4. Leave with one reflection, not ten ideas.</li>
              </ol>
            </section>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-[color:var(--copper)]/30 bg-[color:var(--obsidian)]/45 p-4 sm:p-5">
              {activeChapter && activeLines ? (
                <GalleryViewer
                  lines={activeLines}
                  cameraMode={cameraMode}
                  forceStillness={sessionPaused || !sessionStarted}
                  containerClassName="h-[34vh] sm:h-[40vh] lg:h-[44vh]"
                  particleSize={activeChapter.particle.size}
                  particleAlpha={activeChapter.particle.alpha}
                  particleDensity={activeChapter.particle.density}
                  flowStrength={sessionPaused || !sessionStarted ? activeChapter.particle.flow * 0.35 : activeChapter.particle.flow}
                  trailAmount={sessionPaused ? 0.08 : 0.2}
                  scale={activeChapter.scale * 0.82}
                  boundsRadius={activeRadius}
                  fitKey={activeIndex}
                />
              ) : null}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 px-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Breath cue</p>
                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--mist)]">
                    {activeEntry.meditation?.breathCue}
                  </p>
                </div>
                <div className="rounded-full border border-[color:var(--copper)]/30 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)]">
                  {sessionPaused ? "Paused" : sessionStarted ? "In practice" : "Waiting"}
                </div>
              </div>
            </div>

            <article className="rounded-[2rem] border border-[color:var(--copper)]/35 bg-[color:var(--char)]/55 p-6 sm:p-8">
              {!sessionStarted ? (
                <div className="space-y-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Begin</p>
                  <h2 className="font-ritual text-3xl sm:text-4xl">{activeEntry.principle.title}</h2>
                  <p className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
                    {journeySessionIntro.arrivalLine}
                  </p>
                  <p className="max-w-3xl text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                    Start when you are ready. The page will guide you through one principle at a time, with a slower
                    instruction, a focal form, and one question worth carrying back into the day.
                  </p>
                </div>
              ) : sessionPaused ? (
                <div className="space-y-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Pause</p>
                  <h2 className="font-ritual text-3xl sm:text-4xl">Rest here for a moment.</h2>
                  <p className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
                    Nothing is being withheld from you by the pause. Let the form remain simple. Let the breath return
                    to its own rhythm. Resume when the mind feels less eager to rush toward the next thing.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                    <span className="font-ritual text-sm text-[color:var(--gilt)]">
                      {["I", "II", "III", "IV", "V", "VI", "VII"][activeIndex]}
                    </span>
                    {activeEntry.principle.title}
                  </div>
                  <div className="space-y-3">
                    <h2 className="font-ritual text-3xl sm:text-4xl">
                      {activeEntry.meditation?.meditationTitle ?? activeEntry.principle.axiom}
                    </h2>
                    <p className="text-sm uppercase tracking-[0.22em] text-[color:var(--gilt)] sm:tracking-[0.3em]">
                      {activeEntry.principle.axiom}
                    </p>
                  </div>
                  <p className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
                    {activeEntry.meditation?.focusLine ?? activeEntry.principle.short}
                  </p>
                  <div className="space-y-5">
                    {activeEntry.meditation?.meditationBody.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
                    <section className="rounded-2xl border border-[color:var(--copper)]/25 bg-[color:var(--obsidian)]/45 p-5">
                      <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Reflection</p>
                      <p className="mt-4 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                        {activeEntry.meditation?.reflectionPrompt}
                      </p>
                    </section>
                    <section className="rounded-2xl border border-[color:var(--copper)]/25 bg-[color:var(--obsidian)]/45 p-5">
                      <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Carry this forward</p>
                      <p className="mt-4 text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
                        {activeEntry.meditation?.integrationLine}
                      </p>
                    </section>
                  </div>
                </div>
              )}
            </article>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleStep(-1)}
                disabled={activeIndex === 0}
                className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => handleStep(1)}
                disabled={activeIndex === chapters.length - 1}
                className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/15 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next Principle
              </button>
            </div>

            {isComplete ? (
              <section className="rounded-[2rem] border border-[color:var(--copper)]/30 bg-[color:var(--obsidian)]/50 p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">Integration</p>
                <h2 className="mt-3 font-ritual text-3xl">{journeySessionIntro.completionTitle}</h2>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-[color:var(--mist)] sm:text-lg">
                  {journeySessionIntro.completionBody}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <TrackedLink
                    href="/start-here"
                    location="journey:completion"
                    label="Return to Start Here"
                    variant="completion"
                    className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
                  >
                    Return to Start Here
                  </TrackedLink>
                  <TrackedLink
                    href="/principles"
                    location="journey:completion"
                    label="Study the Principles"
                    variant="completion"
                    className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
                  >
                    Study the Principles
                  </TrackedLink>
                  <TrackedLink
                    href="/great-work"
                    location="journey:completion"
                    label="Enter the Great Work"
                    variant="completion-primary"
                    className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/15 px-5 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                  >
                    Enter the Great Work
                  </TrackedLink>
                </div>
              </section>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}

function getBoundsRadius(lines: LineSet) {
  let maxDistance = 0;
  lines.forEach((line) => {
    line.forEach((point) => {
      const distance = point.length();
      if (Number.isFinite(distance)) {
        maxDistance = Math.max(maxDistance, distance);
      }
    });
  });
  return maxDistance > 0 ? maxDistance : 1;
}
