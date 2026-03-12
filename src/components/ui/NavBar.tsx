"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { useUiStore } from "@/lib/uiStore";
import { useHermeticStore } from "@/lib/hermeticStore";
import { createEngine, setVolume, start, stop } from "@/lib/audio/engine";
import { getStoredTheme, useThemeStore } from "@/lib/themeStore";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { getSubstackUrl } from "@/lib/substack";

const navLinks = [
  { href: "/start-here", label: "Start Here" },
  { href: "/great-work", label: "The Great Work" },
  { href: "/tarot", label: "Tarot" },
  { href: "/astrology", label: "Astrology" },
  { href: "/gallery", label: "Sacred Geometry" },
  { href: "/principles", label: "Principles" },
];

export function NavBar() {
  const [panelOpen, setPanelOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

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
  const substackUrl = getSubstackUrl();

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

  useEffect(() => {
    if (!panelOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanelOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [panelOpen]);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      const closeId = window.setTimeout(() => setPanelOpen(false), 0);
      return () => window.clearTimeout(closeId);
    }
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-panel-open", panelOpen);
    return () => document.body.classList.remove("nav-panel-open");
  }, [panelOpen]);

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
      <div className="mx-auto flex items-center justify-between gap-3 border-b border-[color:var(--copper)]/24 bg-[color:var(--obsidian)]/62 px-4 py-3 backdrop-blur-md sm:px-6 lg:gap-4 lg:px-10">
        <TrackedLink
          href="/"
          location="nav:brand"
          label="Awareness Paradox"
          variant="brand"
          className="group flex min-h-[44px] items-center gap-3 text-[0.66rem] uppercase tracking-[0.22em] text-[color:var(--mist)] transition hover:text-[color:var(--bone)] sm:text-[0.68rem] sm:tracking-[0.26em]"
        >
          <span className="h-px w-7 bg-[color:var(--copper)] transition group-hover:bg-[color:var(--gilt)] sm:w-8" />
          <span className="leading-[1.08] sm:tracking-[0.34em]">
            Awareness
            <br />
            Paradox
          </span>
        </TrackedLink>

        <nav className="hidden items-center gap-4 text-[0.62rem] uppercase tracking-[0.24em] text-[color:var(--mist)] xl:flex">
          {navLinks.map((link) => (
            <TrackedLink
              key={link.href}
              href={link.href}
              location="nav:desktop"
              label={link.label}
              variant="nav"
              className="nav-desktop-link inline-flex min-h-[44px] items-center px-2 py-2 transition hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
            >
              {link.label}
            </TrackedLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <TrackedLink
            href="/guides/hermetic-principles-starter-guide"
            location="nav:utility"
            label="Free Guide"
            variant="guide"
            className="hidden min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/55 px-4 py-2 text-[0.6rem] uppercase tracking-[0.24em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] sm:inline-flex"
          >
            Free Guide
          </TrackedLink>
          <button
            type="button"
            onClick={() => void handleAudioToggle()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--copper)]/55 text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
            aria-label={soundPlaying ? "Mute sound" : "Play sound"}
            title={soundPlaying ? "Sound on" : "Sound muted"}
          >
            {soundPlaying ? <SoundOnIcon /> : <SoundOffIcon />}
          </button>
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--copper)]/55 text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
            aria-label="Open menu"
            title="Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {panelOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-[color:var(--obsidian)]/78 backdrop-blur-sm"
            onClick={() => setPanelOpen(false)}
          />
          <aside className="absolute inset-x-0 bottom-0 top-0 overflow-y-auto border-l border-[color:var(--copper)]/24 bg-[color:var(--char)]/94 px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-[0.68rem] uppercase tracking-[0.26em] text-[color:var(--mist)] sm:left-auto sm:max-w-[27rem] sm:px-6">
            <div className="flex items-center justify-between">
              <TrackedLink
                href="/"
                location="nav:panel"
                label="Awareness Paradox Home"
                variant="brand"
                onClick={() => setPanelOpen(false)}
                className="flex min-h-[44px] items-center gap-3 text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--bone)]"
              >
                <span className="h-px w-8 bg-[color:var(--copper)]" />
                <span className="leading-[1.15]">
                  Awareness
                  <br />
                  Paradox
                </span>
              </TrackedLink>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="min-h-[44px] px-2 text-[0.62rem] tracking-[0.28em] text-[color:var(--mist)] transition hover:text-[color:var(--bone)]"
              >
                Close
              </button>
            </div>

            <div className="mt-8 space-y-7">
              <section className="space-y-3">
                <p className="text-[0.58rem] tracking-[0.34em] text-[color:var(--gilt)]">Navigate</p>
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <TrackedLink
                      key={link.href}
                      href={link.href}
                      location="nav:panel"
                      label={link.label}
                      variant="nav"
                      onClick={() => setPanelOpen(false)}
                      className="flex min-h-[48px] items-center rounded-full border border-[color:var(--copper)]/32 bg-[color:var(--obsidian)]/30 px-4 text-[0.65rem] tracking-[0.28em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                    >
                      {link.label}
                    </TrackedLink>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <p className="text-[0.58rem] tracking-[0.34em] text-[color:var(--gilt)]">Quick actions</p>
                <div className="flex flex-wrap gap-3">
                  <TrackedLink
                    href="/guides/hermetic-principles-starter-guide"
                    location="nav:panel"
                    label="Free Guide"
                    variant="guide"
                    onClick={() => setPanelOpen(false)}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/55 bg-[color:var(--gilt)]/10 px-4 py-2 text-[0.6rem] tracking-[0.24em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                  >
                    Free Guide
                  </TrackedLink>
                  <TrackedLink
                    href={substackUrl}
                    location="nav:panel"
                    label="Open Substack"
                    variant="letters"
                    onClick={() => setPanelOpen(false)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/45 px-4 py-2 text-[0.6rem] tracking-[0.24em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
                  >
                    Open Substack
                  </TrackedLink>
                </div>
              </section>

              <section className="space-y-4 rounded-[1.8rem] border border-[color:var(--copper)]/35 bg-[color:var(--obsidian)]/55 p-5">
                <p className="text-[0.58rem] tracking-[0.34em] text-[color:var(--gilt)]">Atmosphere controls</p>
                <ControlRow label="Theme">
                  <select
                    value={theme}
                    onChange={(event) => setTheme(event.target.value as typeof theme)}
                    className="w-full rounded-full border border-[color:var(--copper)]/55 bg-transparent px-3 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
                    aria-label="Theme"
                  >
                    <option value="obsidian">Obsidian</option>
                    <option value="abyssal">Abyssal</option>
                    <option value="crimson">Crimson</option>
                  </select>
                </ControlRow>
                <ControlRow label={`Quality ${qualityLabel}`}>
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
                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
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
              </section>
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-[0.55rem] uppercase tracking-[0.28em] text-[color:var(--mist)]">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function controlToggleClass(active: boolean) {
  return `rounded-full border px-3 py-2 text-[0.58rem] uppercase tracking-[0.24em] transition ${
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
