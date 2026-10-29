import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildNatalChart } from '../lib/astro/engine/natalChart';
import { buildMonthAheadTransits } from '../lib/astro/engine/transits';
import type { NatalChartRequest } from '../lib/astro/engine/chartTypes';
import type { MonthAheadRequest } from '../lib/astro/engine/transitTypes';

const FIXTURE_DIR = join(__dirname, 'fixtures', 'astro-golden');

// Golden fixtures were captured from the swisseph-backed astro-service
// (Moshier fallback, as deployed). astronomy-engine agrees to arc-minutes;
// tolerances here are far inside the product's 6-8 degree aspect orbs.
const LONGITUDE_TOLERANCE_DEG = 0.1;
const CUSP_TOLERANCE_DEG = 0.2;
const EVENT_TOLERANCE_MS = 30 * 60 * 1000;

const angularDiff = (a: number, b: number): number => {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
};

interface NatalFixture {
  input: NatalChartRequest;
  output: {
    points: Record<string, number>;
    houses: { cusps: number[] };
    aspects: Array<{ a: string; b: string; type: string }>;
  };
}

interface MonthFixture {
  input: MonthAheadRequest;
  output: {
    lunarStages: Array<{ phase: string; timestampUtc: string }>;
    skyShifts: Array<{ eventType: string; planet: string; timestampUtc: string }>;
    transitContacts: Array<{
      transitPlanet: string;
      natalPoint: string;
      aspect: string;
      timestampUtc: string;
    }>;
  };
}

const fixtureFiles = (prefix: string) =>
  readdirSync(FIXTURE_DIR).filter((file) => file.startsWith(prefix) && file.endsWith('.json'));

describe('astronomy-engine parity with swisseph golden fixtures', () => {
  for (const file of fixtureFiles('natal-')) {
    it(`matches ${file}`, async () => {
      const fixture = JSON.parse(readFileSync(join(FIXTURE_DIR, file), 'utf8')) as NatalFixture;
      const chart = await buildNatalChart(fixture.input);

      for (const [point, golden] of Object.entries(fixture.output.points)) {
        if (point === 'chiron') continue;
        const computed = (chart.points as unknown as Record<string, number | undefined>)[point];
        expect(computed, `point ${point}`).toBeTypeOf('number');
        expect(angularDiff(computed as number, golden), `point ${point}`).toBeLessThanOrEqual(
          LONGITUDE_TOLERANCE_DEG,
        );
      }

      const goldenCusps = fixture.output.houses.cusps;
      expect(chart.houses?.cusps).toHaveLength(12);
      goldenCusps.forEach((golden, index) => {
        expect(
          angularDiff(chart.houses!.cusps[index], golden),
          `cusp ${index + 1}`,
        ).toBeLessThanOrEqual(CUSP_TOLERANCE_DEG);
      });

      const aspectKey = (a: { a: string; b: string; type: string }) => `${a.a}|${a.b}|${a.type}`;
      expect(new Set(chart.aspects.map(aspectKey))).toEqual(
        new Set(fixture.output.aspects.map(aspectKey)),
      );
    });
  }

  for (const file of fixtureFiles('month-')) {
    it(`matches ${file}`, async () => {
      const fixture = JSON.parse(readFileSync(join(FIXTURE_DIR, file), 'utf8')) as MonthFixture;
      const payload = await buildMonthAheadTransits(fixture.input);

      expect(payload.lunarStages.map((s) => s.phase)).toEqual(
        fixture.output.lunarStages.map((s) => s.phase),
      );
      payload.lunarStages.forEach((stage, index) => {
        const golden = fixture.output.lunarStages[index];
        expect(
          Math.abs(Date.parse(stage.timestampUtc) - Date.parse(golden.timestampUtc)),
          `lunar stage ${stage.phase}`,
        ).toBeLessThanOrEqual(EVENT_TOLERANCE_MS);
      });

      const shiftKey = (s: { eventType: string; planet: string }) => `${s.eventType}|${s.planet}`;
      expect(new Set(payload.skyShifts.map(shiftKey))).toEqual(
        new Set(fixture.output.skyShifts.map(shiftKey)),
      );

      const contactKey = (c: { transitPlanet: string; natalPoint: string; aspect: string }) =>
        `${c.transitPlanet}|${c.natalPoint}|${c.aspect}`;
      expect(new Set(payload.transitContacts.map(contactKey))).toEqual(
        new Set(fixture.output.transitContacts.map(contactKey)),
      );
    });
  }
});
