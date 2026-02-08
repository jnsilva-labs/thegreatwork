import { describe, expect, it } from "vitest";
import { generateConstellationSvg } from "../lib/astro/sharecards/constellation";
import { generateTotemSvg } from "../lib/astro/sharecards/totem";

const baseChart = {
  meta: {},
  points: {
    sun: 223.15,
    moon: 130.75,
    mercury: 245.96,
    venus: 205.01,
    mars: 185.64,
    jupiter: 308.9,
    saturn: 238.65,
    uranus: 256.17,
    neptune: 271.63,
    pluto: 215.02,
    node: 39.18,
    asc: 291.17,
    mc: 209.18
  },
  houses: { cusps: [270, 300, 330, 0, 30, 60, 90, 120, 150, 180, 210, 240] },
  aspects: [
    { a: "sun", b: "moon", type: "square", orb: 2.4 },
    { a: "venus", b: "asc", type: "square", orb: 3.84 },
    { a: "mercury", b: "jupiter", type: "sextile", orb: 2.94 },
    { a: "moon", b: "jupiter", type: "opposition", orb: 1.85 }
  ]
};

describe("sharecards deterministic output", () => {
  it("returns identical totem SVG for same chart", () => {
    const first = generateTotemSvg(baseChart, { watermark: true, background: "dark" });
    const second = generateTotemSvg(baseChart, { watermark: true, background: "dark" });

    expect(second).toBe(first);
  });

  it("returns identical constellation SVG for same chart", () => {
    const first = generateConstellationSvg(baseChart, {
      watermark: true,
      background: "dark",
      includeAspects: true
    });
    const second = generateConstellationSvg(baseChart, {
      watermark: true,
      background: "dark",
      includeAspects: true
    });

    expect(second).toBe(first);
  });

  it("changes output for different chart", () => {
    const otherChart = {
      ...baseChart,
      points: {
        ...baseChart.points,
        sun: 150.2,
        moon: 18.1,
        asc: 20.2
      }
    };

    const first = generateConstellationSvg(baseChart, { watermark: true });
    const second = generateConstellationSvg(otherChart, { watermark: true });

    expect(second).not.toBe(first);
  });

  it("watermark toggle changes output", () => {
    const withWatermark = generateTotemSvg(baseChart, { watermark: true });
    const withoutWatermark = generateTotemSvg(baseChart, { watermark: false });

    expect(withWatermark).not.toBe(withoutWatermark);
    expect(withoutWatermark.includes("@awarenessparadox")).toBe(false);
  });

  it("constellation output uses procedural icons (no zodiac/planet glyph chars)", () => {
    const constellation = generateConstellationSvg(baseChart, {
      watermark: true,
      background: "dark",
      includeAspects: true
    });

    expect(constellation).not.toMatch(/[\u2600-\u26FF\u2648-\u2653]/);
  });
});
