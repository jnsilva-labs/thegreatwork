import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ComponentProps, ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt, priority, fill, unoptimized, ...props }: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean; fill?: boolean; unoptimized?: boolean }) => {
    void priority;
    void fill;
    void unoptimized;
    return (
      // The production component is covered through its public image semantics.
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt ?? ""} {...props} />
    );
  },
}));

vi.mock("@/components/analytics/TrackedLink", () => ({
  TrackedLink: ({ children, href, className }: ComponentProps<"a">) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import {
  ArchivalFigure,
  EditorialSpread,
  EtchedList,
  RitualLink,
  TrustNote,
} from "@/components/editorial";
import { VisualQaFixtures } from "@/components/dev/VisualQaFixtures";
import VisualQaPage, { metadata } from "@/app/dev/visual-qa/page";

describe("illuminated archive editorial primitives", () => {
  it("renders an archival figure with descriptive alt text and visible provenance", () => {
    render(<ArchivalFigure figureId="splendor-solis-sun" />);

    expect(
      screen.getByRole("img", {
        name: /sun with human face rising over a city/i,
      }),
    ).toBeTruthy();
    expect(screen.getByRole("img").getAttribute("sizes")).toBe("(max-width: 767px) 100vw, 50vw");
    expect(screen.getByText(/splendor solis, bl harley ms 3469/i)).toBeTruthy();
    expect(screen.getByRole("link", { name: /british library source/i }).getAttribute("href")).toMatch(
      /^https:/,
    );
  });

  it("keeps the spread heading before subordinate content for visual variants", () => {
    const { container, rerender } = render(
      <EditorialSpread variant="image-left" title="The living archive">
        <h3>Subordinate theorem</h3>
      </EditorialSpread>,
    );

    const heading = screen.getByRole("heading", { level: 2, name: "The living archive" });
    const subordinate = screen.getByRole("heading", { level: 3, name: "Subordinate theorem" });
    expect(heading.compareDocumentPosition(subordinate) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.firstElementChild?.className).toContain("editorial-spread--image-left");

    for (const variant of ["image-right", "quote", "map"] as const) {
      rerender(
        <EditorialSpread variant={variant} title="The living archive">
          <h3>Subordinate theorem</h3>
        </EditorialSpread>,
      );
      expect(container.firstElementChild?.className).toContain(`editorial-spread--${variant}`);
    }
  });

  it("renders etched sequences as semantic ordered or unordered lists", () => {
    const items = [
      { id: "observe", title: "Observe", body: "Attend to the pattern." },
      { id: "record", title: "Record", body: "Name what changed." },
    ];
    const { rerender } = render(<EtchedList items={items} ordered marker="numeral" headingLevel="h4" />);

    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 4, name: "Observe" })).toBeTruthy();
    const observeItem = screen.getByRole("heading", { name: "Observe" }).closest("li");

    rerender(<EtchedList items={[items[1], items[0]]} ordered marker="numeral" headingLevel="h4" />);
    expect(screen.getByRole("heading", { name: "Observe" }).closest("li")).toBe(observeItem);

    rerender(<EtchedList items={items} marker="glyph" headingLevel="h4" />);
    expect(screen.getByRole("list").tagName).toBe("UL");

    const source = readFileSync(resolve(process.cwd(), "src/components/editorial/EtchedList.tsx"), "utf8");
    expect(source).toMatch(/id:\s*string;/);
    expect(source).toContain("key={item.id}");
    expect(source).not.toContain("item.id ??");
  });

  it("gives trust notes an accessible heading and neutral DOM eyebrow", () => {
    const { rerender } = render(
      <TrustNote heading="How this interpretation is made">
        Symbolic language is generated from the facts shown above.
      </TrustNote>,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "How this interpretation is made" }),
    ).toBeTruthy();
    expect(screen.getByText("Method note")).toBeTruthy();

    rerender(
      <TrustNote heading="Source boundaries" eyebrow="Source note" headingLevel="h4">
        This note names the evidence available to the reader.
      </TrustNote>,
    );
    expect(screen.getByRole("heading", { level: 4, name: "Source boundaries" })).toBeTruthy();
    expect(screen.getByText("Source note")).toBeTruthy();
    expect(screen.queryByText("Method note")).toBeNull();
  });

  it("keeps ritual links rectangular and at least 44px tall", () => {
    render(
      <RitualLink href="/method" location="visual-qa" label="Read the method">
        Read the method
      </RitualLink>,
    );

    const link = screen.getByRole("link", { name: "Read the method" });
    expect(link.className).toContain("min-h-[44px]");
    expect(link.className).not.toContain("rounded-full");
  });

  it("exposes deterministic named fixture sections on a non-indexed QA page", () => {
    const { container, rerender } = render(<VisualQaFixtures />);
    const sectionNames = Array.from(container.querySelectorAll("[data-qa-section]")).map(
      (section) => section.getAttribute("data-qa-section"),
    );

    expect(sectionNames).toEqual([
      "editorial-spread",
      "archival-figure",
      "marginal-note",
      "etched-list",
      "ritual-link",
      "oracle-panel",
      "trust-note",
    ]);
    expect(
      Array.from(container.querySelectorAll("[data-qa-tarot-fixture]")).map((section) =>
        section.getAttribute("data-qa-tarot-fixture"),
      ),
    ).toEqual(["tarot-entry", "tarot-reading"]);
    expect(screen.getByRole("heading", { level: 2, name: "Tarot entry fixture" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "Reading chamber fixture" })).toBeTruthy();
    const tarotReadingFixture = container.querySelector('[data-qa-tarot-fixture="tarot-reading"]');
    expect(tarotReadingFixture?.querySelectorAll('img')).toHaveLength(3);
    for (const image of tarotReadingFixture?.querySelectorAll('img') ?? []) {
      expect(image.getAttribute('src')).toMatch(/^\/tarot\/rider-waite\//);
    }
    const fixtureSource = readFileSync(resolve(process.cwd(), "src/components/dev/VisualQaFixtures.tsx"), "utf8");
    expect(fixtureSource).not.toContain("generateInterpretation");
    expect(fixtureSource).not.toContain("/api/tarot");
    for (const variant of ["image-left", "image-right", "quote", "map"]) {
      expect(container.querySelectorAll(`.editorial-spread--${variant}`)).toHaveLength(1);
    }
    expect(screen.getByRole("heading", { level: 4, name: "Reading posture" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 4, name: "Observe" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Celestial inquiry" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 4, name: "How this instrument is made" })).toBeTruthy();

    rerender(<VisualQaPage />);
    expect(screen.getByRole("heading", { level: 1, name: /visual qa/i })).toBeTruthy();
    expect(screen.queryByRole("main")).toBeNull();
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("defines the complete restrained editorial CSS contract", () => {
    const globals = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

    for (const selector of [
      ".editorial-spread",
      ".archival-figure",
      ".plate-caption",
      ".marginalia",
      ".etched-list",
      ".etched-rule",
      ".ritual-link",
      ".oracle-room",
      ".trust-note",
      ".open-field",
    ]) {
      expect(globals).toContain(selector);
    }
    expect(globals).not.toMatch(/transition:\s*all\b/);
    expect(globals).not.toContain("Verified method");
    expect(globals).not.toContain(".trust-note::before");
  });
});
