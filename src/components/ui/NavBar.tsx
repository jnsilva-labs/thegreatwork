"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { useFocusDialog } from "@/components/ui/useFocusDialog";
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
  const closePanel = useCallback(() => setPanelOpen(false), []);
  const { triggerRef, dialogRef, initialFocusRef } = useFocusDialog({
    open: panelOpen,
    onClose: closePanel,
  });

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
    setTheme(stored ?? "obsidian");
  }, [setTheme]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const root = document.documentElement;
    const id = window.setTimeout(() => root.classList.add("theme-transition"), 50);
    return () => window.clearTimeout(id);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      const closeId = window.setTimeout(closePanel, 0);
      return () => window.clearTimeout(closeId);
    }
  }, [closePanel, pathname]);

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
          className="group flex min-h-[44px] items-center gap-3 text-xs uppercase tracking-[0.22em] text-[color:var(--mist)] transition hover:text-[color:var(--bone)] sm:tracking-[0.3em]"
        >
          <span className="h-px w-7 bg-[color:var(--copper)] transition group-hover:bg-[color:var(--gilt)] sm:w-8" />
          <span className="leading-[1.08]">Awareness<br />Paradox</span>
        </TrackedLink>

        <nav aria-label="Primary" className="hidden items-center gap-4 text-xs uppercase tracking-[0.2em] text-[color:var(--mist)] xl:flex">
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
            className="hidden min-h-[44px] items-center border border-[color:var(--gilt)]/55 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] sm:inline-flex"
          >
            Free Guide
          </TrackedLink>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setPanelOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--copper)]/55 text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
            aria-label="Open menu"
            aria-expanded={panelOpen}
            aria-controls="site-menu-dialog"
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
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-[color:var(--obsidian)]/78 backdrop-blur-sm"
            onClick={closePanel}
          />
          <aside
            ref={dialogRef}
            id="site-menu-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-menu-title"
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 top-0 overflow-y-auto border-l border-[color:var(--copper)]/24 bg-[color:var(--char)]/96 px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-xs uppercase tracking-[0.22em] text-[color:var(--mist)] sm:left-auto sm:max-w-[29rem] sm:px-7"
          >
            <div className="flex items-center justify-between gap-5 border-b border-[color:var(--copper)]/24 pb-5">
              <div>
                <TrackedLink
                  href="/"
                  location="nav:panel"
                  label="Awareness Paradox Home"
                  variant="brand"
                  onClick={closePanel}
                  className="type-eyebrow inline-flex min-h-[44px] items-center text-[color:var(--gilt)]"
                >
                  Awareness Paradox <span className="sr-only">Home</span>
                </TrackedLink>
                <h2 id="site-menu-title" className="mt-2 font-ritual text-3xl normal-case tracking-normal text-[color:var(--bone)]">Menu</h2>
              </div>
              <button
                ref={initialFocusRef}
                type="button"
                onClick={closePanel}
                className="min-h-[44px] border border-[color:var(--copper)]/48 px-3 text-xs tracking-[0.22em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
              >
                Close
              </button>
            </div>

            <div className="mt-7 space-y-7">
              <nav aria-label="Menu navigation" className="space-y-3">
                <p className="text-xs tracking-[0.28em] text-[color:var(--gilt)]">Navigate</p>
                <div className="border-y border-[color:var(--copper)]/24">
                  {navLinks.map((link, index) => (
                    <TrackedLink
                      key={link.href}
                      href={link.href}
                      location="nav:panel"
                      label={link.label}
                      variant="nav"
                      onClick={closePanel}
                      className={`flex min-h-[48px] items-center justify-between px-1 text-xs tracking-[0.22em] text-[color:var(--bone)] transition hover:text-[color:var(--gilt)] ${index ? "border-t border-[color:var(--copper)]/18" : ""}`}
                    >
                      {link.label}<span aria-hidden="true">↗</span>
                    </TrackedLink>
                  ))}
                </div>
              </nav>

              <section aria-labelledby="menu-invitations" className="space-y-3">
                <h3 id="menu-invitations" className="text-xs font-normal tracking-[0.28em] text-[color:var(--gilt)]">Invitations</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  <TrackedLink
                    href="/guides/hermetic-principles-starter-guide"
                    location="nav:panel"
                    label="Free Guide"
                    variant="guide"
                    onClick={closePanel}
                    className="inline-flex min-h-[44px] items-center border border-[color:var(--gilt)]/55 bg-[color:var(--gilt)]/8 px-4 py-2 text-xs tracking-[0.18em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                  >
                    Free Guide
                  </TrackedLink>
                  <TrackedLink
                    href={substackUrl}
                    location="nav:panel"
                    label="Open Substack"
                    variant="letters"
                    onClick={closePanel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center border border-[color:var(--copper)]/45 px-4 py-2 text-xs tracking-[0.18em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
                  >
                    Open Substack
                  </TrackedLink>
                </div>
              </section>

              <details className="border-y border-[color:var(--copper)]/28 py-1">
                <summary className="flex min-h-[44px] cursor-pointer items-center justify-between text-xs tracking-[0.24em] text-[color:var(--bone)]">
                  Environment
                  <span aria-hidden="true" className="text-[color:var(--gilt)]">+</span>
                </summary>
                <div className="space-y-5 border-t border-[color:var(--copper)]/18 py-5">
                  <ControlRow label="Sound">
                    <button
                      type="button"
                      onClick={() => void handleAudioToggle()}
                      className={controlToggleClass(soundPlaying)}
                      aria-label={soundPlaying ? "Mute sound" : "Play sound"}
                      aria-pressed={soundPlaying}
                    >
                      {soundPlaying ? "On" : "Off"}
                    </button>
                  </ControlRow>
                  <ControlRow label="Theme">
                    <select
                      value={theme}
                      onChange={(event) => setTheme(event.target.value as typeof theme)}
                      className="min-h-[44px] w-full border border-[color:var(--copper)]/55 bg-transparent px-3 py-2 text-xs uppercase tracking-[0.18em] text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)]"
                      aria-label="Theme"
                    >
                      <option value="obsidian">Obsidian</option>
                      <option value="abyssal">Abyssal</option>
                      <option value="crimson">Crimson</option>
                    </select>
                  </ControlRow>
                  <ControlRow label={`Quality · ${qualityLabel}`}>
                    <div className="grid grid-cols-3 gap-2">
                      <button type="button" aria-label="Quality Auto" aria-pressed={autoQuality} onClick={() => setAutoQuality(true)} className={controlToggleClass(autoQuality)}>Auto</button>
                      <button
                        type="button"
                        aria-label="Quality High"
                        aria-pressed={!autoQuality && qualityTier !== "low"}
                        onClick={() => { setAutoQuality(false); setQuality("high"); }}
                        className={controlToggleClass(!autoQuality && qualityTier !== "low")}
                      >High</button>
                      <button
                        type="button"
                        aria-label="Quality Low"
                        aria-pressed={!autoQuality && qualityTier === "low"}
                        onClick={() => { setAutoQuality(false); setQuality("low"); }}
                        className={controlToggleClass(!autoQuality && qualityTier === "low")}
                      >Low</button>
                    </div>
                  </ControlRow>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ControlRow label="Motion">
                      <button type="button" aria-label="Motion" aria-pressed={!stillness} onClick={handleAnimateToggle} className={controlToggleClass(!stillness)}>
                        {stillness ? "Off" : "On"}
                      </button>
                    </ControlRow>
                    <ControlRow label="Interface overlay">
                      <button type="button" aria-label="Interface overlay" aria-pressed={showUi} onClick={toggleUi} className={controlToggleClass(showUi)}>
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
                </div>
              </details>
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
      <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--mist)]">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function controlToggleClass(active: boolean) {
  return `min-h-[44px] border px-3 py-2 text-xs uppercase tracking-[0.18em] transition ${
    active
      ? "border-[color:var(--gilt)] text-[color:var(--bone)]"
      : "border-[color:var(--copper)]/60 text-[color:var(--mist)] hover:border-[color:var(--gilt)]"
  }`;
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 4h11M2.5 8h11M2.5 12h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
