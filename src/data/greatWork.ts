export type GreatWorkStage = {
  id: "nigredo" | "albedo" | "citrinitas" | "rubedo";
  title: string;
  description: string[];
  keynotes: string[];
  tone: string;
};

export type GreatWorkGlossaryItem = {
  term: string;
  definition: string;
};

export type GreatWorkGlyphId =
  | "ouroboros"
  | "athanor"
  | "retort"
  | "sun"
  | "moon"
  | "mercury"
  | "sulfur"
  | "salt";

export type GreatWorkGlyph = {
  id: GreatWorkGlyphId;
  title: string;
  description: string;
};

export type GreatWorkSource = {
  title: string;
  url: string;
};

export const greatWork = {
  hero: {
    title: "The Great Work",
    subtitle: "Magnum Opus — the central work of alchemy",
  },
  definition: [
    "Alchemy is a historical discipline that sought the transmutation of base metals, alongside aims in medicine, longevity, and the preparation of potent remedies.",
    "The Great Work, or Magnum Opus, is the ordered labor upon prima materia toward the philosopher’s stone, the substance believed to perfect metals and yield an elixir of life.",
  ],
  stages: [
    {
      id: "nigredo",
      title: "Nigredo",
      description: [
        "The blackening initiates the work. Matter is broken down, impurities are separated, and the fixed is brought to a state of dissolution.",
        "It is a disciplined descent into the raw, where form is loosened so that it can be re-formed.",
      ],
      keynotes: ["Blackening", "Putrefaction", "Dissolution", "Separation"],
      tone: "#1e1b22",
    },
    {
      id: "albedo",
      title: "Albedo",
      description: [
        "The whitening follows with cleansing and clarification. The mixture is purified, and the volatile is refined into a clearer substance.",
        "This stage steadies the work and prepares the material for a higher union.",
      ],
      keynotes: ["Purification", "Clarification", "Washing", "White"],
      tone: "#cfd3d6",
    },
    {
      id: "citrinitas",
      title: "Citrinitas",
      description: [
        "The yellowing signals dawning maturity. The work gains warmth and coherence as the substance moves toward a solar clarity.",
        "It is the stage of illumination, where the matter is made ready for completion.",
      ],
      keynotes: ["Yellowing", "Illumination", "Maturity", "Solar"],
      tone: "#b89b5e",
    },
    {
      id: "rubedo",
      title: "Rubedo",
      description: [
        "The reddening is the culmination. The work reaches its fixed, unified form and the elements are reconciled.",
        "It marks completion, when the substance is fully integrated and stabilized.",
      ],
      keynotes: ["Reddening", "Completion", "Integration", "Fixation"],
      tone: "#7c2a2a",
    },
  ] satisfies GreatWorkStage[],
  glossary: [
    {
      term: "Prima materia",
      definition:
        "The undifferentiated first matter of alchemy, treated as the starting substance from which all transformation proceeds.",
    },
    {
      term: "Philosopher’s stone",
      definition:
        "The legendary substance sought by alchemists, believed to transmute base metals into precious ones and to yield an elixir of life.",
    },
    {
      term: "Solve et coagula",
      definition:
        "“Dissolve and coagulate” — the alternating operations of breaking down and re-forming matter in a disciplined cycle.",
    },
    {
      term: "Coniunctio",
      definition:
        "The union of opposites in alchemical work, a joining of complementary principles into a single, balanced substance.",
    },
    {
      term: "Elixir / panacea",
      definition:
        "A preparation associated with the Great Work, imagined as a universal remedy and an extension of life.",
    },
  ] satisfies GreatWorkGlossaryItem[],
  glyphs: [
    {
      id: "ouroboros",
      title: "Ouroboros",
      description:
        "The self-devouring serpent signifies cyclical renewal and the unity of beginning and end.",
    },
    {
      id: "athanor",
      title: "Athanor",
      description:
        "The alchemical furnace built for steady, long heat, sustaining the work through slow transformation.",
    },
    {
      id: "retort",
      title: "Retort",
      description:
        "A distillation vessel where volatile substances are purified and collected through heat.",
    },
    {
      id: "sun",
      title: "Sun / Gold",
      description:
        "The solar principle aligned with gold, radiance, and perfected matter.",
    },
    {
      id: "moon",
      title: "Moon / Silver",
      description:
        "The lunar principle aligned with silver, reflection, and receptive clarity.",
    },
    {
      id: "mercury",
      title: "Mercury",
      description:
        "A principle of volatility and mediation, often treated as the fluid link between opposites.",
    },
    {
      id: "sulfur",
      title: "Sulfur",
      description:
        "A principle of activity and combustion, associated with heat and the animating spark.",
    },
    {
      id: "salt",
      title: "Salt",
      description:
        "A principle of fixity and structure, holding form after volatilization.",
    },
  ] satisfies GreatWorkGlyph[],
  sources: [
    {
      title: "Encyclopaedia Britannica — Alchemy",
      url: "https://www.britannica.com/topic/alchemy",
    },
    {
      title: "Encyclopaedia Britannica — Philosopher’s Stone",
      url: "https://www.britannica.com/topic/philosophers-stone",
    },
    {
      title: "Encyclopaedia Britannica — Ouroboros",
      url: "https://www.britannica.com/topic/ouroboros",
    },
    {
      title: "Encyclopaedia Britannica — Retort",
      url: "https://www.britannica.com/technology/retort",
    },
    {
      title: "Merriam-Webster — Athanor",
      url: "https://www.merriam-webster.com/dictionary/athanor",
    },
    {
      title: "Encyclopaedia Britannica — Mercury (element)",
      url: "https://www.britannica.com/science/mercury-chemical-element",
    },
    {
      title: "Encyclopaedia Britannica — Sulfur",
      url: "https://www.britannica.com/science/sulfur",
    },
  ] satisfies GreatWorkSource[],
} as const;
