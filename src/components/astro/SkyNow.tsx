import {
  calcPlanetLongitude,
  planets,
  toJulianDayUtc,
  type PlanetId,
} from "@/lib/astro/engine/ephemeris";
import { NatalChartInstrument } from "./NatalChartInstrument";

/**
 * The Celestial Instrument, live: the current sky's planetary longitudes,
 * computed in-process at render time (the page revalidates hourly). No
 * birth data, no API call — a working preview of the instrument a visitor
 * receives with their own chart. Houses need a birthplace, so none show.
 */
export async function SkyNow() {
  const now = new Date();
  const iso = now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const jdUt = toJulianDayUtc(iso);
  const ids = Object.keys(planets) as PlanetId[];
  const entries = await Promise.all(
    ids.map(async (id) => [id, await calcPlanetLongitude(jdUt, id)] as const)
  );
  const points = Object.fromEntries(entries) as Record<string, number>;

  const hourLabel = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hourCycle: "h23",
  }).format(now);
  const dayLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(now);

  return (
    <section aria-labelledby="sky-now-title" className="space-y-6">
      <div className="max-w-2xl space-y-3">
        <p className="type-eyebrow text-[color:var(--gilt)]">The celestial instrument</p>
        <h2 id="sky-now-title" className="font-ritual text-4xl text-[color:var(--bone)] sm:text-5xl">
          The sky right now
        </h2>
        <p className="text-base leading-relaxed text-[color:var(--mist)]">
          These are the heavens as they stand near {hourLabel} UTC, {dayLabel}: the same
          instrument your reading is drawn on. Turn it, select a body, read its exact degree.
          Set your coordinates below and it becomes yours, houses and all.
        </p>
      </div>
      <NatalChartInstrument points={points} cusps={null} aspects={[]} />
    </section>
  );
}
