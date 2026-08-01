"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { AstroMonthAheadReadingResponse, AstroNatalResponse } from "@/lib/astro/types";
import { trackEvent } from "@/lib/analytics/track";
import { getSubstackUrl, isExternalHref } from "@/lib/substack";
import { PlanetaryArc } from "./PlanetaryArc";
import { SharePanel } from "./share/SharePanel";

const planetLabels: Record<string, string> = {
  sun: "Sun", moon: "Moon", mercury: "Mercury", venus: "Venus", mars: "Mars", jupiter: "Jupiter",
  saturn: "Saturn", uranus: "Uranus", neptune: "Neptune", pluto: "Pluto", node: "Node", chiron: "Chiron",
  asc: "Ascendant", mc: "Midheaven",
};

const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const lunarPhaseLabels: Record<string, string> = { newMoon: "New Moon", firstQuarter: "First Quarter", fullMoon: "Full Moon", lastQuarter: "Last Quarter" };

const sentenceCase = (value: string) => value ? value.slice(0, 1).toUpperCase() + value.slice(1) : value;
const eventTypeLabel = (value: string) => sentenceCase(value.replace(/([A-Z])/g, " $1").trim().toLowerCase());
const formatUtcDate = (timestampUtc: string) => new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(timestampUtc));
const signFromLongitude = (longitude: number) => {
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  return { sign: signs[signIndex], degree: `${(normalized - signIndex * 30).toFixed(2)}°` };
};

export interface NatalReadingResultProps {
  result: AstroNatalResponse;
  monthAheadResult?: AstroMonthAheadReadingResponse | null;
  monthAheadLoading?: boolean;
  monthAheadError?: string | null;
  monthAheadStatus?: string;
  onRequestMonthAhead?: () => void;
  sharePreviewEnabled?: boolean;
  defaultOpenAdvanced?: boolean;
}

export function NatalReadingResult({
  result,
  monthAheadResult = null,
  monthAheadLoading = false,
  monthAheadError = null,
  monthAheadStatus = "",
  onRequestMonthAhead,
  sharePreviewEnabled = true,
  defaultOpenAdvanced = false,
}: NatalReadingResultProps) {
  const [copyState, setCopyState] = useState<{
    result: AstroNatalResponse;
    status: "idle" | "done" | "failed";
  }>({ result, status: "idle" });
  const currentCopyState = copyState.result === result ? copyState.status : "idle";
  const placements = useMemo(() => Object.entries(result.chart.points)
    .filter(([, value]) => typeof value === "number")
    .map(([planet, value]) => {
      const longitude = value as number;
      return { planet, label: planetLabels[planet] ?? sentenceCase(planet), longitude, ...signFromLongitude(longitude) };
    })
    .sort((a, b) => a.longitude - b.longitude), [result]);
  const lettersHref = getSubstackUrl();
  const lettersIsExternal = isExternalHref(lettersHref);

  const onCopyShare = async () => {
    const { bigThree, paradox, mantra } = result.reading;
    const shareText = [
      "Awareness Paradox — Natal Snapshot",
      `Sun: ${bigThree.sun}`,
      `Moon: ${bigThree.moon}`,
      `Rising: ${bigThree.rising ?? "(birth time needed)"}`,
      `Paradox: ${paradox.tension} -> ${paradox.gift}`,
      `Mantra: ${mantra}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(shareText);
      setCopyState({ result, status: "done" });
      trackEvent("astro_share_export", { method: "copy_text" });
    } catch {
      setCopyState({ result, status: "failed" });
    }
  };

  return (
    <section className="relative border-y border-[color:var(--copper)]/38 py-10 sm:py-14" aria-labelledby="natal-reading-title">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--gilt)_13%,transparent),transparent_58%)]" />
      <div className="relative space-y-14">
        <header data-result-section="thesis" className="astro-reveal max-w-4xl space-y-5">
          <p className="type-eyebrow text-[color:var(--gilt)]">Natal thesis</p>
          <h2 id="natal-reading-title" className="font-ritual text-4xl leading-tight text-[color:var(--bone)] sm:text-6xl">{result.reading.title}</h2>
          <p className="max-w-3xl font-ritual text-2xl leading-relaxed text-[color:var(--mist)] sm:text-3xl">{result.reading.snapshot}</p>
        </header>

        <section data-result-section="big-three" aria-labelledby="result-big-three" className="astro-reveal space-y-5">
          <h3 id="result-big-three" className="type-eyebrow text-[color:var(--mist)]">The big three</h3>
          <div className="grid border-y border-[color:var(--copper)]/32 sm:grid-cols-3">
            {[
              ["Sun", result.reading.bigThree.sun],
              ["Moon", result.reading.bigThree.moon],
              ["Rising", result.reading.bigThree.rising ?? "Birth time unknown. Rising sign and houses are intentionally omitted."],
            ].map(([label, body], index) => (
              <div key={label} className="border-b border-[color:var(--copper)]/24 py-6 sm:border-b-0 sm:border-l sm:px-6 sm:first:border-l-0">
                <p className="text-xs uppercase tracking-[0.12em] text-[color:var(--gilt)]">{String(index + 1).padStart(2, "0")} · {label}</p>
                <p className="mt-3 text-base leading-relaxed text-[color:var(--bone)]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section data-result-section="paradox" aria-labelledby="result-paradox" className="astro-reveal grid gap-5 border-l border-[color:var(--gilt)]/55 pl-6 md:grid-cols-[0.32fr_0.68fr] md:pl-8">
          <div>
            <p className="type-eyebrow text-[color:var(--gilt)]">The paradox</p>
            <h3 id="result-paradox" className="mt-3 font-ritual text-3xl text-[color:var(--bone)]">The tension carries its own gift.</h3>
          </div>
          <dl className="grid gap-5 sm:grid-cols-2">
            <div><dt className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Tension</dt><dd className="mt-2 text-base leading-relaxed text-[color:var(--bone)]">{result.reading.paradox.tension}</dd></div>
            <div><dt className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Gift</dt><dd className="mt-2 text-base leading-relaxed text-[color:var(--bone)]">{result.reading.paradox.gift}</dd></div>
          </dl>
        </section>

        <section data-result-section="chart-context" aria-labelledby="chart-context-title" className="astro-reveal space-y-6">
          <div className="max-w-2xl space-y-2"><p className="type-eyebrow text-[color:var(--gilt)]">Celestial context</p><h3 id="chart-context-title" className="font-ritual text-3xl text-[color:var(--bone)] sm:text-4xl">Where the bodies gathered</h3></div>
          <PlanetaryArc points={result.chart.points} />
        </section>

        <section data-result-section="supporting-interpretation" aria-labelledby="supporting-title" className="astro-reveal space-y-10">
          <div className="border-b border-[color:var(--copper)]/28 pb-4"><p className="type-eyebrow text-[color:var(--gilt)]">Supporting interpretation</p><h3 id="supporting-title" className="mt-2 font-ritual text-3xl text-[color:var(--bone)] sm:text-4xl">Patterns to carry into practice</h3></div>
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-3">
            {[["Core themes", result.reading.coreThemes], ["Strengths", result.reading.strengths], ["Growth edges", result.reading.shadows]].map(([heading, items]) => (
              <article key={heading as string} className="border-t border-[color:var(--copper)]/24 pt-4">
                <h4 className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">{heading}</h4>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[color:var(--bone)]">{(items as string[]).map((item) => <li key={item} className="border-b border-[color:var(--copper)]/16 pb-3">{item}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <article className="border-t border-[color:var(--copper)]/24 pt-4"><h4 className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Relationships</h4><p className="mt-3 text-base leading-relaxed text-[color:var(--bone)]">{result.reading.relationships}</p></article>
            <article className="border-t border-[color:var(--copper)]/24 pt-4"><h4 className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Career calling</h4><p className="mt-3 text-base leading-relaxed text-[color:var(--bone)]">{result.reading.careerCalling}</p></article>
          </div>
          <div className="grid gap-8 border-y border-[color:var(--copper)]/28 py-7 md:grid-cols-[0.35fr_0.65fr]">
            <div><p className="type-eyebrow text-[color:var(--gilt)]">Mantra</p><p className="mt-3 font-ritual text-3xl leading-tight text-[color:var(--bone)]">{result.reading.mantra}</p></div>
            <div><h4 className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Growth keys</h4><ol className="mt-4 space-y-4">{result.reading.growthKeys.map((key, index) => <li key={key.label} className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-relaxed text-[color:var(--bone)]"><span className="font-ritual text-xl text-[color:var(--gilt)]">{String(index + 1).padStart(2, "0")}</span><span><strong>{key.label}:</strong> {key.practice}</span></li>)}</ol></div>
          </div>
        </section>

        <section data-result-section="month-ahead" aria-labelledby="month-ahead-title" className="astro-reveal border-y border-[color:var(--gilt)]/35 py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl"><p className="type-eyebrow text-[color:var(--gilt)]">See the month ahead</p><h3 id="month-ahead-title" className="mt-2 font-ritual text-3xl text-[color:var(--bone)] sm:text-4xl">A 30-day reading from computed sky events</h3><p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">Generated only when you ask, from lunar stages, major sky shifts, and high-signal contacts to your chart.</p></div>
            {onRequestMonthAhead ? <button type="button" onClick={onRequestMonthAhead} disabled={monthAheadLoading} className="min-h-[44px] border border-[color:var(--gilt)]/65 px-5 py-3 text-xs uppercase tracking-[0.14em] text-[color:var(--bone)] transition-[background-color] hover:bg-[color:var(--gilt)]/12 disabled:opacity-60">{monthAheadLoading ? "Reading the sky..." : monthAheadResult ? "Refresh the month ahead" : "See the month ahead"}</button> : null}
          </div>
          <p className="mt-4 text-xs text-[color:var(--mist)]" aria-live="polite">{monthAheadStatus}</p>
          {monthAheadError ? <p role="alert" className="mt-4 border-l-2 border-rose-300/60 pl-4 text-sm text-rose-100">{monthAheadError}</p> : null}
          {monthAheadResult ? (
            <div className="mt-8 space-y-8">
              <div className="max-w-3xl"><p className="text-xs uppercase tracking-[0.12em] text-[color:var(--gilt)]">{monthAheadResult.reading.timeframe}</p><h4 className="mt-2 font-ritual text-3xl text-[color:var(--bone)]">{monthAheadResult.reading.title}</h4><p className="mt-4 text-base leading-relaxed text-[color:var(--mist)]">{monthAheadResult.reading.overview}</p></div>
              <div className="grid gap-8 md:grid-cols-2"><article><h4 className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Major themes</h4><ul className="mt-3 space-y-2 text-sm text-[color:var(--bone)]">{monthAheadResult.reading.majorThemes.map((item) => <li key={item}>✦ {item}</li>)}</ul></article><article><h4 className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Lunar rhythm</h4><ul className="mt-3 space-y-3 text-sm text-[color:var(--bone)]">{monthAheadResult.reading.lunarStages.map((item) => <li key={`${item.phase}-${item.window}`}><strong>{lunarPhaseLabels[item.phase]} · {item.window}</strong><span className="block text-[color:var(--mist)]">{item.cue}</span></li>)}</ul></article></div>
              <article><h4 className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Transit highlights</h4><ol className="mt-3 divide-y divide-[color:var(--copper)]/20 border-y border-[color:var(--copper)]/20">{monthAheadResult.reading.transitHighlights.map((item, index) => <li key={`${item.title}-${item.window}`} className="grid gap-2 py-4 sm:grid-cols-[2rem_10rem_1fr]"><span className="font-ritual text-xl text-[color:var(--gilt)]">{String(index + 1).padStart(2, "0")}</span><span className="text-xs uppercase tracking-[0.1em] text-[color:var(--mist)]">{item.window}</span><span className="text-sm text-[color:var(--bone)]"><strong>{item.title}</strong><span className="mt-1 block leading-relaxed text-[color:var(--mist)]">{item.guidance}</span></span></li>)}</ol></article>
              <div className="grid gap-8 md:grid-cols-2">{[["Practice suggestions", monthAheadResult.reading.practiceSuggestions], ["Cautions", monthAheadResult.reading.cautions]].map(([heading, items]) => <article key={heading as string} className="border-t border-[color:var(--copper)]/24 pt-4"><h4 className="text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">{heading}</h4><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--bone)]">{(items as string[]).map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
              <blockquote className="border-l border-[color:var(--gilt)]/55 pl-5 font-ritual text-2xl text-[color:var(--bone)]">{monthAheadResult.reading.closingLine}</blockquote>
              <p className="text-xs leading-relaxed text-[color:var(--mist)]">{monthAheadResult.reading.disclaimer}</p>
            </div>
          ) : null}
        </section>

        <section className="astro-reveal space-y-6" aria-label="Share this chart">
          <SharePanel chart={result.chart} previewEnabled={sharePreviewEnabled} />
          <div className="flex flex-wrap items-center gap-3"><button type="button" onClick={onCopyShare} className="min-h-[44px] border border-[color:var(--copper)]/45 px-4 py-2 text-xs uppercase tracking-[0.12em] text-[color:var(--bone)]">Copy share text</button><span className="text-xs text-[color:var(--mist)]" aria-live="polite">{currentCopyState === "done" ? "Copied." : currentCopyState === "failed" ? "Copy failed." : ""}</span></div>
        </section>

        <details data-result-section="advanced-details" open={defaultOpenAdvanced || undefined} className="astro-reveal border-y border-[color:var(--copper)]/28 py-5">
          <summary className="min-h-[44px] cursor-pointer py-3 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]" onClick={() => trackEvent("astro_chart_details_open", { surface: "natal" })}>Advanced chart details</summary>
          <div className="mt-6 space-y-8">
            <section aria-labelledby="placement-details"><h3 id="placement-details" className="font-ritual text-2xl text-[color:var(--bone)]">Placements</h3><div className="mt-3 overflow-x-auto"><table className="w-full min-w-[34rem] text-left text-sm"><thead className="text-[color:var(--mist)]"><tr><th className="py-2">Planet</th><th>Sign</th><th>Degree</th><th>Longitude</th></tr></thead><tbody>{placements.map((placement) => <tr key={placement.planet} className="border-t border-[color:var(--copper)]/20 text-[color:var(--bone)]"><td className="py-2">{placement.label}</td><td>{placement.sign}</td><td>{placement.degree}</td><td>{placement.longitude.toFixed(2)}°</td></tr>)}</tbody></table></div></section>
            <div className="grid gap-8 md:grid-cols-2"><section aria-labelledby="aspect-details"><h3 id="aspect-details" className="font-ritual text-2xl text-[color:var(--bone)]">Aspects</h3><ul className="mt-3 space-y-2 text-sm text-[color:var(--mist)]">{result.chart.aspects.map((aspect, index) => <li key={`${aspect.a}-${aspect.type}-${aspect.b}-${index}`}>{planetLabels[aspect.a] ?? sentenceCase(aspect.a)} {aspect.type} {planetLabels[aspect.b] ?? sentenceCase(aspect.b)} · orb {aspect.orb.toFixed(2)}°</li>)}</ul></section><section aria-labelledby="house-details"><h3 id="house-details" className="font-ritual text-2xl text-[color:var(--bone)]">Houses & angles</h3>{result.chart.houses ? <ul className="mt-3 space-y-2 text-sm text-[color:var(--mist)]"><li>Cusps: {result.chart.houses.cusps.map((cusp) => `${cusp.toFixed(2)}°`).join(" · ")}</li><li>Asc: {typeof result.chart.points.asc === "number" ? `${result.chart.points.asc.toFixed(2)}°` : "—"} · MC: {typeof result.chart.points.mc === "number" ? `${result.chart.points.mc.toFixed(2)}°` : "—"}</li></ul> : <p className="mt-3 text-sm text-[color:var(--mist)]">Houses and angles omitted because exact birth time is unknown.</p>}</section></div>
            {monthAheadResult ? <details className="border-t border-[color:var(--copper)]/20 pt-4"><summary className="min-h-[44px] cursor-pointer py-3 text-xs uppercase tracking-[0.12em] text-[color:var(--mist)]">Computed month-ahead sky events</summary><div className="mt-4 grid gap-6 md:grid-cols-3"><section><h4 className="text-xs uppercase tracking-[0.1em] text-[color:var(--gilt)]">Lunar stages</h4><ul className="mt-2 space-y-1 text-sm text-[color:var(--mist)]">{monthAheadResult.lunarStages.map((event) => <li key={`${event.phase}-${event.timestampUtc}`}>{lunarPhaseLabels[event.phase]} · {formatUtcDate(event.timestampUtc)} · orb {event.orb.toFixed(3)}°</li>)}</ul></section><section><h4 className="text-xs uppercase tracking-[0.1em] text-[color:var(--gilt)]">Sky shifts</h4><ul className="mt-2 space-y-1 text-sm text-[color:var(--mist)]">{monthAheadResult.skyShifts.map((event) => <li key={`${event.eventType}-${event.planet}-${event.timestampUtc}`}>{sentenceCase(event.planet)} · {eventTypeLabel(event.eventType)} · {formatUtcDate(event.timestampUtc)}{event.transitHouse ? ` · House ${event.transitHouse}` : ""}</li>)}</ul></section><section><h4 className="text-xs uppercase tracking-[0.1em] text-[color:var(--gilt)]">Chart contacts</h4><ul className="mt-2 space-y-1 text-sm text-[color:var(--mist)]">{monthAheadResult.transitContacts.map((event) => <li key={`${event.transitPlanet}-${event.natalPoint}-${event.timestampUtc}`}>{sentenceCase(event.transitPlanet)} {event.aspect} {sentenceCase(event.natalPoint)} · {formatUtcDate(event.timestampUtc)}{event.transitHouse ? ` · House ${event.transitHouse}` : ""} · orb {event.orb.toFixed(3)}°</li>)}</ul></section></div></details> : null}
          </div>
        </details>

        <footer className="astro-reveal space-y-5 text-xs leading-relaxed text-[color:var(--mist)]"><p>{result.reading.disclaimer}</p><div>{lettersIsExternal ? <a className="ritual-link min-h-[44px]" href={lettersHref} target="_blank" rel="noopener noreferrer" onClick={monthAheadResult ? () => trackEvent("astro_month_ahead_cta_click", { target: "substack" }) : undefined}>Receive astrology letters</a> : <Link className="ritual-link min-h-[44px]" href={lettersHref} onClick={monthAheadResult ? () => trackEvent("astro_month_ahead_cta_click", { target: "letters" }) : undefined}>Receive astrology letters</Link>}</div></footer>
      </div>
    </section>
  );
}
