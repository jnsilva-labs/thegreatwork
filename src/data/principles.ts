export type Principle = {
  slug: string;
  title: string;
  axiom: string;
  short: string;
  body: string;
  keys: string[];
  practice: [string, string];
  visual: string;
};

export const principles: Principle[] = [
  {
    slug: "mentalism",
    title: "Mentalism",
    axiom: "The All is Mind; the Universe is Mental.",
    short: "Mind is the first cause; form is the visible consequence.",
    body:
      "All things are conceived within Mind, and every form arises as a thought brought to order. The worlds are not outside of Mind, but within it, sustained by its rhythm and law. In this principle is the reason for correspondence and the ground of transmutation; to alter the pattern of the mental is to alter the shape of the seen. The wise regard every appearance as a sign of interior causes, and therefore attend to the quality of attention, intention, and imagination. The Universe is a mental creation, not in fancy, but in lawful process. The art is not to deny the world, but to know its source and work with it. What is held clearly becomes stable; what is held dimly becomes unstable.",
    keys: [
      "Mind precedes form",
      "Attention is a tool",
      "Imagination shapes substance",
      "Clear intent stabilizes",
    ],
    practice: [
      "Observe the quality of your attention before beginning work.",
      "Hold a single image steadily for one minute.",
    ],
    visual: "Two circles breathe into a shared field.",
  },
  {
    slug: "correspondence",
    title: "Correspondence",
    axiom: "As above, so below; as below, so above.",
    short: "Patterns repeat across scales, and order is echoed in every plane.",
    body:
      "That which is above is mirrored in that which is below; that which is below is mirrored in that which is above. This is not a shallow likeness, but a lawful relation of structure and proportion. The same ratios, cycles, and harmonies appear wherever life and matter unfold, whether in a star, a seed, or a thought. To study the small is to gain a key to the great; to study the great is to read the intent of the small. The principle of correspondence is a bridge across levels, enabling the mind to infer by analogy and to perceive unity where the eye perceives division. In sacred geometry, the same measures return as living proof: the form knows itself at every scale.",
    keys: [
      "Scale is a mirror",
      "Ratios recur",
      "Analogy reveals law",
      "Unity across levels",
    ],
    practice: [
      "Compare a natural pattern at two scales and note what repeats.",
      "Draw a simple form and enlarge it by a constant ratio.",
    ],
    visual: "Nested lattices mirror the larger orbit.",
  },
  {
    slug: "vibration",
    title: "Vibration",
    axiom: "Nothing rests; everything moves; everything vibrates.",
    short: "All things are in motion, from the subtle to the dense.",
    body:
      "Nothing is at rest; every body, every field, every thought is in motion. What appears still is only a vibration beyond the measure of the senses. Differences of state are differences of rate, and the art of alteration is the art of changing vibration. This principle is the source of frequency, tone, and resonance. It explains why forms can shift, why moods can be transmuted, and why harmony brings coherence to a system. To understand vibration is to understand the language of energy and the means by which the invisible becomes the visible. In geometry, vibration is seen as rhythm within the line and pulse within the curve. That which moves together coheres; that which moves apart disperses.",
    keys: [
      "Motion is universal",
      "Rate defines state",
      "Resonance binds",
      "Harmony clarifies",
    ],
    practice: [
      "Listen for a steady rhythm in a quiet space.",
      "Match your breath to a slow, even cadence.",
    ],
    visual: "A logarithmic spiral accelerates outward.",
  },
  {
    slug: "polarity",
    title: "Polarity",
    axiom:
      "Everything is Dual; everything has poles; everything has its pair of opposites; like and unlike are the same; opposites are identical in nature, but different in degree; extremes meet; all truths are but half-truths; all paradoxes may be reconciled.",
    short: "Opposites share one nature, separated by degree.",
    body:
      "All things have poles and pairs of opposites; differences are of degree and not of kind. Heat and cold, light and shadow, love and hate are variations along a single scale. By shifting degree, the quality is altered; by holding both poles, the paradox resolves. Polarity is the principle of contrast and the key to balance. It instructs the mind to seek the scale rather than the conflict, to see the shared substance beneath apparent division. In geometry, polarity is seen where a form can be reversed yet remain the same, where inversion reveals the same law in opposite motion. The extremes are not enemies but limits; the art is to move between them with knowledge.",
    keys: [
      "Opposites are degrees",
      "Inversion reveals law",
      "Balance is movement",
      "Paradox resolves",
    ],
    practice: [
      "Choose a quality and locate its opposite on a single scale.",
      "Shift your focus gradually between two extremes.",
    ],
    visual: "Rectangles invert and return to balance.",
  },
  {
    slug: "rhythm",
    title: "Rhythm",
    axiom:
      "Everything flows, out and in; everything has its tides; all things rise and fall; the pendulum-swing manifests in everything; the measure of the swing to the right is the measure of the swing to the left; rhythm compensates.",
    short: "All motion moves in cycles; balance is restored by return.",
    body:
      "Everything flows, out and in; all things rise and fall. The pendulum swing is seen in tide and season, in breath and pulse, in fortune and decay. Rhythm is the law that compensates, returning the measure of the swing to its balance. The wise observe rhythm and make allowance for its return. This principle is not a fatalism but a recognition of cycles and the timing within them. In sacred form, rhythm appears as repeating arcs and measured turns, a cadence that brings stability to change. To work with rhythm is to work with time itself, adjusting effort and rest, expansion and contraction. The cycle is the form of endurance.",
    keys: [
      "Cycles govern",
      "Return is law",
      "Cadence stabilizes",
      "Timing is power",
    ],
    practice: [
      "Mark a repeating cycle in your day and note its return.",
      "Pause before reversal and observe the shift.",
    ],
    visual: "Interlaced nodes arc through shared timing.",
  },
  {
    slug: "cause-effect",
    title: "Cause & Effect",
    axiom:
      "Every Cause has its Effect; every Effect has its Cause; everything happens according to Law; Chance is but a name for Law not recognized; there are many planes of causation, but nothing escapes the Law.",
    short: "Events are linked by law, even when the link is unseen.",
    body:
      "Every cause has its effect; every effect has its cause. Nothing occurs by chance, though the chain may be hidden. There are many planes of causation, from the coarse to the subtle, yet each is bound to law. The ignorant are carried by the chain; the instructed learn to read it and to move within it. Cause and effect is not merely linear, but layered, with smaller causes nested within greater causes. In geometry, each line is a consequence of a prior measure, each intersection the record of a decision. The principle teaches responsibility and clear intent, for every act, however small, becomes a seed of consequence. To understand causation is to understand the architecture of sequence.",
    keys: [
      "Law binds events",
      "Chains are layered",
      "Intent seeds outcome",
      "Sequence reveals structure",
    ],
    practice: [
      "Trace one outcome back to three preceding causes.",
      "Choose a small cause and observe its effect.",
    ],
    visual: "Petals stack until the pattern resolves.",
  },
  {
    slug: "gender",
    title: "Gender",
    axiom:
      "Gender is in everything; everything has its Masculine and Feminine Principles; Gender manifests on all planes.",
    short: "Generation arises from the interplay of complementary forces.",
    body:
      "Gender is in everything; all things have their masculine and feminine principles. This is not a distinction of bodies but of qualities: the directive and the receptive, the initiating and the forming. Creation requires both. The masculine directs energy; the feminine gives it shape. Their interplay is seen in conception, in thought and manifestation, in the union of line and curve. The principle is present on all planes, from the physical to the mental and the spiritual. In geometry, it appears where angular structure meets flowing arc, where a linear measure is received by a curve and becomes form. To honor gender is to honor generation itself and the balance required for coherence.",
    keys: [
      "Directive and receptive",
      "Forming and formed",
      "Union generates",
      "Balance creates",
    ],
    practice: [
      "Note where you initiate and where you receive in a process.",
      "Hold a structure and a curve together until they harmonize.",
    ],
    visual: "Vesica repeats, birthing the next line.",
  },
];

export const principleSlugs = principles.map((principle) => principle.slug);
