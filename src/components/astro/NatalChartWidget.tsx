"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { OraclePanel } from "@/components/editorial";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import type { AstroMonthAheadReadingResponse, AstroNatalResponse } from "@/lib/astro/types";
import { trackEvent } from "@/lib/analytics/track";
import { NatalReadingResult as NatalReadingResultView, type NatalReadingResultProps } from "./NatalReadingResult";
import { TurnstileWidget } from "./TurnstileWidget";

type HouseSystem = "wholeSign" | "placidus";

const houseSystemDescriptions: Record<HouseSystem, string> = {
  wholeSign: "Whole Sign maps one full sign to each house.",
  placidus: "Placidus divides houses by time and quadrant.",
};

export function NatalReadingResult(props: NatalReadingResultProps) {
  return <NatalReadingResultView {...props} />;
}

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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [astroAccessVerified, setAstroAccessVerified] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const pageViewTrackedRef = useRef(false);
  const { motionOk } = useMotionPreference();

  useEffect(() => {
    if (!result || !resultRef.current || !motionOk) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        ".astro-reveal",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", stagger: 0.08 },
      );
    }, resultRef);
    return () => context.revert();
  }, [result, monthAheadResult, motionOk]);

  useEffect(() => {
    if (pageViewTrackedRef.current) return;
    pageViewTrackedRef.current = true;
    trackEvent("astro_page_view", { page: "astrology" });
  }, []);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
  const turnstileEnabled = Boolean(turnstileSiteKey);

  const resetVerification = (message?: string) => {
    setAstroAccessVerified(false);
    setTurnstileToken(null);
    setTurnstileResetKey((value) => value + 1);
    if (message) setMonthAheadError(message);
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
    setStatusMessage("Calculating chart and composing your reflection...");
    trackEvent("astro_natal_submit", { houseSystem, timeUnknown });

    try {
      const response = await fetch("/api/astro/natal", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          birthDate,
          birthTime: birthTime || undefined,
          timeUnknown,
          birthPlace,
          turnstileToken: astroAccessVerified ? undefined : turnstileToken ?? undefined,
          houseSystem,
          zodiac: "tropical",
        }),
      });
      const payload = (await response.json()) as AstroNatalResponse | { error?: string; code?: string; details?: unknown };
      if (!response.ok) {
        const fallback = "Could not generate your reading. Please check your inputs and try again.";
        const message = typeof payload === "object" && payload && "error" in payload ? String(payload.error ?? fallback) : fallback;
        if (typeof payload === "object" && payload && "code" in payload && (payload.code === "TURNSTILE_REQUIRED" || payload.code === "TURNSTILE_FAILED")) {
          setAstroAccessVerified(false);
        }
        throw new Error(message);
      }

      setResult(payload as AstroNatalResponse);
      setStatusMessage("Reading complete.");
      setAstroAccessVerified(true);
      setTurnstileToken(null);
      setTurnstileResetKey((value) => value + 1);
      trackEvent("astro_natal_success", { houseSystem, timeUnknown });
    } catch (submitError) {
      setResult(null);
      setStatusMessage("Reading failed.");
      setError(submitError instanceof Error ? submitError.message : "Unable to reveal the pattern right now. Please try again.");
      resetVerification();
      trackEvent("astro_natal_error", { houseSystem, timeUnknown });
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
    trackEvent("astro_month_ahead_click", { timeUnknown: result.meta.timeUnknown });

    try {
      const response = await fetch("/api/astro/month-ahead", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chart: result.chart,
          timeUnknown: result.meta.timeUnknown,
          turnstileToken: astroAccessVerified ? undefined : turnstileToken ?? undefined,
        }),
      });
      const payload = (await response.json()) as AstroMonthAheadReadingResponse | { error?: string; code?: string; details?: unknown };
      if (!response.ok) {
        const fallback = "Could not interpret the month ahead. Please try again.";
        const message = typeof payload === "object" && payload && "error" in payload ? String(payload.error ?? fallback) : fallback;
        if (typeof payload === "object" && payload && "code" in payload && (payload.code === "TURNSTILE_REQUIRED" || payload.code === "TURNSTILE_FAILED")) {
          resetVerification("Verification expired. Please complete the check again to read the month ahead.");
        }
        throw new Error(message);
      }

      setMonthAheadResult(payload as AstroMonthAheadReadingResponse);
      setMonthAheadStatus("Month-ahead reading complete.");
      setAstroAccessVerified(true);
      setTurnstileToken(null);
      setTurnstileResetKey((value) => value + 1);
      trackEvent("astro_month_ahead_success", { timeUnknown: result.meta.timeUnknown, highlights: (payload as AstroMonthAheadReadingResponse).highlights.length });
    } catch (requestError) {
      setMonthAheadError((current) => current ?? (requestError instanceof Error ? requestError.message : "Unable to interpret the month ahead right now. Please try again."));
      if (requestError instanceof Error && !requestError.message.includes("Verification")) {
        setTurnstileToken(null);
        setTurnstileResetKey((value) => value + 1);
      }
      setMonthAheadStatus("Month-ahead reading failed.");
      trackEvent("astro_month_ahead_error", { timeUnknown: result.meta.timeUnknown });
    } finally {
      setMonthAheadLoading(false);
    }
  };

  const inputClass = "min-h-[44px] w-full border border-[color:var(--copper)]/42 bg-[color:var(--bg)]/45 px-3 py-2 text-sm text-[color:var(--bone)] focus-visible:border-[color:var(--gilt)] focus-visible:outline-none";

  return (
    <div id="natal-widget" className="mx-auto w-full max-w-5xl scroll-mt-28 space-y-12 pb-12 pt-2">
      <OraclePanel
        heading="Set the coordinates"
        eyebrow="Natal oracle · celestial instrument"
        headingLevel="h2"
        footer={<p className="text-xs leading-relaxed text-[color:var(--mist)]">Your birth details are sent to calculate this reading. Enter only what is needed.</p>}
      >
        <div className="relative">
          <div className={`pointer-events-none absolute -right-5 -top-24 hidden h-28 w-28 rounded-full border border-dashed border-[color:var(--gilt)]/32 sm:block ${motionOk ? "animate-spin-slow" : ""}`} />
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-[color:var(--mist)]">Computed chart facts become a reflective reading. If your birth time is unknown, houses and rising-sign claims are removed on purpose.</p>
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={onSubmit}>
            <label className="space-y-2 text-sm"><span className="text-[color:var(--bone)]">Name (optional)</span><input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" /></label>
            <label className="space-y-2 text-sm"><span className="text-[color:var(--bone)]">Birth date</span><input name="birth-date" type="date" required autoComplete="bday" className={inputClass} value={birthDate} onChange={(event) => setBirthDate(event.target.value)} /></label>
            <label className="space-y-2 text-sm"><span className="text-[color:var(--bone)]">Birth time</span><input name="birth-time" type="time" required={!timeUnknown} disabled={timeUnknown} autoComplete="off" className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`} value={birthTime} onChange={(event) => setBirthTime(event.target.value)} /></label>
            <label className="space-y-2 text-sm"><span className="text-[color:var(--bone)]">Birth place</span><input name="birth-place" required placeholder="City, Region, Country" autoComplete="address-level2" className={inputClass} value={birthPlace} onChange={(event) => setBirthPlace(event.target.value)} /></label>
            <label className="flex min-h-[44px] items-center gap-3 border-y border-[color:var(--copper)]/28 py-3 text-sm sm:col-span-2"><input type="checkbox" className="h-5 w-5 accent-[color:var(--gilt)]" checked={timeUnknown} onChange={(event) => { setTimeUnknown(event.target.checked); if (event.target.checked) { setBirthTime(""); trackEvent("astro_time_unknown_enabled", { page: "astrology" }); } }} />I don&apos;t know my exact birth time</label>
            <label className="space-y-2 text-sm sm:col-span-2"><span className="text-[color:var(--bone)]">House system</span><select value={houseSystem} onChange={(event) => setHouseSystem(event.target.value as HouseSystem)} className={inputClass}><option value="wholeSign">Whole Sign • sign-based</option><option value="placidus">Placidus • quadrant-based</option></select><p className="text-xs leading-relaxed text-[color:var(--mist)]">{houseSystemDescriptions[houseSystem]}</p></label>
            {turnstileEnabled && !astroAccessVerified ? <div className="space-y-3 border-t border-[color:var(--copper)]/28 pt-4 sm:col-span-2"><p className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Verification</p><TurnstileWidget siteKey={turnstileSiteKey} resetKey={turnstileResetKey} onVerify={setTurnstileToken} /><p className="text-xs leading-relaxed text-[color:var(--mist)]">This keeps the public astrology tool usable without opening the API to automated abuse.</p></div> : null}
            <div className="flex flex-col items-start gap-3 border-t border-[color:var(--copper)]/28 pt-5 sm:col-span-2 sm:flex-row sm:items-center"><button type="submit" disabled={loading} className="min-h-[44px] border border-[color:var(--gilt)]/65 bg-[color:var(--gilt)]/12 px-6 py-3 text-xs uppercase tracking-[0.14em] text-[color:var(--bone)] transition-[background-color] hover:bg-[color:var(--gilt)]/22 disabled:opacity-60">{loading ? "Revealing..." : "Reveal the pattern"}</button><span className="text-xs text-[color:var(--mist)]" aria-live="polite">{statusMessage}</span></div>
          </form>
          {error ? <p className="mt-5 border-l-2 border-rose-300/60 pl-4 text-sm text-rose-100" role="alert">{error}</p> : null}
        </div>
      </OraclePanel>

      {result ? (
        <div ref={resultRef}>
          <NatalReadingResult
            result={result}
            monthAheadResult={monthAheadResult}
            monthAheadLoading={monthAheadLoading}
            monthAheadError={monthAheadError}
            monthAheadStatus={monthAheadStatus}
            onRequestMonthAhead={onRequestMonthAhead}
          />
        </div>
      ) : null}
    </div>
  );
}
