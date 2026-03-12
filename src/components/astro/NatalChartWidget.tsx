"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import type { AstroMonthAheadReadingResponse, AstroNatalResponse } from "@/lib/astro/types";
import { trackEvent } from "@/lib/analytics/track";
import { getSubstackUrl, isExternalHref } from "@/lib/substack";
import { TurnstileWidget } from "./TurnstileWidget";
import { PlanetaryArc } from "./PlanetaryArc";
import { SharePanel } from "./share/SharePanel";

type HouseSystem = "wholeSign" | "placidus";

const planetLabels: Record<string, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
  node: "Node",
  chiron: "Chiron",
  asc: "Ascendant",
  mc: "Midheaven"
};

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
];

const signFromLongitude = (longitude: number): { sign: string; degree: string } => {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized - signIndex * 30;
  return {
    sign: SIGNS[signIndex],
    degree: `${degree.toFixed(2)}°`
  };
};

const sentenceCase = (value: string): string => {
  if (!value) return value;
  return value.slice(0, 1).toUpperCase() + value.slice(1);
};

const lunarPhaseLabels: Record<string, string> = {
  newMoon: "New Moon",
  firstQuarter: "First Quarter",
  fullMoon: "Full Moon",
  lastQuarter: "Last Quarter"
};

const houseSystemDescriptions: Record<HouseSystem, string> = {
  wholeSign: "Whole Sign maps one full sign to each house.",
  placidus: "Placidus divides houses by time and quadrant."
};

const formatUtcDate = (timestampUtc: string): string => {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric"
  }).format(new Date(timestampUtc));
};

export function NatalChartWidget() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [birthPlace, setBirthPlace] = useState("");
  const [houseSystem, setHouseSystem] = useState<HouseSystem>("wholeSign");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [result, setResult] = useState<AstroNatalResponse | null>(null);
  const [monthAheadLoading, setMonthAheadLoading] = useState(false);
  const [monthAheadError, setMonthAheadError] = useState<string | null>(null);
  const [monthAheadStatus, setMonthAheadStatus] = useState("");
  const [monthAheadResult, setMonthAheadResult] = useState<AstroMonthAheadReadingResponse | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "done" | "failed">("idle");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [astroAccessVerified, setAstroAccessVerified] = useState(false);

  const resultRef = useRef<HTMLDivElement | null>(null);
  const pageViewTrackedRef = useRef(false);

  useEffect(() => {
    if (!result || !resultRef.current) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".astro-reveal",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
          stagger: 0.08
        }
      );
    }, resultRef);

    return () => context.revert();
  }, [result, monthAheadResult]);

  useEffect(() => {
    if (pageViewTrackedRef.current) return;
    pageViewTrackedRef.current = true;
    trackEvent("astro_page_view", { page: "astrology" });
  }, []);

  const placements = useMemo(() => {
    if (!result) return [];

    return Object.entries(result.chart.points)
      .filter(([, value]) => typeof value === "number")
      .map(([planet, value]) => {
        const longitude = value as number;
        const parsed = signFromLongitude(longitude);

        return {
          planet,
          label: planetLabels[planet] ?? sentenceCase(planet),
          longitude,
          sign: parsed.sign,
          degree: parsed.degree
        };
      })
      .sort((a, b) => a.longitude - b.longitude);
  }, [result]);

  const shareText = useMemo(() => {
    if (!result) return "";

    const { bigThree, paradox, mantra } = result.reading;
    const rising = bigThree.rising ?? "(birth time needed)";

    return [
      "Awareness Paradox — Natal Snapshot",
      `Sun: ${bigThree.sun}`,
      `Moon: ${bigThree.moon}`,
      `Rising: ${rising}`,
      `Paradox: ${paradox.tension} -> ${paradox.gift}`,
      `Mantra: ${mantra}`
    ].join("\n");
  }, [result]);

  const lettersHref = getSubstackUrl();
  const lettersIsExternal = isExternalHref(lettersHref);
  const houseSystemDescription = houseSystemDescriptions[houseSystem];
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
  const turnstileEnabled = Boolean(turnstileSiteKey);

  const resetVerification = (message?: string) => {
    setAstroAccessVerified(false);
    setTurnstileToken(null);
    setTurnstileResetKey((value) => value + 1);
    if (message) {
      setMonthAheadError(message);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (turnstileEnabled && !astroAccessVerified && !turnstileToken) {
      setError("Please complete the verification check before generating a reading.");
      return;
    }

    setLoading(true);
    setError(null);
    setMonthAheadResult(null);
    setMonthAheadError(null);
    setMonthAheadStatus("");
    setCopyState("idle");
    setStatusMessage("Calculating chart and composing your reflection...");
    trackEvent("astro_natal_submit", {
      houseSystem,
      timeUnknown
    });

    try {
      const response = await fetch("/api/astro/natal", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim() || undefined,
          birthDate,
          birthTime: birthTime || undefined,
          timeUnknown,
          birthPlace,
          turnstileToken: astroAccessVerified ? undefined : turnstileToken ?? undefined,
          houseSystem,
          zodiac: "tropical"
        })
      });

      const payload = (await response.json()) as
        | AstroNatalResponse
        | { error?: string; code?: string; details?: unknown };

      if (!response.ok) {
        const fallback = "Could not generate your reading. Please check your inputs and try again.";
        const message =
          typeof payload === "object" && payload && "error" in payload
            ? String(payload.error ?? fallback)
            : fallback;

        if (
          typeof payload === "object" &&
          payload &&
          "code" in payload &&
          (payload.code === "TURNSTILE_REQUIRED" || payload.code === "TURNSTILE_FAILED")
        ) {
          setAstroAccessVerified(false);
        }

        throw new Error(message);
      }

      setResult(payload as AstroNatalResponse);
      setStatusMessage("Reading complete.");
      setAstroAccessVerified(true);
      setTurnstileToken(null);
      setTurnstileResetKey((value) => value + 1);
      trackEvent("astro_natal_success", {
        houseSystem,
        timeUnknown
      });
    } catch (submitError) {
      setResult(null);
      setStatusMessage("Reading failed.");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to reveal the pattern right now. Please try again."
      );
      resetVerification();
      trackEvent("astro_natal_error", {
        houseSystem,
        timeUnknown
      });
    } finally {
      setLoading(false);
    }
  };

  const onRequestMonthAhead = async () => {
    if (!result) return;

    if (turnstileEnabled && !astroAccessVerified && !turnstileToken) {
      setMonthAheadError("Please complete the verification check before reading the month ahead.");
      return;
    }

    setMonthAheadLoading(true);
    setMonthAheadError(null);
    setMonthAheadStatus("Computing the month ahead from the current sky...");
    trackEvent("astro_month_ahead_click", {
      timeUnknown: result.meta.timeUnknown
    });

    try {
      const response = await fetch("/api/astro/month-ahead", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chart: result.chart,
          timeUnknown: result.meta.timeUnknown,
          turnstileToken: astroAccessVerified ? undefined : turnstileToken ?? undefined
        })
      });

      const payload = (await response.json()) as
        | AstroMonthAheadReadingResponse
        | { error?: string; code?: string; details?: unknown };

      if (!response.ok) {
        const fallback = "Could not interpret the month ahead. Please try again.";
        const message =
          typeof payload === "object" && payload && "error" in payload
            ? String(payload.error ?? fallback)
            : fallback;

        if (
          typeof payload === "object" &&
          payload &&
          "code" in payload &&
          (payload.code === "TURNSTILE_REQUIRED" || payload.code === "TURNSTILE_FAILED")
        ) {
          resetVerification("Verification expired. Please complete the check again to read the month ahead.");
        }

        throw new Error(message);
      }

      setMonthAheadResult(payload as AstroMonthAheadReadingResponse);
      setMonthAheadStatus("Month-ahead reading complete.");
      setAstroAccessVerified(true);
      setTurnstileToken(null);
      setTurnstileResetKey((value) => value + 1);
      trackEvent("astro_month_ahead_success", {
        timeUnknown: result.meta.timeUnknown,
        highlights: (payload as AstroMonthAheadReadingResponse).highlights.length
      });
    } catch (monthAheadRequestError) {
      setMonthAheadError((current) =>
        current ??
        (monthAheadRequestError instanceof Error
          ? monthAheadRequestError.message
          : "Unable to interpret the month ahead right now. Please try again.")
      );
      if (monthAheadRequestError instanceof Error && !monthAheadRequestError.message.includes("Verification")) {
        setTurnstileToken(null);
        setTurnstileResetKey((value) => value + 1);
      }
      setMonthAheadStatus("Month-ahead reading failed.");
      trackEvent("astro_month_ahead_error", {
        timeUnknown: result.meta.timeUnknown
      });
    } finally {
      setMonthAheadLoading(false);
    }
  };

  const onCopyShare = async () => {
    if (!shareText) return;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopyState("done");
      trackEvent("astro_share_export", {
        method: "copy_text"
      });
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 pb-12 pt-2">
      <section className="relative overflow-hidden rounded-[1.65rem] border border-[color:var(--copper)]/38 bg-[color:var(--char)]/62 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(184,155,94,0.2),transparent_58%),radial-gradient(circle_at_88%_4%,rgba(232,227,216,0.12),transparent_46%)]" />
        <div className="pointer-events-none absolute -right-14 top-8 hidden h-40 w-40 rounded-full border border-[color:var(--gilt)]/26 sm:block" />
        <div className="pointer-events-none absolute -right-8 top-14 hidden h-28 w-28 animate-spin-slow rounded-full border border-dashed border-[color:var(--gilt)]/36 sm:block" />

        <div className="relative space-y-5">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--mist)]">Natal Oracle</p>
            <h1 className="font-ritual text-3xl text-[color:var(--bone)] sm:text-4xl">Reveal the Pattern</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--mist)]">
              For reflection and self-inquiry, written from computed chart facts rather than generalized horoscope copy.
            </p>
            <p className="text-xs text-[color:var(--mist)]">
              If your birth time is unknown, we interpret without houses and rising sign.
            </p>
          </div>

          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <label className="space-y-1 text-sm">
              <span className="text-[color:var(--bone)]">Name (optional)</span>
              <input
                className="min-h-[44px] w-full rounded-xl border border-[color:var(--copper)]/45 bg-[color:var(--bg)]/65 px-3 py-2 text-sm text-[color:var(--bone)]"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-[color:var(--bone)]">Birth date</span>
              <input
                type="date"
                required
                className="min-h-[44px] w-full rounded-xl border border-[color:var(--copper)]/45 bg-[color:var(--bg)]/65 px-3 py-2 text-sm text-[color:var(--bone)]"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-[color:var(--bone)]">Birth time</span>
              <input
                type="time"
                disabled={timeUnknown}
                className="min-h-[44px] w-full rounded-xl border border-[color:var(--copper)]/45 bg-[color:var(--bg)]/65 px-3 py-2 text-sm text-[color:var(--bone)] disabled:cursor-not-allowed disabled:opacity-60"
                value={birthTime}
                onChange={(event) => setBirthTime(event.target.value)}
              />
            </label>

            <label className="space-y-1 text-sm">
              <span className="text-[color:var(--bone)]">Birth place</span>
              <input
                required
                placeholder="City, Region, Country"
                className="min-h-[44px] w-full rounded-xl border border-[color:var(--copper)]/45 bg-[color:var(--bg)]/65 px-3 py-2 text-sm text-[color:var(--bone)]"
                value={birthPlace}
                onChange={(event) => setBirthPlace(event.target.value)}
                autoComplete="off"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 px-3 py-2.5 text-sm sm:col-span-2">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[color:var(--gilt)]"
                checked={timeUnknown}
                onChange={(event) => {
                  setTimeUnknown(event.target.checked);
                  if (event.target.checked) setBirthTime("");
                  if (event.target.checked) {
                    trackEvent("astro_time_unknown_enabled", { page: "astrology" });
                  }
                }}
              />
              I don&apos;t know my exact birth time
            </label>

            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="text-[color:var(--bone)]">House system</span>
              <select
                value={houseSystem}
                onChange={(event) => setHouseSystem(event.target.value as HouseSystem)}
                className="min-h-[44px] w-full rounded-xl border border-[color:var(--copper)]/45 bg-[color:var(--bg)]/65 px-3 py-2 text-sm text-[color:var(--bone)]"
              >
                <option value="wholeSign">Whole Sign • sign-based</option>
                <option value="placidus">Placidus • quadrant-based</option>
              </select>
              <p className="text-xs leading-relaxed text-[color:var(--mist)]">{houseSystemDescription}</p>
            </label>

            {turnstileEnabled && !astroAccessVerified ? (
              <div className="space-y-2 sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--mist)]">
                  Verification
                </p>
                <div className="rounded-xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-3 sm:rounded-2xl sm:p-4">
                  <TurnstileWidget
                    siteKey={turnstileSiteKey}
                    resetKey={turnstileResetKey}
                    onVerify={setTurnstileToken}
                  />
                  <p className="mt-3 text-xs leading-relaxed text-[color:var(--mist)]">
                    This keeps the public astrology tool usable without opening the API to automated abuse.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col items-start gap-3 pt-1 sm:col-span-2 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="submit"
                disabled={loading}
                className="min-h-[44px] rounded-full border border-[color:var(--gilt)]/65 bg-[color:var(--gilt)]/15 px-6 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--bone)] transition hover:bg-[color:var(--gilt)]/25 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Revealing..." : "Reveal the Pattern"}
              </button>

              <span className="text-xs text-[color:var(--mist)]" aria-live="polite">
                {statusMessage}
              </span>
            </div>
          </form>

          {error ? (
            <p
              className="rounded-xl border border-rose-300/35 bg-rose-900/25 px-3 py-2 text-sm text-rose-100"
              role="alert"
            >
              {error}
            </p>
          ) : null}
        </div>
      </section>

      {result ? (
        <section ref={resultRef} className="relative overflow-hidden rounded-[1.65rem] border border-[color:var(--copper)]/40 bg-[color:var(--char)]/58 p-4 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,155,94,0.16),transparent_52%),radial-gradient(circle_at_80%_0%,rgba(232,227,216,0.08),transparent_42%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_50%_50%,rgba(184,155,94,0.2)_1px,transparent_1px)] [background-size:26px_26px]" />

          <div className="relative space-y-6">
            <div className="astro-reveal space-y-3">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--mist)]">Reading</p>
              <h2 className="font-ritual text-3xl text-[color:var(--bone)] sm:text-4xl">{result.reading.title}</h2>
              <p className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)]">{result.reading.snapshot}</p>
            </div>

            <div className="astro-reveal grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-3.5 sm:rounded-2xl sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--mist)]">Sun</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--bone)]">{result.reading.bigThree.sun}</p>
              </article>
              <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-3.5 sm:rounded-2xl sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--mist)]">Moon</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--bone)]">{result.reading.bigThree.moon}</p>
              </article>
              <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-3.5 sm:rounded-2xl sm:p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--mist)]">Rising</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--bone)]">
                  {result.reading.bigThree.rising ?? "(birth time needed)"}
                </p>
              </article>
            </div>

            <div className="astro-reveal rounded-xl border border-[color:var(--gilt)]/40 bg-[linear-gradient(180deg,rgba(184,155,94,0.12),rgba(184,155,94,0.03))] p-4 sm:rounded-2xl sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.33em] text-[color:var(--gilt)]">The Paradox</p>
              <p className="mt-2 text-sm text-[color:var(--bone)]">
                <strong>Tension:</strong> {result.reading.paradox.tension}
              </p>
              <p className="mt-1 text-sm text-[color:var(--bone)]">
                <strong>Gift:</strong> {result.reading.paradox.gift}
              </p>
            </div>

            <div className="astro-reveal grid gap-3 md:grid-cols-3">
              <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-3.5 sm:rounded-2xl sm:p-4">
                <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Core Themes</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--bone)]">
                  {result.reading.coreThemes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-3.5 sm:rounded-2xl sm:p-4">
                <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Strengths</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--bone)]">
                  {result.reading.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-3.5 sm:rounded-2xl sm:p-4">
                <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Growth Edges</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--bone)]">
                  {result.reading.shadows.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="astro-reveal grid gap-3 md:grid-cols-2">
              <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-3.5 sm:rounded-2xl sm:p-4">
                <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Relationships</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--bone)]">{result.reading.relationships}</p>
              </article>
              <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-3.5 sm:rounded-2xl sm:p-4">
                <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Career Calling</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--bone)]">{result.reading.careerCalling}</p>
              </article>
            </div>

            <div className="astro-reveal rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-3.5 sm:rounded-2xl sm:p-4">
              <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Growth Keys</h3>
              <ul className="mt-3 space-y-2">
                {result.reading.growthKeys.map((key) => (
                  <li key={key.label} className="flex items-start gap-3 text-sm text-[color:var(--bone)]">
                    <span className="mt-1 h-3 w-3 rounded-full border border-[color:var(--gilt)]/70" aria-hidden="true" />
                    <span>
                      <strong>{key.label}:</strong> {key.practice}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="astro-reveal rounded-xl border border-[color:var(--gilt)]/40 bg-[color:var(--gilt)]/10 p-3.5 sm:rounded-2xl sm:p-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--gilt)]">Mantra</p>
              <p className="mt-2 font-ritual text-2xl text-[color:var(--bone)]">{result.reading.mantra}</p>
            </div>

            <div className="astro-reveal rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-3.5 sm:rounded-2xl sm:p-4">
              <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">How this reading is formed</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[color:var(--mist)]">
                <li>- Birthplace is geocoded into coordinates and timezone before the chart is calculated.</li>
                <li>- Planetary positions are computed from ephemeris data, then translated into symbolic guidance.</li>
                <li>- If birth time is unknown, houses and Ascendant claims are removed on purpose.</li>
              </ul>
            </div>

            <section className="astro-reveal rounded-xl border border-[color:var(--gilt)]/40 bg-[linear-gradient(180deg,rgba(184,155,94,0.12),rgba(184,155,94,0.03))] p-4 sm:rounded-2xl sm:p-5">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                <div className="max-w-2xl space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--gilt)]">See the Month Ahead</p>
                  <h3 className="font-ritual text-2xl text-[color:var(--bone)] sm:text-3xl">
                    A 30-day reading from computed sky events
                  </h3>
                  <p className="text-sm leading-relaxed text-[color:var(--mist)]">
                    This second reading is generated only when you ask for it. It draws from lunar stages,
                    major sky shifts, and high-signal contacts to your chart, then translates those events
                    into a measured monthly briefing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onRequestMonthAhead}
                  disabled={monthAheadLoading}
                  className="min-h-[44px] w-full rounded-full border border-[color:var(--gilt)]/65 bg-[color:var(--gilt)]/15 px-5 py-3 text-xs uppercase tracking-[0.24em] text-[color:var(--bone)] transition hover:bg-[color:var(--gilt)]/25 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {monthAheadLoading
                    ? "Reading the Sky..."
                    : monthAheadResult
                      ? "Refresh the Month Ahead"
                      : "See the Month Ahead"}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[color:var(--mist)]" aria-live="polite">
                <span>{monthAheadStatus}</span>
                {monthAheadResult ? (
                  <span>
                    Built from {monthAheadResult.lunarStages.length} lunar stages, {monthAheadResult.skyShifts.length} sky
                    shifts, and {monthAheadResult.transitContacts.length} chart contacts.
                  </span>
                ) : null}
              </div>

              {monthAheadError ? (
                <p
                  className="mt-4 rounded-xl border border-rose-300/35 bg-rose-900/25 px-3 py-2 text-sm text-rose-100"
                  role="alert"
                >
                  {monthAheadError}
                </p>
              ) : null}

              {monthAheadResult ? (
                <div className="mt-6 space-y-5">
                  <div className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-4 sm:rounded-2xl sm:p-5">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Month-ahead reading</p>
                    <h4 className="mt-2 font-ritual text-2xl text-[color:var(--bone)]">{monthAheadResult.reading.title}</h4>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[color:var(--gilt)]">
                      {monthAheadResult.reading.timeframe}
                    </p>
                    {!result.meta.timeUnknown ? (
                      <p className="mt-2 text-xs leading-relaxed text-[color:var(--mist)]">
                        House context follows your selected {houseSystem === "wholeSign" ? "Whole Sign" : "Placidus"} system.
                      </p>
                    ) : null}
                    <p className="mt-4 text-sm leading-relaxed text-[color:var(--mist)]">
                      {monthAheadResult.reading.overview}
                    </p>
                  </div>

                  <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-4 sm:rounded-2xl">
                    <h4 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Major themes</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {monthAheadResult.reading.majorThemes.map((item) => (
                        <span
                          key={item}
                          className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/30 bg-[color:var(--char)]/35 px-4 py-2 text-sm text-[color:var(--bone)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-4 sm:rounded-2xl">
                    <h4 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Transit highlights</h4>
                    <div className="mt-3 space-y-3">
                      {monthAheadResult.reading.transitHighlights.map((item) => (
                        <div
                          key={`${item.title}-${item.window}`}
                          className="rounded-xl border border-[color:var(--copper)]/25 bg-[color:var(--char)]/35 p-4"
                        >
                          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)]">{item.window}</p>
                          <p className="mt-2 text-sm text-[color:var(--bone)]">{item.title}</p>
                          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[color:var(--mist)]">{item.guidance}</p>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-4 sm:rounded-2xl">
                    <h4 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Lunar rhythm</h4>
                    <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {monthAheadResult.reading.lunarStages.map((item) => (
                        <div
                          key={`${item.phase}-${item.window}`}
                          className="rounded-xl border border-[color:var(--copper)]/25 bg-[color:var(--char)]/35 p-3"
                        >
                          <p className="text-xs uppercase tracking-[0.24em] text-[color:var(--gilt)]">
                            {lunarPhaseLabels[item.phase]}
                          </p>
                          <p className="mt-2 text-sm text-[color:var(--bone)]">{item.window}</p>
                          <p className="mt-2 text-sm leading-relaxed text-[color:var(--mist)]">{item.cue}</p>
                        </div>
                      ))}
                    </div>
                  </article>

                  <div className="grid gap-3 lg:grid-cols-2">
                    <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-4 sm:rounded-2xl">
                      <h4 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Practice suggestions</h4>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--bone)]">
                        {monthAheadResult.reading.practiceSuggestions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>

                    <article className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-4 sm:rounded-2xl">
                      <h4 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Cautions</h4>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--bone)]">
                        {monthAheadResult.reading.cautions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>
                  </div>

                  <div className="rounded-xl border border-[color:var(--gilt)]/40 bg-[color:var(--gilt)]/10 p-4 sm:rounded-2xl">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--gilt)]">Closing line</p>
                    <p className="mt-2 font-ritual text-2xl text-[color:var(--bone)]">
                      {monthAheadResult.reading.closingLine}
                    </p>
                  </div>

                  <details className="rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-4 sm:rounded-2xl">
                    <summary className="cursor-pointer text-xs uppercase tracking-[0.26em] text-[color:var(--mist)]">
                      Show computed sky events
                    </summary>
                    <div className="mt-4 space-y-4 text-sm text-[color:var(--mist)]">
                      <div>
                        <h5 className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gilt)]">Lunar stages</h5>
                        <ul className="mt-2 space-y-1">
                          {monthAheadResult.lunarStages.map((event) => (
                            <li key={`${event.phase}-${event.timestampUtc}`}>
                              {lunarPhaseLabels[event.phase]} · {formatUtcDate(event.timestampUtc)} · orb {event.orb.toFixed(3)}°
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gilt)]">Major sky shifts</h5>
                        <ul className="mt-2 space-y-1">
                          {monthAheadResult.skyShifts.map((event) => (
                            <li key={`${event.eventType}-${event.planet}-${event.timestampUtc}`}>
                              {sentenceCase(event.planet)} · {sentenceCase(event.eventType.replace(/([A-Z])/g, " $1").trim())} ·{" "}
                              {formatUtcDate(event.timestampUtc)}
                              {event.transitHouse ? ` · House ${event.transitHouse}` : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gilt)]">Chart contacts</h5>
                        <ul className="mt-2 space-y-1">
                          {monthAheadResult.transitContacts.map((event) => (
                            <li key={`${event.transitPlanet}-${event.natalPoint}-${event.aspect}-${event.timestampUtc}`}>
                              {sentenceCase(event.transitPlanet)} {event.aspect} {sentenceCase(event.natalPoint)} ·{" "}
                              {formatUtcDate(event.timestampUtc)}
                              {event.transitHouse ? ` · House ${event.transitHouse}` : ""}
                              {` · orb ${event.orb.toFixed(3)}°`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </details>

                  <div className="flex flex-wrap items-center gap-3">
                    {lettersIsExternal ? (
                      <a
                        href={lettersHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent("astro_month_ahead_cta_click", { target: "substack" })}
                        className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/12 px-5 py-3 text-xs uppercase tracking-[0.25em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                      >
                        Receive Astrology Letters
                      </a>
                    ) : (
                      <Link
                        href={lettersHref}
                        onClick={() => trackEvent("astro_month_ahead_cta_click", { target: "letters" })}
                        className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/12 px-5 py-3 text-xs uppercase tracking-[0.25em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
                      >
                        Receive Astrology Letters
                      </Link>
                    )}
                    <p className="text-xs leading-relaxed text-[color:var(--mist)]">
                      Return next month for a new reading or receive future astrology notes as this path deepens.
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed text-[color:var(--mist)]">
                    {monthAheadResult.reading.disclaimer}
                  </p>
                </div>
              ) : null}
            </section>

            <PlanetaryArc points={result.chart.points} />
            <SharePanel chart={result.chart} />

            <div className="astro-reveal flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onCopyShare}
                className="min-h-[44px] rounded-full border border-[color:var(--copper)]/45 bg-[color:var(--bg)]/55 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[color:var(--bone)]"
              >
                Copy Share Text
              </button>
              <button
                type="button"
                disabled
                className="min-h-[44px] rounded-full border border-[color:var(--copper)]/35 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[color:var(--mist)]/70"
              >
                Download (soon)
              </button>
              <span className="text-xs text-[color:var(--mist)]" aria-live="polite">
                {copyState === "done" ? "Copied." : copyState === "failed" ? "Copy failed." : ""}
              </span>
            </div>

            <details className="astro-reveal rounded-xl border border-[color:var(--copper)]/32 bg-[color:var(--bg)]/50 p-4 sm:rounded-2xl">
              <summary
                className="cursor-pointer text-xs uppercase tracking-[0.26em] text-[color:var(--mist)]"
                onClick={() => trackEvent("astro_chart_details_open", { surface: "natal" })}
              >
                Show chart details
              </summary>

              <div className="mt-4 space-y-5">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--mist)]">Placements</h4>
                  <div className="mt-2 overflow-x-auto">
                    <table className="w-full min-w-[320px] text-left text-sm">
                      <thead className="text-[color:var(--mist)]">
                        <tr>
                          <th className="px-2 py-1">Planet</th>
                          <th className="px-2 py-1">Sign</th>
                          <th className="px-2 py-1">Degree</th>
                          <th className="px-2 py-1">Longitude</th>
                        </tr>
                      </thead>
                      <tbody>
                        {placements.map((placement) => (
                          <tr key={placement.planet} className="border-t border-[color:var(--copper)]/25 text-[color:var(--bone)]">
                            <td className="px-2 py-1">{placement.label}</td>
                            <td className="px-2 py-1">{placement.sign}</td>
                            <td className="px-2 py-1">{placement.degree}</td>
                            <td className="px-2 py-1">{placement.longitude.toFixed(2)}°</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--mist)]">Aspects</h4>
                  <ul className="mt-2 space-y-1 text-sm text-[color:var(--bone)]">
                    {result.chart.aspects.map((aspect, index) => (
                      <li key={`${aspect.a}-${aspect.type}-${aspect.b}-${index}`}>
                        {(planetLabels[aspect.a] ?? sentenceCase(aspect.a)) + " "}
                        {aspect.type}
                        {" " + (planetLabels[aspect.b] ?? sentenceCase(aspect.b))}
                        {` (orb ${aspect.orb.toFixed(2)}°)`}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--mist)]">Houses & Angles</h4>
                  {result.chart.houses ? (
                    <div className="mt-2 space-y-2 text-sm text-[color:var(--bone)]">
                      <p>Cusps: {result.chart.houses.cusps.map((cusp) => `${cusp.toFixed(2)}°`).join(" · ")}</p>
                      <p>
                        Asc: {typeof result.chart.points.asc === "number" ? `${result.chart.points.asc.toFixed(2)}°` : "—"}
                        {"  |  "}
                        MC: {typeof result.chart.points.mc === "number" ? `${result.chart.points.mc.toFixed(2)}°` : "—"}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-[color:var(--mist)]">
                      Houses and angles omitted because exact birth time is unknown.
                    </p>
                  )}
                </div>
              </div>
            </details>

            <p className="astro-reveal text-xs leading-relaxed text-[color:var(--mist)]">{result.reading.disclaimer}</p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
