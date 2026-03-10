# Hermetic Principles Ebook Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a print-optimized page at `/ebook/hermetic-principles` that renders the 12-page "7 Hermetic Principles Starter Guide" using the site's existing design system, exportable as PDF.

**Architecture:** Server component page that renders 12 fixed-dimension sections (US Letter 8.5x11in). Each section is a self-contained page with print CSS controlling page breaks. The root layout's NavBar/Footer/CodexChrome are hidden via print CSS and an ebook-specific layout. Images are served from `/public/ebook/hermetic-principles/`.

**Tech Stack:** Next.js 16 (app router), React 19, Tailwind v4, CSS custom properties (obsidian/bone/gilt tokens), CSS `@media print` / `@page` rules.

---

## Task 1: Copy images to public directory

**Files:**
- Create: `public/ebook/hermetic-principles/` (directory with 11 images)

**Step 1: Create directory and copy images**

Run:
```bash
mkdir -p "/Users/jnsilva/Codex Projects/SacredGeometry/public/ebook/hermetic-principles"
cp "/Users/jnsilva/Codex Projects/SacredGeometry/docs/content/assets/hermetic-principles-starter-guide/raw/"*.jpg "/Users/jnsilva/Codex Projects/SacredGeometry/public/ebook/hermetic-principles/"
```

**Step 2: Verify files copied**

Run:
```bash
ls -la "/Users/jnsilva/Codex Projects/SacredGeometry/public/ebook/hermetic-principles/"
```

Expected: 11 jpg files (img-01 through img-08, alt-01 through alt-03)

**Step 3: Commit**

```bash
git add public/ebook/hermetic-principles/
git commit -m "asset: copy ebook images to public directory"
```

---

## Task 2: Create ebook print stylesheet

**Files:**
- Create: `src/app/ebook/ebook-print.css`

**Step 1: Write the print stylesheet**

This file controls page dimensions, breaks, and hides site chrome in print mode. Must use `print-color-adjust: exact` to preserve dark backgrounds in PDF.

```css
/* Ebook print styles */

.ebook-container {
  max-width: 8.5in;
  margin: 0 auto;
}

.ebook-page {
  width: 8.5in;
  min-height: 11in;
  padding: 0.75in 0.85in;
  position: relative;
  overflow: hidden;
  background-color: var(--bg);
  color: var(--fg);
  box-sizing: border-box;
}

.ebook-page + .ebook-page {
  border-top: 1px solid var(--copper);
}

/* Print rules */
@media print {
  @page {
    size: letter portrait;
    margin: 0;
  }

  html, body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  /* Hide site chrome */
  nav, footer, [data-codex-chrome] {
    display: none !important;
  }

  /* Remove the pt-20 spacing from root layout */
  body > div.relative.z-10.pt-20 {
    padding-top: 0 !important;
  }

  .ebook-container {
    max-width: none;
  }

  .ebook-page {
    page-break-after: always;
    page-break-inside: avoid;
    border: none !important;
    height: 11in;
    min-height: 11in;
    max-height: 11in;
  }

  .ebook-page:last-child {
    page-break-after: auto;
  }

  /* Remove screen-only UI */
  .ebook-screen-only {
    display: none !important;
  }
}

/* Screen-only: add visual separation between pages */
@media screen {
  .ebook-page {
    margin-bottom: 2rem;
    border-radius: 4px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
  }
}
```

**Step 2: Commit**

```bash
git add src/app/ebook/ebook-print.css
git commit -m "style: add ebook print stylesheet"
```

---

## Task 3: Create ebook layout

**Files:**
- Create: `src/app/ebook/layout.tsx`

**Step 1: Write the layout**

This layout imports the print stylesheet and provides clean metadata. The root layout's NavBar/Footer are hidden by the print CSS, not removed (they'll show on screen for navigation but vanish in PDF).

```tsx
import type { Metadata } from "next";
import "./ebook-print.css";

export const metadata: Metadata = {
  title: "7 Hermetic Principles Starter Guide — Awareness Paradox",
  description:
    "A clear beginner path into Hermetic thought, self-observation, and contemplative practice.",
  robots: { index: false, follow: false },
};

export default function EbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

**Step 2: Commit**

```bash
git add src/app/ebook/layout.tsx
git commit -m "feat: add ebook route layout with print styles"
```

---

## Task 4: Create ebook content data file

**Files:**
- Create: `src/data/ebookHermeticPrinciples.ts`

**Step 1: Write the data file**

Extract all ebook copy into a typed data structure so the page component stays clean. Content comes from `docs/content/2026-02-26-hermetic-principles-starter-guide-v1.md`.

```typescript
export interface EbookPrinciple {
  number: string;
  numeral: string;
  title: string;
  corePhrase: string;
  meaning: string[];
  reflection: string;
  practice: string[];
  image?: {
    src: string;
    alt: string;
    caption: string;
    placement: "top-right" | "bottom-right" | "left-strip" | "motif" | "background";
  };
}

export interface EbookData {
  title: string;
  subtitle: string;
  coverQuote: string;
  welcome: {
    intro: string[];
    howToUse: string[];
    noteOnApproach: string[];
  };
  orientation: {
    body: string[];
    practicalWay: string[];
  };
  principles: EbookPrinciple[];
  practicePath: {
    intro: string;
    days: { day: number; principle: string; instruction: string }[];
    dailyFormat: string[];
    closing: string;
  };
  closing: {
    body: string[];
    links: { label: string; url: string }[];
    quote: string;
  };
}

const IMG = "/ebook/hermetic-principles";

export const ebookData: EbookData = {
  title: "7 Hermetic Principles\nStarter Guide",
  subtitle:
    "A clear beginner path into Hermetic thought, self-observation, and contemplative practice.",
  coverQuote: "Take one idea. Work with it. Return.",

  welcome: {
    intro: [
      "There comes a point when spiritual language becomes decorative.",
      "The words may sound profound. The symbols may look powerful. But nothing changes in the way you see, choose, or live.",
      "This guide is for the moment after that.",
      "The Hermetic principles can be used as a framework for attention. They help you examine your inner life, your habits, your reactions, your relationships, and the patterns that shape your experience.",
      "This is not a complete historical study of Hermeticism. It is a starter guide: a practical orientation that helps you begin with clarity.",
    ],
    howToUse: [
      "Read slowly.",
      "Do not try to master all seven principles in one sitting.",
      "Choose one principle that feels active in your life right now. Work with it for a few days. Journal what you notice. Let the principle become an instrument of observation rather than a quote to remember.",
    ],
    noteOnApproach: [
      "In this guide, the principles are presented in plain language and practical terms. Where helpful, they are connected to reflection and contemplative practice.",
      "Use them as lenses, not slogans.",
    ],
  },

  orientation: {
    body: [
      "The word Hermetic refers to a body of philosophical and spiritual teachings associated with Hermes Trismegistus, a figure situated at the crossroads of Greek and Egyptian wisdom traditions.",
      "Over time, Hermetic thought influenced alchemy, astrology, ritual philosophy, esoteric Christianity, Renaissance magic, and many later spiritual systems.",
      "For beginners, the important thing is simple:",
      "Hermetic philosophy asks you to study the relationship between mind, nature, pattern, and transformation.",
      "It is concerned with how reality is perceived, how consciousness shapes experience, and how inner work changes the way life is lived.",
    ],
    practicalWay: [
      "The seven principles are often presented as universal laws.",
      "You do not need to begin by arguing with that language, nor by blindly accepting it.",
      "Begin by treating each principle as a disciplined question:",
    ],
  },

  principles: [
    {
      number: "1",
      numeral: "I",
      title: "Mentalism",
      corePhrase: "The All is Mind.",
      meaning: [
        "Mentalism points to the role of consciousness in experience.",
        "It does not mean that you can think anything you want and force reality to obey. It means your perception, interpretation, and attention shape the world you are able to inhabit.",
        "Two people can live through the same event and emerge with different meanings, different memories, and different futures.",
        "Mind is not a minor detail in life. It is one of the primary fields of work.",
      ],
      reflection:
        "Where is my attention going every day? What kind of world is that attention producing inside me?",
      practice: [
        "For one day, notice the first interpretation your mind gives to events.",
        "Do not correct it immediately. Just record it.",
        "At the end of the day, review your notes and ask:",
        "Which interpretations were facts, and which were habits?",
      ],
      image: {
        src: `${IMG}/img-03-m0007044-alchemical-allegory-wellcome.jpg`,
        alt: "Alchemical allegory with celestial symbols",
        caption: "Alchemical allegory (Wellcome Collection, Public Domain Mark)",
        placement: "top-right",
      },
    },
    {
      number: "2",
      numeral: "II",
      title: "Correspondence",
      corePhrase: "As above, so below; as below, so above.",
      meaning: [
        "Correspondence points to pattern across levels.",
        "The same structures often repeat in different forms: in thought, in behavior, in relationships, in groups, in seasons of life.",
        "This principle invites symbolic thinking without abandoning discernment.",
        "If a pattern appears in your outer life, it may reflect something unfinished in your inner life. If your inner life becomes clearer, your outer choices often change.",
        "Correspondence is not a shortcut to magical certainty. It is a way of reading resonance.",
      ],
      reflection:
        "What pattern keeps repeating in my life, even when the setting changes?",
      practice: [
        "Choose one repeating tension (avoidance, overwork, conflict, indecision).",
        "Map where it appears: thoughts, routines, relationships, work.",
        "Look for the shared structure, not just the different stories.",
      ],
      image: {
        src: `${IMG}/img-04-solomon-seal-franckenberg.jpg`,
        alt: "Solomon Seal geometric symbol",
        caption: "Solomon Seal (Franckenberg, public domain)",
        placement: "motif",
      },
    },
    {
      number: "3",
      numeral: "III",
      title: "Vibration",
      corePhrase: "Nothing rests; everything moves.",
      meaning: [
        "Vibration points to movement, tone, and state.",
        "Your inner life has texture. Some days it is contracted, agitated, and noisy. Some days it is clear, steady, and receptive.",
        "This principle becomes useful when it moves from abstraction into self-observation.",
        "Instead of asking, \u201cHow do I become high-vibration?\u201d ask: What is the quality of my attention right now? What increases clarity? What scatters it?",
      ],
      reflection:
        "What practices change the quality of my inner state in a real way?",
      practice: [
        "Make two short lists:",
        "What lowers my clarity \u2014 doom-scrolling, rushed mornings, constant input.",
        "What restores my clarity \u2014 silence, walking, journaling, breathwork.",
        "Build one small rhythm around the second list.",
      ],
      image: {
        src: `${IMG}/alt-02-ms879-highres-flask-plate-wellcome.jpg`,
        alt: "Alchemical flask apparatus",
        caption: "Alchemical apparatus (Wellcome Collection, Public Domain Mark)",
        placement: "left-strip",
      },
    },
    {
      number: "4",
      numeral: "IV",
      title: "Polarity",
      corePhrase:
        "Everything has poles; opposites are identical in nature, differing in degree.",
      meaning: [
        "Polarity helps you understand tension without getting trapped inside it.",
        "Many states that feel absolute are part of a spectrum: fear and courage, apathy and care, rigidity and discipline, fantasy and vision.",
        "This principle does not erase difference. It helps you work with degrees, movement, and transformation.",
        "In practice, polarity is a way to regain agency. If a state exists on a spectrum, it can be shifted.",
      ],
      reflection:
        "Where in my life am I treating a spectrum like a fixed identity?",
      practice: [
        "Choose one difficult state you know well.",
        "Name the opposite pole.",
        "Then ask: What is one step, not a complete transformation, that moves me one degree in that direction?",
      ],
      image: {
        src: `${IMG}/img-06-ms23-folio-9r-wellcome.jpg`,
        alt: "Alchemical manuscript plate",
        caption: "Alchemical manuscript plate (Wellcome Collection, Public Domain Mark)",
        placement: "bottom-right",
      },
    },
    {
      number: "5",
      numeral: "V",
      title: "Rhythm",
      corePhrase: "Everything flows, out and in; all things rise and fall.",
      meaning: [
        "Rhythm points to cycles.",
        "Energy moves. Mood moves. Motivation moves. Creative depth moves. So do confusion and clarity.",
        "This principle is powerful for beginners because it reduces self-judgment.",
        "Not every low season is failure. Not every high season is permanent.",
        "The work is to develop steadiness inside movement.",
      ],
      reflection:
        "What cycles do I keep misreading as personal failure?",
      practice: [
        "Track your energy, mood, or focus for seven days.",
        "Each evening, write one line:",
        "What was today\u2019s rhythm? What supported steadiness? What disrupted it?",
        "You are learning your tides.",
      ],
      image: {
        src: `${IMG}/img-07-bloodletting-zodiac-planets.jpg`,
        alt: "Zodiac and planets diagram",
        caption: "Zodiac and planets diagram (public domain, via PDIA / Wellcome)",
        placement: "top-right",
      },
    },
    {
      number: "6",
      numeral: "VI",
      title: "Cause and Effect",
      corePhrase:
        "Every cause has its effect; every effect has its cause.",
      meaning: [
        "Cause and Effect is a call to responsibility.",
        "It asks you to look beneath moods, outcomes, and repeated situations and study what produces them.",
        "In ordinary life, people often focus on effects: stress, conflict, exhaustion, confusion.",
        "Hermetic practice asks a harder question: What conditions am I repeating that make these outcomes likely?",
        "This is not blame. It is authorship.",
      ],
      reflection:
        "What recurring outcome in my life has an upstream pattern I have not named clearly?",
      practice: [
        "Choose one repeated outcome.",
        "Write a short chain: trigger \u2192 thought \u2192 reaction \u2192 action \u2192 result.",
        "Then adjust one link in the chain for one week and observe what changes.",
      ],
      image: {
        src: `${IMG}/img-02-ms879-apparatus-wellcome.jpg`,
        alt: "Alchemical apparatus drawing",
        caption: "Alchemical apparatus drawing (Wellcome Collection, Public Domain Mark)",
        placement: "bottom-right",
      },
    },
    {
      number: "7",
      numeral: "VII",
      title: "Gender",
      corePhrase:
        "Gender is in everything; everything has its masculine and feminine principles.",
      meaning: [
        "This principle can be approached as complementary modes of energy and function: structure and receptivity, direction and gestation, form and flow, will and intuition.",
        "The point is not to stereotype people.",
        "The point is to notice imbalance in your way of living and working.",
        "Some people live in constant force and lose depth. Some live in constant receptivity and never act.",
        "Transformation often requires both.",
      ],
      reflection:
        "Where do I need more structure? Where do I need more receptivity?",
      practice: [
        "For one important area of life, divide a page into two columns:",
        "Structure (form, boundaries, decision, schedule)",
        "Receptivity (listening, reflection, incubation, intuition)",
        "List what is missing on each side. Choose one change that restores balance.",
      ],
      image: {
        src: `${IMG}/img-06-ms23-folio-9r-wellcome.jpg`,
        alt: "Alchemical manuscript plate",
        caption: "Alchemical manuscript plate (Wellcome Collection, Public Domain Mark)",
        placement: "left-strip",
      },
    },
  ],

  practicePath: {
    intro:
      "The easiest way to lose this material is to admire it. The easiest way to keep it is to practice it.",
    days: [
      { day: 1, principle: "Mentalism", instruction: "Observe your interpretations. Notice where thought becomes reality too quickly." },
      { day: 2, principle: "Correspondence", instruction: "Track one repeating pattern across inner and outer life." },
      { day: 3, principle: "Vibration", instruction: "Notice what scatters your attention and what restores clarity." },
      { day: 4, principle: "Polarity", instruction: "Move one degree along a spectrum you thought was fixed." },
      { day: 5, principle: "Rhythm", instruction: "Study your energy without judgment." },
      { day: 6, principle: "Cause and Effect", instruction: "Identify one chain that produces a repeated outcome." },
      { day: 7, principle: "Gender", instruction: "Restore balance between structure and receptivity." },
    ],
    dailyFormat: [
      "2 minutes of stillness",
      "5 minutes of journaling",
      "3 minutes reviewing one action for the day",
    ],
    closing: "Return to the same cycle next week. Depth comes through repetition.",
  },

  closing: {
    body: [
      "The seven principles are not only ideas to learn.",
      "They are instruments for self-study.",
      "If you use them with patience, they begin to change the quality of your attention. From there, choices become clearer. Patterns become easier to see. Practice becomes more grounded.",
      "That is a worthy beginning.",
    ],
    links: [
      { label: "Start here", url: "awarenessparadox.com/start-here" },
      { label: "Principles", url: "awarenessparadox.com/principles" },
      { label: "Astrology", url: "awarenessparadox.com/astrology" },
      { label: "Letters", url: "awarenessparadox.com/letters" },
    ],
    quote: "Take one idea. Work with it. Return.",
  },
};
```

**Step 2: Commit**

```bash
git add src/data/ebookHermeticPrinciples.ts
git commit -m "data: add ebook hermetic principles content"
```

---

## Task 5: Build the ebook page component

**Files:**
- Create: `src/app/ebook/hermetic-principles/page.tsx`

**Step 1: Write the page component**

This is the main ebook page. It's a server component that renders all 12 pages as fixed-dimension sections. Each section uses the site's existing design tokens. Images use standard `<img>` tags (not Next.js Image) for print compatibility.

The component is structured as one file for V1. Each page section is a function that returns JSX. The page maps over the principles data for the 7 principle pages.

Key CSS patterns from the existing codebase:
- `text-[color:var(--bone)]` for primary text
- `text-[color:var(--mist)]` for secondary text
- `text-[color:var(--gilt)]` for accents
- `border-[color:var(--copper)]` for borders
- `bg-[color:var(--char)]` for panels
- `font-ritual` for serif display headings
- `text-xs uppercase tracking-[0.4em]` for labels

```tsx
import { ebookData } from "@/data/ebookHermeticPrinciples";
import type { EbookPrinciple } from "@/data/ebookHermeticPrinciples";

const IMG = "/ebook/hermetic-principles";

/* ─── shared page wrapper ─── */
function Page({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`ebook-page flex flex-col ${className}`}>
      {children}
    </section>
  );
}

/* ─── page footer ─── */
function PageFooter({ pageNum }: { pageNum: number }) {
  return (
    <footer className="mt-auto flex items-center justify-between pt-6 text-[8pt] text-[color:var(--mist)]">
      <span className="tracking-[0.3em] uppercase">Awareness Paradox</span>
      <span>{pageNum}</span>
    </footer>
  );
}

/* ─── Cover (p1) ─── */
function CoverPage() {
  return (
    <Page className="relative items-center justify-center text-center">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={`${IMG}/img-01-cover-the-alchemist-rijksmuseum.jpg`}
          alt=""
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--bg)] via-transparent to-[color:var(--bg)]" />
      </div>
      <div className="relative z-10 space-y-6 px-8">
        <p className="text-xs uppercase tracking-[0.5em] text-[color:var(--gilt)]">
          Awareness Paradox
        </p>
        <h1 className="font-ritual text-[42pt] leading-tight whitespace-pre-line">
          {ebookData.title}
        </h1>
        <p className="mx-auto max-w-md text-base text-[color:var(--mist)]">
          {ebookData.subtitle}
        </p>
        <div className="mx-auto mt-8 h-px w-24 bg-[color:var(--gilt)]" />
        <p className="mt-4 text-sm italic text-[color:var(--mist)]">
          &ldquo;{ebookData.coverQuote}&rdquo;
        </p>
      </div>
    </Page>
  );
}

/* ─── Welcome (p2) ─── */
function WelcomePage() {
  const { welcome } = ebookData;
  return (
    <Page>
      <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
        Welcome
      </p>
      <h2 className="font-ritual mt-2 text-[24pt]">How to Use This Guide</h2>
      <div className="mt-6 space-y-4 text-[11pt] leading-relaxed">
        {welcome.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-[13pt] font-semibold text-[color:var(--gilt)]">
          How to use this guide
        </h3>
        <div className="mt-3 space-y-3 text-[11pt] leading-relaxed">
          {welcome.howToUse.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
      <div className="mt-8 border-l-2 border-[color:var(--gilt)] pl-5">
        <p className="text-[10pt] uppercase tracking-[0.3em] text-[color:var(--mist)]">
          A note on approach
        </p>
        <div className="mt-2 space-y-3 text-[11pt] leading-relaxed text-[color:var(--mist)]">
          {welcome.noteOnApproach.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
      <PageFooter pageNum={2} />
    </Page>
  );
}

/* ─── Orientation (p3) ─── */
function OrientationPage() {
  const { orientation } = ebookData;
  return (
    <Page>
      <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
        Beginner Orientation
      </p>
      <h2 className="font-ritual mt-2 text-[24pt]">
        What &ldquo;Hermetic&rdquo; Means
      </h2>
      <div className="mt-6 space-y-4 text-[11pt] leading-relaxed">
        {orientation.body.map((p, i) => (
          <p key={i} className={i === 3 ? "font-semibold" : ""}>
            {p}
          </p>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-[13pt] font-semibold text-[color:var(--gilt)]">
          A practical way to think about the seven principles
        </h3>
        <div className="mt-3 space-y-3 text-[11pt] leading-relaxed">
          {orientation.practicalWay.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <ul className="mt-3 space-y-2 pl-5 text-[11pt] leading-relaxed text-[color:var(--mist)]">
          <li>What happens if I observe my life through this lens?</li>
          <li>What becomes visible that I was missing?</li>
          <li>What changes when I practice this principle consciously?</li>
        </ul>
        <p className="mt-4 text-[11pt] italic">That is enough to begin.</p>
      </div>
      <PageFooter pageNum={3} />
    </Page>
  );
}

/* ─── Principle page (p4–p10) ─── */
function PrinciplePage({
  principle,
  pageNum,
}: {
  principle: EbookPrinciple;
  pageNum: number;
}) {
  return (
    <Page>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10pt] uppercase tracking-[0.4em] text-[color:var(--mist)]">
            Principle {principle.numeral}
          </p>
          <h2 className="font-ritual mt-1 text-[26pt]">{principle.title}</h2>
        </div>
        {/* Motif-only images rendered small */}
        {principle.image?.placement === "motif" && (
          <img
            src={principle.image.src}
            alt={principle.image.alt}
            className="h-16 w-16 rounded object-cover opacity-40"
          />
        )}
      </div>

      {/* Core phrase callout */}
      <div className="mt-5 border-l-2 border-[color:var(--gilt)] bg-[color:var(--char)] px-5 py-3">
        <p className="font-ritual text-[14pt] italic text-[color:var(--gilt)]">
          {principle.corePhrase}
        </p>
      </div>

      {/* Body + optional side image */}
      <div className="mt-5 flex gap-6">
        <div className="flex-1 space-y-3 text-[10.5pt] leading-relaxed">
          {principle.meaning.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {principle.image &&
          (principle.image.placement === "top-right" ||
            principle.image.placement === "bottom-right") && (
            <div className="hidden w-[35%] flex-col items-end sm:flex">
              <img
                src={principle.image.src}
                alt={principle.image.alt}
                className="w-full rounded object-cover opacity-60"
                style={{ maxHeight: "3.5in" }}
              />
              <p className="mt-1 text-[7pt] text-[color:var(--mist)]">
                {principle.image.caption}
              </p>
            </div>
          )}
        {principle.image?.placement === "left-strip" && (
          <div className="hidden w-[30%] flex-col sm:flex">
            <img
              src={principle.image.src}
              alt={principle.image.alt}
              className="w-full rounded object-cover opacity-50"
              style={{ maxHeight: "4in" }}
            />
            <p className="mt-1 text-[7pt] text-[color:var(--mist)]">
              {principle.image.caption}
            </p>
          </div>
        )}
      </div>

      {/* Reflection */}
      <div className="mt-5 rounded border border-[color:var(--copper)]/40 px-5 py-3">
        <p className="text-[9pt] uppercase tracking-[0.3em] text-[color:var(--copper)]">
          Beginner Reflection
        </p>
        <p className="mt-2 text-[11pt] italic leading-relaxed">
          {principle.reflection}
        </p>
      </div>

      {/* Practice */}
      <div className="mt-4 rounded bg-[color:var(--char)] px-5 py-4">
        <p className="text-[9pt] uppercase tracking-[0.3em] text-[color:var(--gilt)]">
          Practice
        </p>
        <div className="mt-2 space-y-2 text-[10.5pt] leading-relaxed">
          {principle.practice.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <PageFooter pageNum={pageNum} />
    </Page>
  );
}

/* ─── 7-Day Practice Path (p11) ─── */
function PracticePathPage() {
  const { practicePath } = ebookData;
  return (
    <Page>
      <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
        Practice
      </p>
      <h2 className="font-ritual mt-2 text-[24pt]">A 7-Day Practice Path</h2>
      <p className="mt-4 text-[11pt] italic leading-relaxed text-[color:var(--mist)]">
        {practicePath.intro}
      </p>

      <div className="mt-6 divide-y divide-[color:var(--copper)]/20">
        {practicePath.days.map((day) => (
          <div key={day.day} className="flex gap-4 py-3">
            <div className="w-16 shrink-0">
              <p className="text-[10pt] font-semibold text-[color:var(--gilt)]">
                Day {day.day}
              </p>
              <p className="text-[8pt] uppercase tracking-widest text-[color:var(--mist)]">
                {day.principle}
              </p>
            </div>
            <p className="text-[10.5pt] leading-relaxed">{day.instruction}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded border border-[color:var(--copper)]/30 bg-[color:var(--char)] px-5 py-4">
        <p className="text-[9pt] uppercase tracking-[0.3em] text-[color:var(--gilt)]">
          Daily Format (10\u201315 minutes)
        </p>
        <ul className="mt-3 space-y-1 text-[10.5pt]">
          {practicePath.dailyFormat.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--gilt)]" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[10.5pt] italic text-[color:var(--mist)]">
          {practicePath.closing}
        </p>
      </div>

      <PageFooter pageNum={11} />
    </Page>
  );
}

/* ─── Closing (p12) ─── */
function ClosingPage() {
  const { closing } = ebookData;
  return (
    <Page className="relative">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={`${IMG}/img-08-zodiac-man-pdia.jpg`}
          alt=""
          className="h-full w-full object-cover opacity-10"
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
          Next Steps
        </p>
        <h2 className="font-ritual mt-2 text-[24pt]">Continue the Path</h2>

        <div className="mt-6 space-y-4 text-[11pt] leading-relaxed">
          {closing.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-8 rounded border border-[color:var(--gilt)]/30 bg-[color:var(--char)]/80 px-6 py-5">
          <p className="text-[10pt] uppercase tracking-[0.3em] text-[color:var(--gilt)]">
            Next steps inside Awareness Paradox
          </p>
          <div className="mt-4 space-y-2">
            {closing.links.map((link) => (
              <p key={link.url} className="text-[11pt]">
                <span className="text-[color:var(--mist)]">{link.label}:</span>{" "}
                <span className="text-[color:var(--gilt)]">{link.url}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="mx-auto h-px w-24 bg-[color:var(--gilt)]" />
          <p className="mt-4 font-ritual text-[14pt] italic text-[color:var(--gilt)]">
            &ldquo;{closing.quote}&rdquo;
          </p>
        </div>

        <PageFooter pageNum={12} />
      </div>
    </Page>
  );
}

/* ─── Main page ─── */
export default function HermeticPrinciplesEbook() {
  return (
    <div className="ebook-container">
      {/* Screen-only toolbar */}
      <div className="ebook-screen-only sticky top-20 z-50 mb-4 flex items-center justify-between rounded bg-[color:var(--char)] px-4 py-2">
        <p className="text-sm text-[color:var(--mist)]">
          7 Hermetic Principles Starter Guide
        </p>
        <button
          onClick={() => window.print()}
          className="rounded bg-[color:var(--gilt)] px-4 py-1.5 text-sm font-semibold text-[color:var(--bg)]"
        >
          Export PDF
        </button>
      </div>

      <CoverPage />
      <WelcomePage />
      <OrientationPage />
      {ebookData.principles.map((principle, i) => (
        <PrinciplePage
          key={principle.title}
          principle={principle}
          pageNum={i + 4}
        />
      ))}
      <PracticePathPage />
      <ClosingPage />
    </div>
  );
}
```

**Important note:** Because of the `window.print()` call in the toolbar button, this page needs `"use client"` at the top. Add it.

**Step 2: Verify the page renders**

Run:
```bash
cd "/Users/jnsilva/Codex Projects/SacredGeometry" && npm run dev
```

Then visit `http://localhost:3000/ebook/hermetic-principles` in the browser.

Expected: All 12 pages rendered vertically with dark backgrounds, bone text, gilt accents. Images should appear where specified.

**Step 3: Commit**

```bash
git add src/app/ebook/hermetic-principles/page.tsx
git commit -m "feat: add hermetic principles ebook page"
```

---

## Task 6: Test PDF export

**Step 1: Open the page in Chrome**

Visit `http://localhost:3000/ebook/hermetic-principles`

**Step 2: Click "Export PDF" button or use Cmd+P**

In the print dialog:
- Destination: "Save as PDF"
- Pages: All
- Background graphics: ON (critical for dark backgrounds)
- Margins: None

**Step 3: Verify PDF output**

Check:
- [ ] All 12 pages present
- [ ] Dark backgrounds render (obsidian, char panels)
- [ ] Bone text is legible
- [ ] Gilt accents visible
- [ ] Images appear on correct pages
- [ ] No NavBar/Footer in PDF
- [ ] Page breaks occur at correct positions
- [ ] Text doesn't overflow page boundaries

**Step 4: If page breaks or sizing need adjustment**

Tweak values in `ebook-print.css` (padding, heights, font sizes) and re-export until clean.

**Step 5: Commit any adjustments**

```bash
git add -u
git commit -m "fix: adjust ebook print styles for clean PDF export"
```

---

## Task 7: Visual polish pass

After the base rendering works, do a single polish pass:

**Step 1: Review each page for visual issues**

Common fixes:
- Text overflow on principle pages (reduce font size or meaning text)
- Image crops needing opacity/size adjustments
- Spacing between sections too tight or too loose
- Core phrase callout alignment
- Footer positioning

**Step 2: Apply fixes to page.tsx and ebook-print.css**

**Step 3: Final PDF export and review**

**Step 4: Commit**

```bash
git add -u
git commit -m "style: visual polish for ebook pages"
```

---

## Summary

| Task | Files | What |
|------|-------|------|
| 1 | `public/ebook/hermetic-principles/*.jpg` | Copy images |
| 2 | `src/app/ebook/ebook-print.css` | Print stylesheet |
| 3 | `src/app/ebook/layout.tsx` | Ebook route layout |
| 4 | `src/data/ebookHermeticPrinciples.ts` | Content data |
| 5 | `src/app/ebook/hermetic-principles/page.tsx` | Main page component |
| 6 | (manual) | Test PDF export |
| 7 | (polish) | Visual adjustments |
