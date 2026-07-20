import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/HeroSigil", () => ({
  HeroSigil: () => <div data-testid="hero-sigil" />,
}));

vi.mock("@/components/ui/MagneticLink", () => ({
  MagneticLink: ({ children, href, className }: ComponentProps<"a">) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/hermeticStore", () => ({
  useHermeticStore: (selector: (state: { heroProgress: number; progressByChapter: number[] }) => unknown) =>
    selector({ heroProgress: 0, progressByChapter: [1, 1, 1, 1, 1, 1, 1] }),
}));

vi.mock("@/lib/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => true,
}));

vi.mock("@/lib/uiStore", () => ({
  useUiStore: (selector: (state: { stillness: boolean }) => unknown) =>
    selector({ stillness: true }),
}));

vi.mock("@/components/motion/useMotionPreference", () => ({
  useMotionPreference: () => ({ motionOk: false }),
}));

import { HomepageHero } from "@/components/ui/HomepageHero";
import { HomepageSection } from "@/components/ui/HomepageSection";
import { archivalFigures } from "@/data/archivalFigures";
import { trackedSections } from "@/data/homepage";

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

const pathDoors = [
  {
    title: "I'm New Here",
    body: "Begin with an orientation.",
    actions: [{ href: "/start-here", label: "Begin Your Initiation" }],
    symbol: "◇",
    accent: "teal" as const,
  },
  {
    title: "I Want a Reading",
    body: "Enter through direct experience.",
    actions: [
      { href: "/tarot", label: "Tarot · Draw a card" },
      { href: "/astrology#natal-widget", label: "Astrology · Create a chart" },
    ],
    symbol: "◎",
    accent: "gold" as const,
  },
  {
    title: "I Want Serious Study",
    body: "Follow a source-grounded map.",
    actions: [{ href: "/study", label: "Walk The Path" }],
    symbol: "⟐",
    accent: "bone" as const,
  },
];

describe("homepage illuminated archive structure", () => {
  it("uses one semantic hero heading while preserving two visual title lines", () => {
    const { container } = render(
      <HomepageHero
        title="Awareness Paradox"
        subtitle="True without lying"
        body="A living archive."
        pathDoors={pathDoors}
      />,
    );

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(container.querySelectorAll("h1 > span.hero-title-line")).toHaveLength(2);
  });

  it("preserves all three path doors and both live-reading routes", () => {
    render(
      <HomepageHero
        title="Awareness Paradox"
        subtitle="True without lying"
        body="A living archive."
        pathDoors={pathDoors}
      />,
    );

    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Tarot · Draw a card" }).getAttribute("href")).toBe("/tarot");
    expect(screen.getByRole("link", { name: "Astrology · Create a chart" }).getAttribute("href")).toBe(
      "/astrology#natal-widget",
    );
  });

  it("uses a small explicit set of varied chapter layouts and known archival figures", () => {
    const sections = trackedSections as Array<{
      layout?: string;
      figureId?: string;
    }>;
    const allowedLayouts = new Set(["essay", "plate", "quote", "map"]);
    const layouts = new Set(sections.map((section) => section.layout));

    expect([...layouts].every((layout) => layout !== undefined && allowedLayouts.has(layout))).toBe(true);
    expect(layouts.size).toBeGreaterThanOrEqual(3);
    expect(sections.filter((section) => section.figureId).length).toBeGreaterThanOrEqual(2);
    for (const section of sections) {
      if (section.figureId) expect(section.figureId in archivalFigures).toBe(true);
    }
  });

  it("renders pull quotes as chapter content with their source", () => {
    render(
      <HomepageSection
        id="the-paradox"
        index={0}
        sectionType="paradox"
        title="The Paradox"
        subtitle="You are already made of what you seek"
        body={["The paradox is older than language."]}
        quote="If thou learnest that thou art thyself of Life and Light."
        quoteSource="Corpus Hermeticum"
      />,
    );

    expect(screen.getByText("If thou learnest that thou art thyself of Life and Light.")).toBeTruthy();
    expect(screen.getByText("Corpus Hermeticum")).toBeTruthy();
  });

  it("keeps quoted prose out of body copy and removes the unexplained blank tail", () => {
    for (const section of trackedSections) {
      if (!section.quote) continue;
      const normalizedQuote = section.quote.replace(/[“”\".,]/g, "").toLowerCase();
      const normalizedBody = section.body.join(" ").replace(/[“”\".,]/g, "").toLowerCase();
      expect(normalizedBody).not.toContain(normalizedQuote);
    }

    const page = readSource("src/app/page.tsx");
    expect(page).not.toMatch(/h-\[50vh\]|h-\[70vh\]/);
  });

  it("lets the single reveal timeline own upgraded-section motion", () => {
    const section = readSource("src/components/ui/HomepageSection.tsx");

    expect(section).toContain("gsap.timeline");
    expect(section).not.toMatch(/className=\"[^\"]*\btransition\b/);
    expect(section).not.toContain("transition-all");
  });
});
