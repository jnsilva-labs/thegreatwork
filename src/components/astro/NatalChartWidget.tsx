"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import type { AstroNatalResponse } from "@/lib/astro/types";
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
  const [copyState, setCopyState] = useState<"idle" | "done" | "failed">("idle");

  const resultRef = useRef<HTMLDivElement | null>(null);

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
  }, [result]);

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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setCopyState("idle");
    setStatusMessage("Calculating chart and composing your reflection...");

    try {
      const response = await fetch("/api/astro/natal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim() || undefined,
          birthDate,
          birthTime: birthTime || undefined,
          timeUnknown,
          birthPlace,
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

        throw new Error(message);
      }

      setResult(payload as AstroNatalResponse);
      setStatusMessage("Reading complete.");
    } catch (submitError) {
      setResult(null);
      setStatusMessage("Reading failed.");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to reveal the pattern right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onCopyShare = async () => {
    if (!shareText) return;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopyState("done");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-[color:var(--copper)]/45 bg-[color:var(--char)]/70 p-5 shadow-2xl backdrop-blur-md sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(184,155,94,0.2),transparent_58%),radial-gradient(circle_at_88%_4%,rgba(232,227,216,0.12),transparent_46%)]" />
        <div className="pointer-events-none absolute -right-16 top-10 h-44 w-44 rounded-full border border-[color:var(--gilt)]/30" />
        <div className="pointer-events-none absolute -right-10 top-16 h-32 w-32 animate-spin-slow rounded-full border border-dashed border-[color:var(--gilt)]/40" />

        <div className="relative space-y-5">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--mist)]">Natal Oracle</p>
            <h1 className="font-ritual text-3xl text-[color:var(--bone)] sm:text-4xl">Reveal the Pattern</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--mist)]">
              For reflection and self-inquiry. Not deterministic fate.
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

            <label className="flex items-center gap-3 rounded-xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 px-3 py-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[color:var(--gilt)]"
                checked={timeUnknown}
                onChange={(event) => {
                  setTimeUnknown(event.target.checked);
                  if (event.target.checked) setBirthTime("");
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
                <option value="wholeSign">Whole Sign</option>
                <option value="placidus">Placidus</option>
              </select>
            </label>

            <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-1">
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
        <section ref={resultRef} className="relative overflow-hidden rounded-3xl border border-[color:var(--copper)]/45 bg-[color:var(--char)]/62 p-5 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,155,94,0.16),transparent_52%),radial-gradient(circle_at_80%_0%,rgba(232,227,216,0.08),transparent_42%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_50%_50%,rgba(184,155,94,0.2)_1px,transparent_1px)] [background-size:26px_26px]" />

          <div className="relative space-y-6">
            <div className="astro-reveal space-y-3">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--mist)]">Reading</p>
              <h2 className="font-ritual text-3xl text-[color:var(--bone)] sm:text-4xl">{result.reading.title}</h2>
              <p className="max-w-3xl text-base leading-relaxed text-[color:var(--mist)]">{result.reading.snapshot}</p>
            </div>

            <div className="astro-reveal grid gap-3 sm:grid-cols-3">
              <article className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--mist)]">Sun</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--bone)]">{result.reading.bigThree.sun}</p>
              </article>
              <article className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--mist)]">Moon</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--bone)]">{result.reading.bigThree.moon}</p>
              </article>
              <article className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--mist)]">Rising</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--bone)]">
                  {result.reading.bigThree.rising ?? "(birth time needed)"}
                </p>
              </article>
            </div>

            <div className="astro-reveal rounded-2xl border border-[color:var(--gilt)]/45 bg-[linear-gradient(180deg,rgba(184,155,94,0.14),rgba(184,155,94,0.04))] p-4 sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.33em] text-[color:var(--gilt)]">The Paradox</p>
              <p className="mt-2 text-sm text-[color:var(--bone)]">
                <strong>Tension:</strong> {result.reading.paradox.tension}
              </p>
              <p className="mt-1 text-sm text-[color:var(--bone)]">
                <strong>Gift:</strong> {result.reading.paradox.gift}
              </p>
            </div>

            <div className="astro-reveal grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-4">
                <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Core Themes</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--bone)]">
                  {result.reading.coreThemes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-4">
                <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Strengths</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--bone)]">
                  {result.reading.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-4">
                <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Shadows</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:var(--bone)]">
                  {result.reading.shadows.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="astro-reveal grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-4">
                <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Relationships</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--bone)]">{result.reading.relationships}</p>
              </article>
              <article className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-4">
                <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Career Calling</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--bone)]">{result.reading.careerCalling}</p>
              </article>
            </div>

            <div className="astro-reveal rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-4">
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

            <div className="astro-reveal rounded-2xl border border-[color:var(--gilt)]/45 bg-[color:var(--gilt)]/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--gilt)]">Mantra</p>
              <p className="mt-2 font-ritual text-2xl text-[color:var(--bone)]">{result.reading.mantra}</p>
            </div>

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

            <details className="astro-reveal rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-4">
              <summary className="cursor-pointer text-xs uppercase tracking-[0.26em] text-[color:var(--mist)]">
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
