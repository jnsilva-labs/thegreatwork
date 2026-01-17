"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUiStore } from "@/lib/uiStore";
import { useHermeticStore } from "@/lib/hermeticStore";
import { createEngine, setVolume, start, stop } from "@/lib/audio/engine";
import { getStoredTheme, useThemeStore } from "@/lib/themeStore";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/great-work", label: "The Great Work" },
  { href: "/principles", label: "Principles" },
  { href: "/gallery", label: "Gallery" },
];

export function NavBar() {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const showUi = useUiStore((state) => state.showUi);
  const toggleUi = useUiStore((state) => state.toggleUi);
  const stillness = useUiStore((state) => state.stillness);
  const toggleStillness = useUiStore((state) => state.toggleStillness);
  const setHermetic = useHermeticStore((state) => state.setState);
  const qualityTier = useHermeticStore((state) => state.qualityTier);
  const autoQuality = useHermeticStore((state) => state.autoQuality);
  const setQuality = useHermeticStore((state) => state.setQuality);
  const setAutoQuality = useHermeticStore((state) => state.setAutoQuality);
  const soundPlaying = useHermeticStore((state) => state.soundPlaying);
  const soundPreset = useHermeticStore((state) => state.soundPreset);
  const soundVolume = useHermeticStore((state) => state.soundVolume);
  const setSoundEnabled = useHermeticStore((state) => state.setSoundEnabled);
  const setSoundPlaying = useHermeticStore((state) => state.setSoundPlaying);
  const setSoundVolume = useHermeticStore((state) => state.setSoundVolume);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

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

  const openControls = () => {
    if (typeof window !== "undefined") {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop) {
        setControlsOpen((prev) => !prev);
      } else {
        setMobileOpen(true);
      }
      return;
    }
    setControlsOpen((prev) => !prev);
  };

  const handleAnimateToggle = () => {
    toggleStillness();
    const nextStillness = !useHermeticStore.getState().stillnessMode;
    const scrollProgress = useHermeticStore.getState().scrollProgress;
    setHermetic({
      stillnessMode: nextStillness,
      clarity: nextStillness ? 0.95 : 0.6 + scrollProgress * 0.2,
      intensity: nextStillness ? 0.35 : 0.7 - scrollProgress * 0.2,
    });
  };

  const qualityLabel = autoQuality ? "Auto" : qualityTier === "low" ? "Low" : "High";

  return (
    <header className="pointer-events-auto fixed left-0 right-0 top-0 z-40">
      <div className="mx-auto flex items-center justify-between gap-4 border-b border-[color:var(--copper)]/40 bg-[color:var(--obsidian)]/70 px-6 py-4 backdrop-blur-md sm:px-10 lg:px-20">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
          <span className="h-px w-10 bg-[color:var(--copper)]" />
          Awareness Paradox
        </div>

        <nav className="hidden items-center gap-6 text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--mist)] lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.35em]">
          <button
            type="button"
            onClick={() => void handleAudioToggle()}
            className="rounded-full border border-[color:var(--copper)]/60 p-2 text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
            aria-label={soundPlaying ? "Mute sound" : "Play sound"}
            title={soundPlaying ? "Sound on" : "Sound muted"}
          >
            {soundPlaying ? <SoundOnIcon /> : <SoundOffIcon />}
          </button>
          <button
            type="button"
            onClick={openControls}
            className="hidden rounded-full border border-[color:var(--copper)]/60 p-2 text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)] lg:inline-flex"
            aria-label="Open controls"
            title="Controls"
          >
            <ControlsIcon />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--copper)]/60 text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)] lg:hidden"
            aria-label="Open menu"
            title="Menu"
          >
            <MenuIcon />
          </button>

          {controlsOpen && (
            <div className="absolute right-0 top-12 hidden w-72 rounded-2xl border border-[color:var(--copper)]/50 bg-[color:var(--char)]/95 p-4 text-[0.55rem] uppercase tracking-[0.32em] text-[color:var(--mist)] shadow-2xl lg:block">
              <div className="flex items-center justify-between">
                <span>Controls</span>
                <button
                  type="button"
                  onClick={() => setControlsOpen(false)}
                  className="text-[0.55rem] tracking-[0.32em] text-[color:var(--mist)] transition hover:text-[color:var(--bone)]"
                >
                  Close
                </button>
              </div>
              <div className="mt-4 space-y-4">
                <ControlRow label="Theme">
                  <select
                    value={theme}
                    onChange={(event) => setTheme(event.target.value as typeof theme)}
                    className="w-full rounded-full border border-[color:var(--copper)]/60 bg-transparent px-3 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
                    aria-label="Theme"
                  >
                    <option value="obsidian">Obsidian</option>
                    <option value="abyssal">Abyssal</option>
                    <option value="crimson">Crimson</option>
                  </select>
                </ControlRow>
                <ControlRow label={`Quality: ${qualityLabel}`}>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAutoQuality(true)}
                      className={controlToggleClass(autoQuality)}
                    >
                      Auto
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAutoQuality(false);
                        setQuality("high");
                      }}
                      className={controlToggleClass(!autoQuality && qualityTier !== "low")}
                    >
                      High
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAutoQuality(false);
                        setQuality("low");
                      }}
                      className={controlToggleClass(!autoQuality && qualityTier === "low")}
                    >
                      Low
                    </button>
                  </div>
                </ControlRow>
                <ControlRow label="Animate">
                  <button type="button" onClick={handleAnimateToggle} className={controlToggleClass(!stillness)}>
                    {stillness ? "Off" : "On"}
                  </button>
                </ControlRow>
                <ControlRow label="HUD">
                  <button type="button" onClick={toggleUi} className={controlToggleClass(showUi)}>
                    {showUi ? "On" : "Off"}
                  </button>
                </ControlRow>
                <ControlRow label="Volume">
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
                    className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--copper)]/40"
                    aria-label="Sound volume"
                  />
                </ControlRow>
              </div>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[color:var(--obsidian)]/75 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 rounded-t-3xl border border-[color:var(--copper)]/40 bg-[color:var(--char)]/95 px-6 pb-8 pt-6 text-[0.7rem] uppercase tracking-[0.32em] text-[color:var(--mist)]"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setMobileOpen(false);
              }
            }}
            tabIndex={-1}
          >
            <div className="flex items-center justify-between">
              <span>Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-[0.65rem] tracking-[0.32em] text-[color:var(--mist)] transition hover:text-[color:var(--bone)]"
              >
                Close
              </button>
            </div>
            <div className="mt-6 space-y-6">
              <div className="space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-full border border-[color:var(--copper)]/60 px-4 py-3 text-center text-[0.65rem] tracking-[0.32em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <details className="rounded-2xl border border-[color:var(--copper)]/50 p-4" open>
                <summary className="cursor-pointer text-[0.65rem] tracking-[0.32em] text-[color:var(--bone)]">
                  Controls
                </summary>
                <div className="mt-4 space-y-4">
                  <ControlRow label="Theme">
                    <select
                      value={theme}
                      onChange={(event) => setTheme(event.target.value as typeof theme)}
                      className="w-full rounded-full border border-[color:var(--copper)]/60 bg-transparent px-3 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
                      aria-label="Theme"
                    >
                      <option value="obsidian">Obsidian</option>
                      <option value="abyssal">Abyssal</option>
                      <option value="crimson">Crimson</option>
                    </select>
                  </ControlRow>
                  <ControlRow label={`Quality: ${qualityLabel}`}>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAutoQuality(true)}
                        className={controlToggleClass(autoQuality)}
                      >
                        Auto
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAutoQuality(false);
                          setQuality("high");
                        }}
                        className={controlToggleClass(!autoQuality && qualityTier !== "low")}
                      >
                        High
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAutoQuality(false);
                          setQuality("low");
                        }}
                        className={controlToggleClass(!autoQuality && qualityTier === "low")}
                      >
                        Low
                      </button>
                    </div>
                  </ControlRow>
                  <ControlRow label="Animate">
                    <button type="button" onClick={handleAnimateToggle} className={controlToggleClass(!stillness)}>
                      {stillness ? "Off" : "On"}
                    </button>
                  </ControlRow>
                  <ControlRow label="HUD">
                    <button type="button" onClick={toggleUi} className={controlToggleClass(showUi)}>
                      {showUi ? "On" : "Off"}
                    </button>
                  </ControlRow>
                  <ControlRow label="Volume">
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
                      className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--copper)]/40"
                      aria-label="Sound volume"
                    />
                  </ControlRow>
                </div>
              </details>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-[0.55rem] uppercase tracking-[0.32em] text-[color:var(--mist)]">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function controlToggleClass(active: boolean) {
  return `rounded-full border px-3 py-2 text-[0.55rem] uppercase tracking-[0.32em] transition ${
    active
      ? "border-[color:var(--gilt)] text-[color:var(--bone)]"
      : "border-[color:var(--copper)]/60 text-[color:var(--mist)] hover:border-[color:var(--gilt)]"
  }`;
}

function SoundOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 6.5h2.5l3-2.5v8l-3-2.5H2.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M11 5c1.2 1.2 1.2 4.8 0 6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 6.5h2.5l3-2.5v8l-3-2.5H2.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 6.5l2.5 3M14 6.5l-2.5 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ControlsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4h10M3 8h10M3 12h10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="6" cy="4" r="1.2" fill="currentColor" />
      <circle cx="10" cy="8" r="1.2" fill="currentColor" />
      <circle cx="5" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 4h11M2.5 8h11M2.5 12h11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
