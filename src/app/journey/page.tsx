"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { principles } from "@/data/principles";
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
  const [cameraMode] = useState<CameraMode>("cinematic");
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const soundEnabled = useHermeticStore((state) => state.soundEnabled);
  const soundPlaying = useHermeticStore((state) => state.soundPlaying);
  const setSoundPreset = useHermeticStore((state) => state.setSoundPreset);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const chapters = useMemo(() => {
    return principles.map((principle) => {
      const chapter = journeyChapters.find((entry) => entry.slug === principle.slug);
      return { principle, chapter };
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
    if (!chapter) return;
    if (soundEnabled && soundPlaying) {
      setSoundPreset(chapter.audioPreset);
      setPreset(chapter.audioPreset);
    }
  }, [activeIndex, setSoundPreset, soundEnabled, soundPlaying]);

  useEffect(() => {
    const root = isDesktop ? containerRef.current : null;
    const sections = sectionRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = sections.indexOf(entry.target as HTMLDivElement);
          if (index >= 0) {
            setActiveIndex(index);
          }
        });
      },
      { root, threshold: 0.6 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isDesktop]);

  const scrollToIndex = (index: number) => {
    const section = sectionRefs.current[index];
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeChapter = journeyChapters[activeIndex];
  const activeLines = activeChapter ? lineCache.get(activeChapter.slug)?.lines : [];
  const activeRadius = activeChapter ? lineCache.get(activeChapter.slug)?.radius ?? 1 : 1;

  return (
    <div className="min-h-screen px-6 py-16 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
                The Journey
              </p>
              <h1 className="font-ritual text-4xl">Principles in Motion</h1>
            </div>
            <div className="space-y-6">
              <div className="h-40 w-px bg-[color:var(--copper)]/40">
                <div
                  className="w-px bg-[color:var(--gilt)] transition-all"
                  style={{
                    height: `${((activeIndex + 1) / journeyChapters.length) * 100}%`,
                  }}
                />
              </div>
              <ol className="space-y-4 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                {journeyChapters.map((chapter, index) => {
                  const principle = principles.find((item) => item.slug === chapter.slug);
                  return (
                    <li key={chapter.slug}>
                      <button
                        type="button"
                        onClick={() => scrollToIndex(index)}
                        className={`flex items-center gap-4 text-left transition ${
                          index === activeIndex
                            ? "text-[color:var(--bone)]"
                            : "hover:text-[color:var(--bone)]"
                        }`}
                      >
                        <span className="font-ritual text-sm text-[color:var(--gilt)]">
                          {["I", "II", "III", "IV", "V", "VI", "VII"][index]}
                        </span>
                        <span>{principle?.title ?? chapter.slug}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </aside>

        <section
          ref={containerRef}
          className="space-y-8 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto lg:snap-y lg:snap-mandatory"
        >
          <div className="sticky top-0 z-10 rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--obsidian)]/60 p-3">
            {activeChapter && activeLines ? (
              <GalleryViewer
                lines={activeLines}
                cameraMode={cameraMode}
                particleSize={activeChapter.particle.size}
                particleAlpha={activeChapter.particle.alpha}
                particleDensity={activeChapter.particle.density}
                flowStrength={activeChapter.particle.flow}
                trailAmount={0.35}
                scale={activeChapter.scale}
                boundsRadius={activeRadius}
                fitKey={activeIndex}
              />
            ) : null}
          </div>

          {chapters.map(({ principle }, index) => (
            <div
              key={principle.slug}
              ref={(node) => {
                sectionRefs.current[index] = node;
              }}
              className="snap-start scroll-mt-12"
            >
              <div className="rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--char)]/50 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
                  <span className="font-ritual text-sm text-[color:var(--gilt)]">
                    {["I", "II", "III", "IV", "V", "VI", "VII"][index]}
                  </span>
                  {principle.title}
                </div>
                <h2 className="mt-4 font-ritual text-2xl sm:text-3xl">{principle.axiom}</h2>
                <p className="mt-3 text-sm text-[color:var(--mist)] sm:text-base">
                  {principle.short}
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                      Keys
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-[color:var(--bone)]">
                      {principle.keys.map((item) => (
                        <li key={item}>— {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
                      Practice
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-[color:var(--bone)]">
                      {principle.practice.map((item) => (
                        <li key={item}>— {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 lg:hidden">
                <button
                  type="button"
                  onClick={() => scrollToIndex(Math.max(0, index - 1))}
                  className="flex-1 rounded-full border border-[color:var(--copper)]/60 px-4 py-3 text-xs uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => scrollToIndex(Math.min(journeyChapters.length - 1, index + 1))}
                  className="flex-1 rounded-full border border-[color:var(--copper)]/60 px-4 py-3 text-xs uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                >
                  Next
                </button>
              </div>
            </div>
          ))}
        </section>
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
