import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ComponentProps, ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt, priority, fill, unoptimized, ...props }: ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
    fill?: boolean;
    unoptimized?: boolean;
  }) => {
    void priority;
    void fill;
    void unoptimized;
    return (
      // The route contract exercises the public image semantics.
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt ?? ""} {...props} />
    );
  },
}));

vi.mock("@/components/analytics/TrackedLink", () => ({
  TrackedLink: ({
    children,
    href,
    location,
    label,
    variant,
    ...props
  }: ComponentProps<"a"> & { location: string; label: string; variant: string }) => (
    <a
      href={href}
      data-location={location}
      data-label={label}
      data-variant={variant}
      {...props}
    >
      {children}
    </a>
  ),
}));

vi.mock("@/components/marketing/EmailCtaCard", () => ({
  EmailCtaCard: (props: Record<string, unknown>) => (
    <section
      aria-label="Email call to action"
      data-source={typeof props.source === "string" ? props.source : undefined}
      data-interests={Array.isArray(props.interests) ? props.interests.join(",") : undefined}
    >
      {String(props.title)}
    </section>
  ),
}));

vi.mock("@/components/seo/JsonLd", () => ({
  JsonLd: ({ id }: { id: string }) => <script id={id} type="application/ld+json" />,
}));

vi.mock("@/components/Ouroboros", () => ({
  Ouroboros: () => <div aria-label="Ouroboros emblem" />,
}));

vi.mock("@/components/AlchemyGlyph", () => ({
  AlchemyGlyph: ({ id }: { id: string }) => <span aria-hidden="true">{id}</span>,
}));

vi.mock("@/components/motion/EtchHeading", () => ({
  EtchHeading: ({ as: Heading = "h2", children, ...props }: {
    as?: "h2" | "h3";
    children: React.ReactNode;
  } & React.HTMLAttributes<HTMLHeadingElement>) => <Heading {...props}>{children}</Heading>,
}));

vi.mock("@/components/motion/EtchRule", () => ({
  EtchRule: ({ className }: { className?: string }) => <hr className={className} />,
}));

vi.mock("@/components/motion/Reveal", () => ({
  Reveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import GreatWorkPage from "@/app/great-work/page";
import LettersPage from "@/app/letters/page";
import PrincipleDetailPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/principles/[slug]/page";
import PrinciplesIndexPage from "@/app/principles/page";
import StartHerePage from "@/app/start-here/page";
import StudyPage from "@/app/study/page";
import { greatWork } from "@/data/greatWork";
import { principles } from "@/data/principles";

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

const routeSources = [
  "src/app/study/page.tsx",
  "src/app/start-here/page.tsx",
  "src/app/letters/page.tsx",
  "src/app/great-work/page.tsx",
  "src/app/principles/page.tsx",
  "src/app/principles/[slug]/page.tsx",
] as const;

describe("illuminated archive editorial routes", () => {
  it.each([
    ["The Path", <StudyPage key="study" />],
    ["Start Here", <StartHerePage key="start-here" />],
    ["Weekly Letters", <LettersPage key="letters" />],
    [greatWork.hero.title, <GreatWorkPage key="great-work" />],
    ["The Seven Principles", <PrinciplesIndexPage key="principles" />],
  ])("renders one route heading for %s", (name, page) => {
    render(page);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name })).toBeTruthy();
  });

  it("turns Study into open indexes, a correspondence map, and an ordered vertical path", () => {
    const { container } = render(<StudyPage />);

    expect(container.querySelector('[data-editorial-index="audiences"]')).toBeTruthy();
    expect(within(screen.getByRole("list", { name: "Three ways to walk the library" })).getAllByRole("listitem"))
      .toHaveLength(3);
    expect(container.querySelector(".editorial-spread--map")).toBeTruthy();
    expect(within(screen.getByRole("list", { name: "Discipline correspondence map" })).getAllByRole("listitem"))
      .toHaveLength(5);
    expect(within(screen.getByRole("list", { name: "Suggested study sequence" })).getAllByRole("listitem"))
      .toHaveLength(5);

    const firstAudienceLink = screen.getByRole("link", { name: "Begin with Start Here" });
    expect(firstAudienceLink.getAttribute("href")).toBe("/start-here");
    expect(firstAudienceLink.getAttribute("data-location")).toBe("study:audience-path");
    expect(firstAudienceLink.getAttribute("data-label")).toBe("Begin with Start Here");
    expect(firstAudienceLink.getAttribute("data-variant")).toBe("Seeker");
  });

  it("gives Start Here one sourced threshold plate and keeps its ordered week and route lists", () => {
    const { container } = render(<StartHerePage />);

    expect(container.querySelectorAll("figure.archival-figure")).toHaveLength(1);
    expect(screen.getByRole("img", { name: /alchemical manuscript page/i })).toBeTruthy();
    expect(screen.getAllByText(/wellcome collection/i)).toHaveLength(2);
    expect(within(screen.getByRole("list", { name: "Your first week" })).getAllByRole("listitem"))
      .toHaveLength(5);
    expect(within(screen.getByRole("list", { name: "Four ways into the work" })).getAllByRole("listitem"))
      .toHaveLength(4);
    expect(within(screen.getByRole("list", { name: "Recommended reading order" })).getAllByRole("listitem"))
      .toHaveLength(5);

    const trackLink = screen.getByRole("link", { name: "Start with the Principles" });
    expect(trackLink.getAttribute("data-location")).toBe("start-here:track");
    expect(trackLink.getAttribute("data-variant")).toBe("Hermetic Foundations");
    expect(screen.getByRole("region", { name: "Email call to action" })).toBeTruthy();
  });

  it("renders Letters as a publication index with etched coverage and preserves its conversion contracts", () => {
    const { container } = render(<LettersPage />);

    expect(container.querySelector('[data-editorial-index="letters"]')).toBeTruthy();
    expect(within(screen.getByRole("list", { name: "What the letters cover" })).getAllByRole("listitem"))
      .toHaveLength(4);
    expect(within(screen.getByRole("list", { name: "Coming letters" })).getAllByRole("listitem"))
      .toHaveLength(3);
    expect(screen.getAllByRole("link", { name: "Open Substack Archive" })).toHaveLength(2);
    for (const archiveLink of screen.getAllByRole("link", { name: "Open Substack Archive" })) {
      expect(archiveLink.getAttribute("data-location")).toMatch(/^letters:/);
      expect(archiveLink.getAttribute("data-label")).toBe("Open Substack Archive");
      expect(archiveLink.getAttribute("data-variant")).toBe("archive");
    }
    const cta = screen.getByRole("region", { name: "Email call to action" });
    expect(cta.getAttribute("data-source")).toBe("letters-page");
    expect(cta.getAttribute("data-interests")).toBe("beginner-hermetic");
    expect(document.querySelector("#letters-webpage-schema")).toBeTruthy();
    expect(document.querySelector("#letters-collection-schema")).toBeTruthy();
  });

  it("connects the Great Work stages in a semantic timeline and keeps the open glyph/source indexes", () => {
    render(<GreatWorkPage />);

    const timeline = screen.getByRole("list", { name: "The work in four colors" });
    const stages = within(timeline).getAllByRole("listitem");
    expect(stages).toHaveLength(greatWork.stages.length);
    expect(stages.map((stage) => stage.id)).toEqual(greatWork.stages.map((stage) => stage.id));
    expect(within(screen.getByRole("list", { name: "Alchemical glyph index" })).getAllByRole("listitem"))
      .toHaveLength(greatWork.glyphs.length);
    expect(screen.getAllByRole("button", { name: /^Open .* glyph$/ })).toHaveLength(greatWork.glyphs.length);
    expect(within(screen.getByRole("list", { name: "Sources" })).getAllByRole("listitem"))
      .toHaveLength(greatWork.sources.length);
    const cta = screen.getByRole("region", { name: "Email call to action" });
    expect(cta.getAttribute("data-source")).toBe("great-work-page");
    expect(cta.getAttribute("data-interests")).toBe("beginner-hermetic");
  });

  it("opens a labelled Great Work glyph dialog, traps focus, and restores the exact trigger", async () => {
    const user = userEvent.setup();
    render(<GreatWorkPage />);

    const trigger = screen.getByRole("button", { name: "Open Ouroboros glyph" });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Ouroboros" });
    const close = within(dialog).getByRole("button", { name: "Close" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(document.activeElement).toBe(close);
    expect(document.body.style.overflow).toBe("hidden");

    await user.tab();
    expect(document.activeElement).toBe(close);
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(close);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Ouroboros" })).toBeNull();
    expect(document.activeElement).toBe(trigger);

    await user.click(trigger);
    const reopenedDialog = screen.getByRole("dialog", { name: "Ouroboros" });
    await user.click(within(reopenedDialog).getByText(greatWork.glyphs[0].description));
    expect(screen.getByRole("dialog", { name: "Ouroboros" })).toBeTruthy();
    await user.click(reopenedDialog.parentElement!);
    expect(screen.queryByRole("dialog", { name: "Ouroboros" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("renders Principles as a numbered manuscript index and continuous ruled commentary", () => {
    const { container } = render(<PrinciplesIndexPage />);

    expect(within(screen.getByRole("list", { name: "Principles manuscript index" })).getAllByRole("listitem"))
      .toHaveLength(principles.length);
    expect(container.querySelectorAll("article[data-principle-commentary]")).toHaveLength(principles.length);
    expect(container.querySelectorAll("article[data-principle-commentary] h2")).toHaveLength(principles.length);
    for (const principle of principles) {
      expect(container.querySelector(`article#${principle.slug}`)).toBeTruthy();
      expect(screen.getByRole("link", { name: new RegExp(`Standalone page for ${principle.title}`, "i") }).getAttribute("href"))
        .toBe(`/principles/${principle.slug}`);
    }
    const cta = screen.getByRole("region", { name: "Email call to action" });
    expect(cta.getAttribute("data-source")).toBe("principles-index");
    expect(cta.getAttribute("data-interests")).toBe("beginner-hermetic");
  });

  it("preserves principle static params, metadata, schemas, ruled keys/practice, and sequence navigation", async () => {
    expect(generateStaticParams()).toEqual(principles.map((principle) => ({ slug: principle.slug })));
    const missingMetadata = await generateMetadata({ params: Promise.resolve({ slug: "missing" }) });
    expect(missingMetadata.robots).toMatchObject({ index: false });

    const principle = principles[1];
    const page = await PrincipleDetailPage({ params: Promise.resolve({ slug: principle.slug }) });
    const { container } = render(page);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: principle.axiom })).toBeTruthy();
    expect(document.querySelector(`#principle-breadcrumb-${principle.slug}`)).toBeTruthy();
    expect(document.querySelector(`#principle-webpage-${principle.slug}`)).toBeTruthy();
    expect(within(screen.getByRole("list", { name: "Keys" })).getAllByRole("listitem"))
      .toHaveLength(principle.keys.length);
    expect(within(screen.getByRole("list", { name: "Practice" })).getAllByRole("listitem"))
      .toHaveLength(principle.practice.length);
    expect(container.querySelector('[data-ruled-navigation="principles"]')).toBeTruthy();
    expect(screen.getByRole("link", { name: new RegExp(`Previous: ${principles[0].title}`, "i") }).getAttribute("href"))
      .toBe(`/principles/${principles[0].slug}`);
    expect(screen.getByRole("link", { name: new RegExp(`Next: ${principles[2].title}`, "i") }).getAttribute("href"))
      .toBe(`/principles/${principles[2].slug}`);
  });

  it("removes rounded content containers and keeps upgraded controls readable and touch-safe", () => {
    for (const routeSource of routeSources) {
      const source = readSource(routeSource);
      expect(source, routeSource).not.toMatch(/rounded-\[(?:1|2)[^\]]*\]|rounded-(?:xl|2xl)/);
      expect(source, routeSource).not.toContain("text-[11px]");
      expect(source, routeSource).not.toContain("text-[0.62rem]");
      expect(source, routeSource).not.toContain("min-h-[40px]");
      expect(source, routeSource).not.toContain("transition-all");
    }
  });
});
