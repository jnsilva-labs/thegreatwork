export type GeometrySlug =
  | "seed-of-life"
  | "flower-of-life"
  | "metatrons-cube"
  | "vesica-piscis"
  | "golden-spiral"
  | "fibonacci-rectangles"
  | "torus"
  | "sphere-lattice";

export type GeometryItem = {
  slug: GeometrySlug;
  title: string;
  caption: string;
  description: [string, string];
  tags: string[];
  generatorId: GeometrySlug;
  defaultView: "particles";
  defaultScale: number;
};

export const GEOMETRY: GeometryItem[] = [
  {
    slug: "seed-of-life",
    title: "Seed of Life",
    caption: "Seven circles in hex order, the first lattice of creation.",
    description: [
      "The Seed of Life begins with a single circle and unfolds into six surrounding circles. This hexagonal relation is the first stable lattice and appears in natural growth, packing, and harmonic structure.",
      "Within its symmetry, the eye reads origin and emergence. It is the quiet beginning from which the larger floral geometries arise.",
    ],
    tags: ["Origin", "Lattice", "Sevenfold"],
    generatorId: "seed-of-life",
    defaultView: "particles",
    defaultScale: 1,
  },
  {
    slug: "flower-of-life",
    title: "Flower of Life",
    caption: "The classic 19-circle lattice and its enclosing boundary.",
    description: [
      "The Flower of Life extends the Seed into a full hex lattice of nineteen circles. Its arcs imply vesica forms, triads, and harmonic ratios.",
      "Its outer boundary is a single measure that holds the field. The pattern has served as a cosmogram across cultures.",
    ],
    tags: ["Lattice", "Boundary", "Cosmogram"],
    generatorId: "flower-of-life",
    defaultView: "particles",
    defaultScale: 1,
  },
  {
    slug: "metatrons-cube",
    title: "Metatron's Cube",
    caption: "Thirteen nodes linked by the full web of relation.",
    description: [
      "Metatron's Cube links the thirteen centers of the Flower of Life. Every node connects to every other, revealing a complete network of relationships.",
      "Within it, the Platonic solids are traced as latent structure. It is often read as the geometry of integration.",
    ],
    tags: ["Network", "Integration", "Platonic"],
    generatorId: "metatrons-cube",
    defaultView: "particles",
    defaultScale: 1,
  },
  {
    slug: "vesica-piscis",
    title: "Vesica Piscis",
    caption: "Two equal circles whose centers rest on each other's edge.",
    description: [
      "The Vesica Piscis is the first union of two equal measures. It creates a central lens where the two circles intersect.",
      "From this lens arise proportions used in sacred architecture, iconography, and the earliest geometric constructions.",
    ],
    tags: ["Union", "Lens", "Proportion"],
    generatorId: "vesica-piscis",
    defaultView: "particles",
    defaultScale: 1,
  },
  {
    slug: "golden-spiral",
    title: "Golden Spiral",
    caption: "A logarithmic spiral linked to the golden ratio.",
    description: [
      "The golden spiral grows by a constant ratio each quarter-turn. It is approximated by Fibonacci rectangles and the arc that links them.",
      "Its growth pattern appears in shells, storms, and leaf arrangements, binding number to visible motion.",
    ],
    tags: ["Logarithmic", "Growth", "Ratio"],
    generatorId: "golden-spiral",
    defaultView: "particles",
    defaultScale: 1.1,
  },
  {
    slug: "fibonacci-rectangles",
    title: "Fibonacci Rectangles",
    caption: "Rectangles expanding by successive Fibonacci sums.",
    description: [
      "Fibonacci rectangles expand by the sum of the two previous lengths. Their sequence generates the proportions used to draw the golden spiral.",
      "They are a measured proof that arithmetic and form are inseparable when growth is orderly.",
    ],
    tags: ["Recursive", "Measure", "Spiral"],
    generatorId: "fibonacci-rectangles",
    defaultView: "particles",
    defaultScale: 1,
  },
  {
    slug: "torus",
    title: "Torus",
    caption: "A circle swept around a central axis.",
    description: [
      "The torus is a continuous loop, often used to describe cycles and containment. Its surface can be traced by rings of latitude and longitude.",
      "In this plate, projected rings describe its curvature and reveal its continuous flow.",
    ],
    tags: ["Cycle", "Continuity", "Flow"],
    generatorId: "torus",
    defaultView: "particles",
    defaultScale: 1,
  },
  {
    slug: "sphere-lattice",
    title: "Sphere Lattice",
    caption: "A spherical field traced by concentric rings.",
    description: [
      "A sphere can be described by a lattice of rings that circle its body. The lattice reveals curvature and the distribution of space.",
      "A Fibonacci distribution can also be used to seed a uniform point field across the surface.",
    ],
    tags: ["Curvature", "Balance", "Distribution"],
    generatorId: "sphere-lattice",
    defaultView: "particles",
    defaultScale: 1,
  },
];

if (process.env.NODE_ENV !== "production") {
  const slugs = new Set<string>();
  GEOMETRY.forEach((item) => {
    if (slugs.has(item.slug)) {
      throw new Error(`Duplicate geometry slug detected: ${item.slug}`);
    }
    slugs.add(item.slug);
  });
}
