import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SharePanel } from "@/components/astro/share/SharePanel";
import type { AstroChart } from "@/lib/astro/types";

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("astrology celestial instrument visual hierarchy", () => {
  it("opens with one route h1 and an early semantic celestial orientation", () => {
    const page = readSource("src/app/astrology/page.tsx");
    const orientation = readSource("src/components/astro/CelestialOrientation.tsx");

    expect(page.match(/<h1\b/g)).toHaveLength(1);
    expect(page).toContain("<CelestialOrientation");
    expect(page.indexOf("<CelestialOrientation")).toBeLessThan(page.indexOf("<NatalChartWidget"));
    expect(page.indexOf('href="#natal-widget"')).toBeLessThan(page.indexOf("<NatalChartWidget"));
    expect(orientation).toContain("<svg");
    expect(orientation).toMatch(/role="img"/);
    expect(orientation).not.toMatch(/<canvas|from ["']three|WebGLRenderer|\.glb|\.gltf/i);
  });

  it("reserves OraclePanel for the form and demotes the widget heading", () => {
    const widget = readSource("src/components/astro/NatalChartWidget.tsx");
    const result = readSource("src/components/astro/NatalReadingResult.tsx");

    expect(widget).toContain("<OraclePanel");
    expect(widget).toContain('headingLevel="h2"');
    expect(widget).not.toMatch(/<h1\b/);
    expect(widget).toContain("export function NatalReadingResult");
    expect(result).toContain("export function NatalReadingResult");
  });

  it("orders results as a continuous editorial reading", () => {
    const widget = readSource("src/components/astro/NatalReadingResult.tsx");
    const landmarks = [
      'data-result-section="thesis"',
      'data-result-section="big-three"',
      'data-result-section="paradox"',
      'data-result-section="chart-context"',
      'data-result-section="supporting-interpretation"',
      'data-result-section="month-ahead"',
      "<SharePanel",
      'data-result-section="advanced-details"',
    ];

    let previous = -1;
    for (const landmark of landmarks) {
      const next = widget.indexOf(landmark);
      expect(next, landmark).toBeGreaterThan(previous);
      previous = next;
    }
    expect(widget).toMatch(/<details[\s\S]*?data-result-section="advanced-details"/);
  });

  it("uses readable labels, semantic lists, and 44px planetary targets", () => {
    const upgraded = [
      readSource("src/components/astro/NatalChartWidget.tsx"),
      readSource("src/components/astro/NatalReadingResult.tsx"),
      readSource("src/components/astro/PlanetaryArc.tsx"),
      readSource("src/components/astro/share/SharePanel.tsx"),
    ].join("\n");
    const arc = readSource("src/components/astro/PlanetaryArc.tsx");

    expect(upgraded).not.toMatch(/text-\[(?:9|10|11)px\]/);
    expect(upgraded).toContain("<ul");
    expect(upgraded).toContain("<details");
    expect(arc).toContain("min-h-[44px]");
    expect(arc).toContain("min-w-[44px]");
  });

  it("routes result and celestial-ring animation through the shared motion preference", () => {
    const widget = readSource("src/components/astro/NatalChartWidget.tsx");
    const orientation = readSource("src/components/astro/CelestialOrientation.tsx");

    expect(widget).toContain("useMotionPreference");
    expect(widget).toMatch(/if \(!result \|\| !resultRef\.current \|\| !motionOk\) return/);
    expect(orientation).toContain("useMotionPreference");
    expect(orientation).toMatch(/motionOk\s*\?/);
  });

  it("provides a typed, complete, no-fetch visual QA result fixture", () => {
    const fixtures = readSource("src/components/dev/VisualQaFixtures.tsx");

    expect(fixtures).toContain("AstroNatalResponse");
    expect(fixtures).toContain("AstroMonthAheadReadingResponse");
    expect(fixtures).toContain('data-qa-astro-fixture="natal-result"');
    expect(fixtures).toContain("timeUnknown: true");
    expect(fixtures).toContain("defaultOpenAdvanced");
    expect(fixtures).toContain("sharePreviewEnabled={false}");
    expect(fixtures).toContain("<NatalReadingResult");
  });

  it("keeps SharePanel network-silent when rendered as a visual fixture", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const chart: AstroChart = {
      meta: { fixture: true },
      points: { sun: 10, moon: 80 },
      houses: null,
      aspects: [],
    };

    render(<SharePanel chart={chart} previewEnabled={false} />);

    await waitFor(() => expect(fetchSpy).not.toHaveBeenCalled());
  });
});
