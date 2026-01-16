"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUiStore } from "@/lib/uiStore";
import { useHermeticStore } from "@/lib/hermeticStore";
import { principles } from "@/data/principles";
import { createEngine, setVolume, start, stop } from "@/lib/audio/engine";
import { getStoredTheme, useThemeStore } from "@/lib/themeStore";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII"];

export function CodexChrome() {
  const stillness = useUiStore((state) => state.stillness);
  const toggleStillness = useUiStore((state) => state.toggleStillness);
  const showUi = useUiStore((state) => state.showUi);
  const toggleUi = useUiStore((state) => state.toggleUi);
  const qualityTier = useHermeticStore((state) => state.qualityTier);
  const setQuality = useHermeticStore((state) => state.setQuality);
  const setHermetic = useHermeticStore((state) => state.setState);
  const setAutoQuality = useHermeticStore((state) => state.setAutoQuality);
  const soundEnabled = useHermeticStore((state) => state.soundEnabled);
  const soundPlaying = useHermeticStore((state) => state.soundPlaying);
  const setSoundEnabled = useHermeticStore((state) => state.setSoundEnabled);
  const setSoundPlaying = useHermeticStore((state) => state.setSoundPlaying);
  const soundPreset = useHermeticStore((state) => state.soundPreset);
  const setSoundPreset = useHermeticStore((state) => state.setSoundPreset);
  const soundVolume = useHermeticStore((state) => state.soundVolume);
  const setSoundVolume = useHermeticStore((state) => state.setSoundVolume);
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const prefersReducedMotion = usePrefersReducedMotion();

  const presets = ["aether-drone", "cathedral", "lunar-pulse", "mercury-glass", "saturn-deep"] as const;
  const pathname = usePathname();
  const activeSlug = pathname?.startsWith("/principles/") ? pathname.split("/")[2] : "";

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const slugs = principles.map((principle) => principle.slug);
    const hasMissing = slugs.some((slug) => !slug);
    const unique = new Set(slugs);
    if (hasMissing || unique.size !== slugs.length) {
      console.warn("[CodexChrome] Principle slugs must be defined and unique.", slugs);
    }
  }, []);

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) {
      setTheme(stored);
    } else {
      setTheme("obsidian");
    }
  }, [setTheme]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const root = document.documentElement;
    const id = window.setTimeout(() => {
      root.classList.add("theme-transition");
    }, 50);
    return () => window.clearTimeout(id);
  }, [prefersReducedMotion]);

  const cycleQuality = () => {
    const next = qualityTier === "high" ? "medium" : qualityTier === "medium" ? "low" : "high";
    setQuality(next);
    setAutoQuality(false);
  };

  const cyclePreset = () => {
    const index = presets.indexOf(soundPreset);
    const next = presets[(index + 1) % presets.length];
    setSoundPreset(next);
  };

  const audioStatus = soundPlaying ? "Playing" : soundEnabled ? "Ready" : "Muted";

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
    <>
      <nav
        className={`pointer-events-auto fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:flex ${
          showUi ? "opacity-100" : "opacity-0"
        } transition-opacity`}
      >
        <ol className="flex flex-col gap-4 border-l border-[color:var(--copper)]/40 pl-4 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
          {principles.map((principle, index) => (
            <li key={principle.slug}>
              <Link
                href={`/principles/${principle.slug}`}
                className={`group flex items-center gap-4 transition-colors hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)] ${
                  activeSlug === principle.slug ? "text-[color:var(--bone)]" : ""
                }`}
              >
                <span className="font-ritual text-sm text-[color:var(--gilt)]">
                  {romanNumerals[index]}
                </span>
                <span className="hidden whitespace-nowrap text-[0.65rem] tracking-[0.4em] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline">
                  {principle.title}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <div className="pointer-events-auto fixed right-6 top-6 z-30 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--mist)]">
        <div className="hidden items-center gap-4 sm:flex">
          <Link
            href="/"
            className="text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--mist)] transition hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
          >
            Home
          </Link>
          <Link
            href="/great-work"
            className="text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--mist)] transition hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
          >
            The Great Work
          </Link>
          <Link
            href="/principles"
            className="text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--mist)] transition hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
          >
            Principles
          </Link>
          <Link
            href="/gallery"
            className="text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--mist)] transition hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
          >
            Gallery
          </Link>
        </div>
        <label className="hidden items-center gap-2 text-[0.55rem] uppercase tracking-[0.35em] text-[color:var(--mist)] sm:flex">
          Theme
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value as typeof theme)}
            className="rounded-full border border-[color:var(--copper)]/60 bg-transparent px-3 py-2 text-[0.55rem] uppercase tracking-[0.3em] text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
            aria-label="Theme"
          >
            <option value="obsidian">Obsidian</option>
            <option value="abyssal">Third Eye</option>
            <option value="crimson">Crimson</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex items-center gap-2 rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)] sm:hidden"
        >
          Menu
          <span aria-hidden="true">≡</span>
        </button>
        <button
          type="button"
          onClick={toggleUi}
          className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
        >
          {showUi ? "UI On" : "UI Off"}
        </button>
        <button
          type="button"
          onClick={cycleQuality}
          className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
        >
          {qualityTier}
        </button>
        <button
          type="button"
          onClick={() => void handleAudioToggle()}
          className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
        >
          {soundPlaying ? "Stop" : "Play"}
        </button>
        <button
          type="button"
          onClick={cyclePreset}
          className="hidden rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)] sm:inline-flex"
        >
          {soundPreset.replace("-", " ")}
        </button>
        <button
          type="button"
          onClick={() => {
            toggleStillness();
            const nextStillness = !useHermeticStore.getState().stillnessMode;
            const scrollProgress = useHermeticStore.getState().scrollProgress;
            setHermetic({
              stillnessMode: nextStillness,
              clarity: nextStillness ? 0.95 : 0.6 + scrollProgress * 0.2,
              intensity: nextStillness ? 0.35 : 0.7 - scrollProgress * 0.2,
            });
          }}
          className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
        >
          {stillness ? "Still" : "Live"}
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-[0.55rem] uppercase tracking-[0.35em] text-[color:var(--mist)]">
            {audioStatus}
          </span>
          <input
            type="range"
            min={0}
            max={0.4}
            step={0.01}
            value={soundVolume}
            onChange={(event) => setSoundVolume(Number(event.target.value))}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-[color:var(--copper)]/40"
            aria-label="Audio volume"
          />
        </div>
      </div>
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-[color:var(--obsidian)]/70 sm:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="h-full w-[85vw] max-w-[360px] overflow-y-auto border-l border-[color:var(--copper)]/50 bg-[color:var(--char)]/95 px-6 pb-10 pt-8 text-[0.75rem] uppercase tracking-[0.28em] text-[color:var(--mist)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span>Navigation</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--mist)] transition hover:text-[color:var(--bone)]"
              >
                Close
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-4 text-[color:var(--bone)]">
              {[
                { href: "/", label: "Home" },
                { href: "/great-work", label: "The Great Work" },
                { href: "/principles", label: "Principles" },
                { href: "/gallery", label: "Gallery" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-[color:var(--copper)]/60 px-5 py-3 text-center text-[0.7rem] uppercase tracking-[0.3em] transition hover:border-[color:var(--gilt)]"
                >
                  {link.label}
                </Link>
              ))}
              <label className="mt-2 flex flex-col gap-2 text-[0.55rem] uppercase tracking-[0.3em] text-[color:var(--mist)]">
                Theme
                <select
                  value={theme}
                  onChange={(event) => setTheme(event.target.value as typeof theme)}
                  className="rounded-full border border-[color:var(--copper)]/60 bg-transparent px-4 py-2 text-center text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
                  aria-label="Theme"
                >
                  <option value="obsidian">Obsidian</option>
                  <option value="abyssal">Third Eye</option>
                  <option value="crimson">Crimson</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
