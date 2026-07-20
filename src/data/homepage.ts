import { principles } from "./principles";
import type { ArchivalFigureId } from "./archivalFigures";

/* ─── Types ─────────────────────────────────────────────────────────── */

export type SectionType =
  | "hero"
  | "paradox"
  | "alchemy"
  | "divination"
  | "astrology"
  | "geometry"
  | "principles"
  | "community";

export type HomepageSectionItem = {
  title: string;
  description: string;
};

export type HomepageLayout = "essay" | "plate" | "quote" | "map";

export type HomepageSection = {
  id: string;
  sectionType: SectionType;
  title: string;
  subtitle?: string;
  body: string[];
  quote?: string;
  quoteSource?: string;
  layout?: HomepageLayout;
  figureId?: ArchivalFigureId;
  cta?: { label: string; href: string };
  items?: HomepageSectionItem[];
};

export type SocialLink = {
  platform: string;
  href: string;
  label: string;
};

/* ─── Social Links ──────────────────────────────────────────────────── */

export const socialLinks: SocialLink[] = [
  {
    platform: "instagram",
    href: "https://instagram.com/awarenessparadox",
    label: "Instagram",
  },
  {
    platform: "youtube",
    href: "https://youtube.com/@awarenessparadox",
    label: "YouTube",
  },
  {
    platform: "tiktok",
    href: "https://tiktok.com/@awarenessparadox",
    label: "TikTok",
  },
  {
    platform: "x",
    href: "https://x.com/awarenessparadox",
    label: "X",
  },
];

/* ─── Section Slugs for ScrollOrchestrator (excludes hero) ──────── */

export const homepageSlugs = [
  "the-paradox",
  "the-great-work",
  "divination",
  "astrology",
  "sacred-geometry",
  "hermetic-principles",
  "join-the-journey",
];

/* ─── Section Content ───────────────────────────────────────────────── */

export const homepageSections: HomepageSection[] = [
  /* ── Hero (rendered separately, not scroll-tracked) ── */
  {
    id: "hero",
    sectionType: "hero",
    title: "Awareness Paradox",
    subtitle:
      "True without lying, certain and most true.",
    body: [
      "This is a living archive of the traditions that have guided human self-knowledge for millennia. Alchemy, tarot, astrology, sacred geometry, and the Hermetic principles all converge here, restored as practical instruments for your own transformation.",
    ],
    cta: undefined,
  },

  /* ── The Paradox ── */
  {
    id: "the-paradox",
    sectionType: "paradox",
    title: "The Paradox",
    subtitle: "You are already made of what you seek",
    layout: "quote",
    quote: "If thou learnest that thou art thyself of Life and Light, thou shalt return again to Life.",
    quoteSource: "Corpus Hermeticum",
    body: [
      "The paradox is older than language. The deeper you turn inward, the more you recognize your continuity with everything beyond you.",
      "Civilizations across every continent encoded this recognition into star maps, card systems, alchemical processes, and geometric forms. They raised temples and mystery schools around it. The knowledge was always in plain sight. People simply had to be ready to see it.",
      "That readiness looks different for everyone. Sometimes it arrives as a question you cannot stop asking. Sometimes as a stillness after something falls apart. The traditions gathered here were built by people who reached that threshold and left instructions for whoever came next.",
      "Awareness Paradox gathers these scattered instruments into a single place. Think of it as a workshop, a library, and a mirror. The tools are ancient. The invitation is yours.",
    ],
    cta: { label: "Start Here", href: "/start-here" },
  },

  /* ── Alchemy ── */
  {
    id: "the-great-work",
    sectionType: "alchemy",
    title: "The Great Work",
    subtitle: "Solve et Coagula",
    layout: "map",
    quote: "When your matter darkens, the work has already begun.",
    quoteSource: "Rosarium tradition",
    body: [
      "The alchemists mapped a process of inner transformation that every person, at some point, lives through. They called it the Magnum Opus. Every transformation has two movements: dissolving what was, and forming what will be. Solve et coagula. You cannot have one without the other.",
      "The Rosarium Philosophorum treats the blackening not as failure but as evidence that the work has begun.",
    ],
    cta: { label: "Explore The Great Work", href: "/great-work" },
    items: [
      {
        title: "Nigredo",
        description:
          "The blackening. What Thomas Browne called \"the uncomfortable night of nothing.\" The old structure dissolves. This is where the work begins.",
      },
      {
        title: "Albedo",
        description:
          "The whitening. An ablutio, a washing. Impurities separate, and something clean appears beneath the residue. The Moon governs this stage.",
      },
      {
        title: "Citrinitas",
        description:
          "The yellowing. Solar light dawns within. The alchemists saw the cauda pavonis here, the iridescent peacock\u2019s tail, a burst of color before unity.",
      },
      {
        title: "Rubedo",
        description:
          "The reddening. The coniunctio, the sacred marriage of opposites. The work ends in wholeness: not the removal of darkness, but its integration.",
      },
    ],
  },

  /* ── Divination ── */
  {
    id: "divination",
    sectionType: "divination",
    title: "Tools of the Oracle",
    subtitle: "A lottery of thoughts as exact as numbers",
    layout: "plate",
    figureId: "alchemical-manuscript",
    quote: "The reading does not predict. It illuminates.",
    body: [
      "Eliphas Levi described the tarot as \"a truly philosophical machine, which keeps the mind from wandering, while leaving its initiative and liberty.\" For over two centuries, the Western esoteric tradition has recognized the tarot, the I Ching, runes, and geomancy as instruments of self-inquiry.",
      "The Golden Dawn wove the seventy-eight cards into a web of correspondence connecting Kabbalah, astrology, alchemy, and sacred geometry. Each card became a node in a living map of experience.",
      "Pull a card. Sit with what surfaces. Let the symbolic pattern clarify the question you brought with you.",
    ],
    cta: { label: "Get a Tarot Reading", href: "/tarot" },
  },

  /* ── Astrology ── */
  {
    id: "astrology",
    sectionType: "astrology",
    title: "As Above, So Below",
    subtitle: "The cosmic sympathy",
    layout: "essay",
    figureId: "splendor-solis-sun",
    quote: "You are not merely beneath the heavens. You are from the same order they reveal.",
    quoteSource: "Hermetic frame",
    body: [
      "The Emerald Tablet declares a correspondence between what is above and what is below. The Arabic original says from, not like: earthly and celestial life emerge from the same source.",
      "In Hermetic cosmology, the soul descends through seven planetary spheres to arrive on earth, gathering qualities at each stage. Your natal chart is a record of that passage. Ptolemy, writing in the second century, treated astrology as natural philosophy: the study of how celestial patterns correspond to earthly life through the bonds of sympatheia.",
    ],
    cta: { label: "Begin with the Big Three", href: "/astrology" },
  },

  /* ── Sacred Geometry ── */
  {
    id: "sacred-geometry",
    sectionType: "geometry",
    title: "The Architecture of the Divine",
    subtitle: "God is always doing geometry",
    layout: "plate",
    figureId: "alchemical-allegory",
    quote: "Proportion is the visible trace of hidden order.",
    body: [
      "In the Timaeus, Plato assigned a geometric solid to each element: tetrahedron to fire, cube to earth, octahedron to air, icosahedron to water, and the dodecahedron to the cosmos itself. The Platonic tradition held that the deepest structure of reality is mathematical, and that to study proportion is to study the mind of the divine.",
      "Across temple plans, mandalas, Islamic star patterns, shells, branches, and river systems, proportion makes unity visible through multiplicity. Exploring these forms trains perception: the eye learns to recognize one order moving through many scales.",
    ],
    cta: { label: "Explore the Patterns", href: "/gallery" },
  },

  /* ── The Seven Hermetic Principles ── */
  {
    id: "hermetic-principles",
    sectionType: "principles",
    title: "The Seven Laws",
    subtitle: "The Magic Key before whose touch all the Doors of the Temple fly open",
    layout: "map",
    quote: "Every tool on this site is one principle wearing a different face.",
    body: [
      "The Kybalion codifies seven principles that describe how reality operates at every scale. The archive approaches them as related lenses for disciplined observation and practice.",
    ],
    cta: { label: "Study the Principles", href: "/principles" },
    items: principles.map((p) => ({
      title: p.title,
      description: p.short,
    })),
  },

  /* ── Community ── */
  {
    id: "join-the-journey",
    sectionType: "community",
    title: "Walk With Us",
    subtitle: "A growing archive",
    layout: "essay",
    quote: "Stay near the work as it ripens.",
    body: [
      "Awareness Paradox is a living project. New tools, new writings, and new explorations arrive as they ripen. If any of this resonates, stay close. The Corpus Hermeticum says that Mind \"is present with holy men and good, the pure and merciful,\" and that its presence becomes an aid. Perhaps the same is true of good company.",
    ],
    cta: { label: "Join the Weekly Letters", href: "/letters" },
  },
];

/* ─── Tracked sections (excludes hero) for use in page.tsx ──────── */

export const trackedSections = homepageSections.filter(
  (s) => s.sectionType !== "hero"
);
