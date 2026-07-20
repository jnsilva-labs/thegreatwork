import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CelestialOrientation } from "@/components/astro/CelestialOrientation";
import { NatalReadingResult } from "@/components/astro/NatalReadingResult";
import { SharePanel } from "@/components/astro/share/SharePanel";
import type { AstroChart, AstroMonthAheadReadingResponse, AstroNatalResponse } from "@/lib/astro/types";

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

const natalResult = (title: string): AstroNatalResponse => ({
  chart: {
    meta: {},
    points: { sun: 10, moon: 80 },
    houses: null,
    aspects: [],
  },
  reading: {
    title,
    bigThree: { sun: "Aries Sun", moon: "Gemini Moon", rising: null },
    snapshot: "A complete test snapshot.",
    coreThemes: ["Theme"],
    strengths: ["Strength"],
    shadows: ["Edge"],
    relationships: "Relational pattern.",
    careerCalling: "Vocation pattern.",
    growthKeys: [{ label: "Practice", practice: "Begin." }],
    paradox: { tension: "Hold", gift: "Release" },
    mantra: "I attend.",
    disclaimer: "For reflection.",
  },
  meta: { timeUnknown: true, houseSystem: "wholeSign", zodiac: "tropical" },
});

const monthAheadResult: AstroMonthAheadReadingResponse = {
  meta: { startDateUtc: "2030-01-01T00:00:00.000Z", endDateUtc: "2030-01-31T00:00:00.000Z", durationDays: 30, generatedAt: "2030-01-01T00:00:00.000Z", sampleHours: 6, zodiac: "tropical" },
  lunarStages: [{ kind: "lunarStage", phase: "fullMoon", timestampUtc: "2030-01-18T12:00:00.000Z", orb: 0.125, priority: 1 }],
  skyShifts: [{ kind: "skyShift", eventType: "stationRetrograde", planet: "venus", timestampUtc: "2030-01-09T18:00:00.000Z", longitude: 300, speed: -0.1, priority: 2, transitHouse: 4 }],
  transitContacts: [{ kind: "transitContact", transitPlanet: "saturn", natalPoint: "sun", aspect: "trine", timestampUtc: "2030-01-21T09:00:00.000Z", orb: 0.375, transitLongitude: 342.4, natalLongitude: 222.4, priority: 1, transitHouse: 7 }],
  highlights: [],
  reading: {
    title: "A measured month",
    timeframe: "January 2030",
    overview: "Move carefully.",
    majorThemes: ["One", "Two", "Three"],
    transitHighlights: [
      { title: "First", window: "Week one", guidance: "Observe." },
      { title: "Second", window: "Week two", guidance: "Name." },
      { title: "Third", window: "Week three", guidance: "Act." },
    ],
    lunarStages: [
      { phase: "newMoon", window: "Jan 4", cue: "Begin." },
      { phase: "firstQuarter", window: "Jan 11", cue: "Build." },
      { phase: "fullMoon", window: "Jan 18", cue: "See." },
      { phase: "lastQuarter", window: "Jan 26", cue: "Release." },
    ],
    practiceSuggestions: ["One", "Two", "Three"],
    cautions: ["One", "Two"],
    closingLine: "Close with care.",
    disclaimer: "For reflection.",
  },
};

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

  it("provides twelve readable zodiac labels outside the scaled SVG", () => {
    render(<CelestialOrientation />);

    const legend = screen.getByRole("list", { name: /zodiac stations/i });
    const labels = within(legend).getAllByRole("listitem");
    expect(labels).toHaveLength(12);
    for (const label of labels) expect(label.className).toContain("text-xs");
  });

  it("preserves complete computed event facts and prior month-ahead CTA telemetry", () => {
    render(
      <NatalReadingResult
        result={natalResult("First reading")}
        monthAheadResult={monthAheadResult}
        defaultOpenAdvanced
        sharePreviewEnabled={false}
      />,
    );

    expect(screen.getByText(/Full Moon .* orb 0\.125°/i)).toBeTruthy();
    expect(screen.getByText(/Venus .* Station retrograde .* House 4/i)).toBeTruthy();
    expect(screen.getByText(/Saturn trine Sun .* House 7 .* orb 0\.375°/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("link", { name: /receive astrology letters/i }));
    const analyticsWindow = window as Window & { __apAnalyticsQueue?: Array<Record<string, unknown>> };
    expect(analyticsWindow.__apAnalyticsQueue).toContainEqual({
      event: "astro_month_ahead_cta_click",
      target: "substack",
    });
  });

  it("does not emit month-ahead CTA telemetry before a month-ahead result exists", () => {
    const analyticsWindow = window as Window & { __apAnalyticsQueue?: Array<Record<string, unknown>> };
    analyticsWindow.__apAnalyticsQueue = [];
    render(<NatalReadingResult result={natalResult("First reading")} sharePreviewEnabled={false} />);

    fireEvent.click(screen.getByRole("link", { name: /receive astrology letters/i }));

    expect(analyticsWindow.__apAnalyticsQueue).not.toContainEqual(
      expect.objectContaining({ event: "astro_month_ahead_cta_click" }),
    );
  });

  it("resets copied status when a new reading replaces the previous one", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    const { rerender } = render(<NatalReadingResult result={natalResult("First reading")} sharePreviewEnabled={false} />);

    fireEvent.click(screen.getByRole("button", { name: /copy share text/i }));
    expect(await screen.findByText("Copied.")).toBeTruthy();

    rerender(<NatalReadingResult result={natalResult("Second reading")} sharePreviewEnabled={false} />);
    expect(screen.queryByText("Copied.")).toBeNull();
  });

  it("exposes pressed state for SharePanel style and background choices", () => {
    const chart: AstroChart = { meta: {}, points: { sun: 10, moon: 80 }, houses: null, aspects: [] };
    render(<SharePanel chart={chart} previewEnabled={false} />);

    const bigThree = screen.getByRole("button", { name: "Big Three" });
    const constellation = screen.getByRole("button", { name: "Constellation" });
    expect(bigThree.getAttribute("aria-pressed")).toBe("true");
    expect(constellation.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(constellation);
    expect(bigThree.getAttribute("aria-pressed")).toBe("false");
    expect(constellation.getAttribute("aria-pressed")).toBe("true");

    const dark = screen.getByRole("button", { name: "dark" });
    const light = screen.getByRole("button", { name: "light" });
    expect(dark.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(light);
    expect(dark.getAttribute("aria-pressed")).toBe("false");
    expect(light.getAttribute("aria-pressed")).toBe("true");
  });

  it("does not create unnamed article landmarks for the Big Three", () => {
    const { container } = render(<NatalReadingResult result={natalResult("First reading")} sharePreviewEnabled={false} />);
    expect(container.querySelectorAll('[data-result-section="big-three"] article')).toHaveLength(0);
  });
});
