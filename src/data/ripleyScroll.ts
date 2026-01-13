import type { GeometrySlug } from "@/data/geometryCatalog";

export type RipleyPanel = {
  id: string;
  title: string;
  subtitle?: string;
  body: string;
  marginalia: string[];
  principleSlug?: string;
  geometrySlug?: GeometrySlug;
  scenePreset: string;
  plateSlug: GeometrySlug;
};

export const ripleyScrollPanels: RipleyPanel[] = [
  {
    id: "prima-materia",
    title: "Prima Materia",
    subtitle: "The first matter",
    body:
      "The work begins with matter regarded as undifferentiated and unformed, the root substance from which all transformation proceeds. It is neither fixed nor finished, but a potential held in the dark, capable of receiving measure. In practice, it is approached by dissolution and attention, not by force. The language of the art calls it the common ground of the elements, a substance before distinction, prepared for the long labor of clarification and union. Every later color is latent here.",
    marginalia: ["Unshaped ground", "Potential before form", "First subject"],
    principleSlug: "mentalism",
    geometrySlug: "seed-of-life",
    scenePreset: "prima-materia",
    plateSlug: "seed-of-life",
  },
  {
    id: "solve",
    title: "Solve",
    subtitle: "Dissolution",
    body:
      "The substance is opened by dissolution. What is fixed loosens; what is bound separates. This is not destruction but a return to fluidity, a breaking of rigid form so that it may be purified and reconstituted. The process reveals impurities and hidden structure, making them visible to the worker. The art requires patience, a measured heat, and a steady hand, for the work must be dissolved without being lost.",
    marginalia: ["Release of form", "Gentle heat", "Hidden structure"],
    principleSlug: "vibration",
    geometrySlug: "vesica-piscis",
    scenePreset: "solve",
    plateSlug: "vesica-piscis",
  },
  {
    id: "separation",
    title: "Separation",
    subtitle: "Sorting the subtle",
    body:
      "Separation refines the dissolved matter. The subtle is drawn away from the gross, the useful from the dross. This stage is a sorting of qualities, a dividing of what is pure from what is inert. It is a disciplined process, guided by observation and the recognition of proportion. The aim is clarity: the substance is made ready by the removal of what would cloud it.",
    marginalia: ["Purify", "Select", "Order of parts"],
    principleSlug: "correspondence",
    geometrySlug: "flower-of-life",
    scenePreset: "separation",
    plateSlug: "flower-of-life",
  },
  {
    id: "nigredo",
    title: "Nigredo",
    subtitle: "Blackening",
    body:
      "Nigredo marks the descent into the dark phase of the work. Matter is reduced, disassembled, and brought to a state in which former appearances are erased. The blackening is a necessary obscurity, the clearing of surfaces so that the internal order may be revealed. The art proceeds by patience and time; nothing is rushed in this stage. It is the ground of renewal and the threshold of refinement.",
    marginalia: ["Putrefaction", "Obscurity", "Ground of renewal"],
    principleSlug: "rhythm",
    geometrySlug: "metatrons-cube",
    scenePreset: "nigredo",
    plateSlug: "metatrons-cube",
  },
  {
    id: "albedo",
    title: "Albedo",
    subtitle: "Whitening",
    body:
      "Albedo is the cleansing and whitening of the matter. The substance is washed and clarified; impurities are drawn away by repeated refinement. The work becomes lighter, steadier, and more coherent. It is a stage of preparation and quiet order, in which the material approaches a clearer state, ready for the illumination that follows. The aim is not brightness but lucidity.",
    marginalia: ["Washing", "Clarity", "Quiet order"],
    principleSlug: "correspondence",
    geometrySlug: "sphere-lattice",
    scenePreset: "albedo",
    plateSlug: "sphere-lattice",
  },
  {
    id: "coniunctio",
    title: "Conjunction",
    subtitle: "Union of opposites",
    body:
      "Conjunction joins what has been separated. The volatile and the fixed are brought into measured relation; opposing qualities are reconciled within a single substance. This union is the central labor of the work, a balanced joining that generates a new coherence. It is not a simple mixture but a structured union, made stable through proportion and time. The art seeks a harmony that can endure.",
    marginalia: ["Union", "Balance", "Measured joining"],
    principleSlug: "polarity",
    geometrySlug: "torus",
    scenePreset: "conjunction",
    plateSlug: "torus",
  },
  {
    id: "fermentation",
    title: "Fermentation",
    subtitle: "Life enters matter",
    body:
      "Fermentation introduces a new potency. The substance gains vitality through a subtle agent, as if a living spark were seeded within it. This stage is described in terms of awakening and growth, yet its character remains disciplined and exact. It signals the transition from purification toward active generation, preparing the material for its final refinement. The work becomes animate without becoming volatile.",
    marginalia: ["Awakening", "Seeded life", "Subtle agent"],
    principleSlug: "gender",
    geometrySlug: "flower-of-life",
    scenePreset: "fermentation",
    plateSlug: "flower-of-life",
  },
  {
    id: "distillation",
    title: "Distillation",
    subtitle: "Ascent and return",
    body:
      "Distillation refines through ascent and return. The volatile is raised by heat, purified in passage, and condensed again into a clearer form. Repetition strengthens the substance, each cycle removing further impurity. This stage is an exacting work of patience and discipline, a gradual ascent toward clarity. The art emphasizes continuity rather than force, allowing the purified essence to be collected.",
    marginalia: ["Rise and condense", "Repeated cycles", "Refined essence"],
    principleSlug: "vibration",
    geometrySlug: "golden-spiral",
    scenePreset: "distillation",
    plateSlug: "golden-spiral",
  },
  {
    id: "citrinitas",
    title: "Citrinitas",
    subtitle: "Yellowing",
    body:
      "Citrinitas is the dawning of a new clarity. The matter takes on a solar tone, indicating maturation and readiness. It is a stage of illumination in which the substance stabilizes and approaches its final state. The color is a sign of balance, not excess; it signifies that the work is coherent and capable of completion. The art keeps the heat steady and measured.",
    marginalia: ["Illumination", "Solar clarity", "Maturity"],
    principleSlug: "mentalism",
    geometrySlug: "fibonacci-rectangles",
    scenePreset: "citrinitas",
    plateSlug: "fibonacci-rectangles",
  },
  {
    id: "coagulation",
    title: "Coagulation",
    subtitle: "Fixing the work",
    body:
      "Coagulation is the fixing of the refined substance. What was volatile becomes stable, and the work gains permanence. This is not a hardening into rigidity, but a settled integrity that holds the union. In this stage, the substance is brought to a coherent form, capable of enduring the final completion. The art seeks solidity without loss of vitality.",
    marginalia: ["Fixation", "Stability", "Coherence"],
    principleSlug: "cause-effect",
    geometrySlug: "metatrons-cube",
    scenePreset: "coagula",
    plateSlug: "metatrons-cube",
  },
  {
    id: "rubedo",
    title: "Rubedo",
    subtitle: "Reddening",
    body:
      "Rubedo is the culmination of the work. The substance reaches its perfected state and displays a stable, unified character. The red signifies completion, balance, and integration. What began in the dark is now clarified, joined, and fixed. The labor is not only the transformation of matter but the attainment of a coherent form, a substance capable of producing the desired effects.",
    marginalia: ["Completion", "Integration", "Perfection"],
    principleSlug: "rhythm",
    geometrySlug: "golden-spiral",
    scenePreset: "rubedo",
    plateSlug: "golden-spiral",
  },
  {
    id: "stone",
    title: "The Stone",
    subtitle: "Magnum Opus",
    body:
      "The Great Work is spoken of as the preparation of a stone, not a literal rock but a perfected substance. It stands as the aim of the art: a material capable of transmutation and of yielding a life-preserving elixir. Whether understood as a physical product or an emblem of completion, it represents the end of the sequence and the beginning of use. The work is finished when the substance is stable, luminous, and effective.",
    marginalia: ["Completion", "Elixir", "Use of the work"],
    principleSlug: "mentalism",
    geometrySlug: "torus",
    scenePreset: "rubedo",
    plateSlug: "torus",
  },
] as const;
