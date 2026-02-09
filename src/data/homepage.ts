import { principles } from "./principles";

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

export type HomepageSection = {
  id: string;
  sectionType: SectionType;
  title: string;
  subtitle?: string;
  body: string[];
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
    body: [
      "The Corpus Hermeticum records a voice that says: \"If thou learnest that thou art thyself of Life and Light, thou shalt return again to Life.\" The paradox is older than language. The deeper you turn inward, the more you recognize your continuity with everything beyond you.",
      "Civilizations across every continent encoded this recognition into star maps, card systems, alchemical processes, and geometric forms. They raised temples and mystery schools around it. The knowledge was always in plain sight. People simply had to be ready to see it.",
      "That readiness looks different for everyone. Sometimes it arrives as a question you cannot stop asking. Sometimes as a stillness after something falls apart. The traditions gathered here were built by people who reached that threshold and left instructions for whoever came next.",
      "Awareness Paradox gathers these scattered instruments into a single place. Think of it as a workshop, a library, and a mirror. The tools are ancient. The invitation is yours.",
    ],
    cta: undefined,
  },

  /* ── Alchemy ── */
  {
    id: "the-great-work",
    sectionType: "alchemy",
    title: "The Great Work",
    subtitle: "Solve et Coagula",
    body: [
      "The alchemists mapped a process of inner transformation that every person, at some point, lives through. They called it the Magnum Opus. Every transformation has two movements: dissolving what was, and forming what will be. Solve et coagula. You cannot have one without the other.",
      "The Rosarium Philosophorum, a sixteenth-century alchemical text, counsels: \"When you see your matter going black, rejoice. You are at the beginning of the work.\"",
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
    body: [
      "Eliphas Levi described the tarot as \"a truly philosophical machine, which keeps the mind from wandering, while leaving its initiative and liberty.\" For over two centuries, the Western esoteric tradition has recognized the tarot, the I Ching, runes, and geomancy as instruments of self-inquiry.",
      "The Golden Dawn wove the seventy-eight cards into a web of correspondence connecting Kabbalah, astrology, alchemy, and sacred geometry. Each card became a node in a living map of experience.",
      "Pull a card. Sit with what surfaces. The reading does not predict. It illuminates.",
    ],
    cta: { label: "Pull a Card", href: "/tarot" },
  },

  /* ── Astrology ── */
  {
    id: "astrology",
    sectionType: "astrology",
    title: "As Above, So Below",
    subtitle: "The cosmic sympathy",
    body: [
      "The Emerald Tablet of Hermes opens with a declaration: \"That which is below is like that which is above, and that which is above is like that which is below, to do the miracles of one only thing.\" The Arabic original says from, not like. You are not a reflection of the cosmos. You are from the same source.",
      "In Hermetic cosmology, the soul descends through seven planetary spheres to arrive on earth, gathering qualities at each stage. Your natal chart is a record of that passage. Ptolemy, writing in the second century, treated astrology as natural philosophy: the study of how celestial patterns correspond to earthly life through the bonds of sympatheia.",
    ],
    cta: { label: "Read Your Stars", href: "/astrology" },
  },

  /* ── Sacred Geometry ── */
  {
    id: "sacred-geometry",
    sectionType: "geometry",
    title: "The Architecture of the Divine",
    subtitle: "God is always doing geometry",
    body: [
      "In the Timaeus, Plato assigned a geometric solid to each element: tetrahedron to fire, cube to earth, octahedron to air, icosahedron to water, and the dodecahedron to the cosmos itself. The Platonic tradition held that the deepest structure of reality is mathematical, and that to study proportion is to study the mind of the divine.",
      "The Golden Ratio, which Luca Pacioli called the Divine Proportion, extends forever beyond our ability to capture it and yet appears everywhere: in spiral shells, in branching trees, in the proportions of your own body. The Flower of Life surfaces across cultures and centuries, painted by unknown hands on the walls of Egyptian temples, drawn in the margins of medieval manuscripts. Its universality is geometry discovering itself.",
      "Long before modern science named pattern theory, builders and philosophers treated geometry as a sacred discipline. Egyptian temple plans used measured ratios to mirror cosmic order. Pythagorean schools taught number and form as a path to harmony of soul and city. In India and Tibet, mandalas were drawn as maps of consciousness, while Islamic architects used repeating star patterns to express unity unfolding into multiplicity.",
      "Fractal structure carries that same logic into the living world. Branches resemble trees, blood vessels echo river systems, and neural pathways mirror lightning channels. The nervous system tends to settle around this kind of ordered complexity, which can improve focus, reduce stress, and sharpen spatial awareness. That is why this section is interactive: when you explore and manipulate these forms here, you are training perception as much as appreciating beauty.",
    ],
    cta: { label: "Explore the Patterns", href: "/gallery" },
  },

  /* ── The Seven Hermetic Principles ── */
  {
    id: "hermetic-principles",
    sectionType: "principles",
    title: "The Seven Laws",
    subtitle: "The Magic Key before whose touch all the Doors of the Temple fly open",
    body: [
      "The Kybalion codifies seven principles that describe how reality operates at every scale. \"He who knows these, understandingly, possesses the Magic Key before whose touch all the Doors of the Temple fly open.\" Every tool on this site draws from these laws.",
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
    body: [
      "Awareness Paradox is a living project. New tools, new writings, and new explorations arrive as they ripen. If any of this resonates, stay close. The Corpus Hermeticum says that Mind \"is present with holy men and good, the pure and merciful,\" and that its presence becomes an aid. Perhaps the same is true of good company.",
    ],
    cta: undefined,
  },
];

/* ─── Tracked sections (excludes hero) for use in page.tsx ──────── */

export const trackedSections = homepageSections.filter(
  (s) => s.sectionType !== "hero"
);
