import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import { PerspectiveCamera } from "three";
import { describe, expect, it, vi } from "vitest";
import { GalleryDetailClient, getParticleDefaults } from "@/components/gallery/GalleryDetailClient";
import {
  fitGalleryCamera,
  resolveGalleryMotion,
  shouldMountGalleryPost,
} from "@/components/gallery/GalleryViewer";
import { GEOMETRY } from "@/data/geometryCatalog";

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

vi.mock("@/components/gallery/GalleryViewer", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/components/gallery/GalleryViewer")>();
  return {
    ...original,
    GalleryViewer: (props: {
      accessibleLabel: string;
      cameraMode: string;
      fitKey: number;
      particleAlpha: number;
      scale: number;
    }) => (
      <div
        role="img"
        aria-label={props.accessibleLabel}
        data-testid="gallery-viewer"
        data-camera={props.cameraMode}
        data-fit-key={props.fitKey}
        data-alpha={props.particleAlpha}
        data-scale={props.scale}
      />
    ),
  };
});

vi.mock("@/components/ui/StillnessListener", () => ({ StillnessListener: () => null }));
vi.mock("@/components/PlateSVG", () => ({
  PlateSVG: ({ slug }: { slug: string }) => <div data-testid={`plate-${slug}`} />,
}));

describe("sacred geometry instrument", () => {
  it("preserves the complete eight-plate catalog and defaults", () => {
    expect(GEOMETRY).toEqual([
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
        slug: "flower-of-life", title: "Flower of Life",
        caption: "The classic 19-circle lattice and its enclosing boundary.",
        description: [
          "The Flower of Life extends the Seed into a full hex lattice of nineteen circles. Its arcs imply vesica forms, triads, and harmonic ratios.",
          "Its outer boundary is a single measure that holds the field. The pattern has served as a cosmogram across cultures.",
        ],
        tags: ["Lattice", "Boundary", "Cosmogram"], generatorId: "flower-of-life", defaultView: "particles", defaultScale: 1,
      },
      {
        slug: "metatrons-cube", title: "Metatron's Cube",
        caption: "Thirteen nodes linked by the full web of relation.",
        description: [
          "Metatron's Cube links the thirteen centers of the Flower of Life. Every node connects to every other, revealing a complete network of relationships.",
          "Within it, the Platonic solids are traced as latent structure. It is often read as the geometry of integration.",
        ],
        tags: ["Network", "Integration", "Platonic"], generatorId: "metatrons-cube", defaultView: "particles", defaultScale: 1,
      },
      {
        slug: "vesica-piscis", title: "Vesica Piscis",
        caption: "Two equal circles whose centers rest on each other's edge.",
        description: [
          "The Vesica Piscis is the first union of two equal measures. It creates a central lens where the two circles intersect.",
          "From this lens arise proportions used in sacred architecture, iconography, and the earliest geometric constructions.",
        ],
        tags: ["Union", "Lens", "Proportion"], generatorId: "vesica-piscis", defaultView: "particles", defaultScale: 1,
      },
      {
        slug: "golden-spiral", title: "Golden Spiral",
        caption: "A logarithmic spiral linked to the golden ratio.",
        description: [
          "The golden spiral grows by a constant ratio each quarter-turn. It is approximated by Fibonacci rectangles and the arc that links them.",
          "Its growth pattern appears in shells, storms, and leaf arrangements, binding number to visible motion.",
        ],
        tags: ["Logarithmic", "Growth", "Ratio"], generatorId: "golden-spiral", defaultView: "particles", defaultScale: 1.1,
      },
      {
        slug: "fibonacci-rectangles", title: "Fibonacci Rectangles",
        caption: "Rectangles expanding by successive Fibonacci sums.",
        description: [
          "Fibonacci rectangles expand by the sum of the two previous lengths. Their sequence generates the proportions used to draw the golden spiral.",
          "They are a measured proof that arithmetic and form are inseparable when growth is orderly.",
        ],
        tags: ["Recursive", "Measure", "Spiral"], generatorId: "fibonacci-rectangles", defaultView: "particles", defaultScale: 1,
      },
      {
        slug: "torus", title: "Torus", caption: "A circle swept around a central axis.",
        description: [
          "The torus is a continuous loop, often used to describe cycles and containment. Its surface can be traced by rings of latitude and longitude.",
          "In this plate, projected rings describe its curvature and reveal its continuous flow.",
        ],
        tags: ["Cycle", "Continuity", "Flow"], generatorId: "torus", defaultView: "particles", defaultScale: 1,
      },
      {
        slug: "sphere-lattice", title: "Sphere Lattice",
        caption: "A spherical field traced by concentric rings.",
        description: [
          "A sphere can be described by a lattice of rings that circle its body. The lattice reveals curvature and the distribution of space.",
          "A Fibonacci distribution can also be used to seed a uniform point field across the surface.",
        ],
        tags: ["Curvature", "Balance", "Distribution"], generatorId: "sphere-lattice", defaultView: "particles", defaultScale: 1,
      },
    ]);

    expect(getParticleDefaults("golden-spiral")).toEqual({ size: 18, alpha: 1.1, density: 1.3, flow: 0.8 });
    expect(getParticleDefaults("sphere-lattice")).toEqual({ size: 16, alpha: 0.95, density: 1.4, flow: 0.6 });
    expect(getParticleDefaults("torus")).toEqual({ size: 17, alpha: 1, density: 1.2, flow: 0.7 });
    expect(getParticleDefaults("seed-of-life")).toEqual({ size: 16, alpha: 0.9, density: 1.1, flow: 0.6 });
  });

  it("presents the catalog as a two-column cabinet of ruled figures with explicit links", () => {
    const page = readSource("src/app/gallery/page.tsx");

    expect(page).toContain("gallery-cabinet");
    expect(page).toContain("sm:grid-cols-2");
    expect(page).not.toContain("lg:grid-cols-3");
    expect(page.match(/<figure/g)).toHaveLength(1);
    expect(page).toContain("<figcaption");
    expect(page).toContain("gallery-plate__figure");
    expect(page).toContain("min-h-[44px]");
    expect(page).toContain("Open plate");
    expect(page).not.toMatch(/rounded-\[(?:1\.6|2)rem\]|rounded-2xl/);
  });

  it("keeps detail SEO, structured data, static params, and not-found behavior", () => {
    const detail = readSource("src/app/gallery/[slug]/page.tsx");

    expect(detail).toContain("generateStaticParams");
    expect(detail).toContain("generateMetadata");
    expect(detail).toContain("notFound()");
    expect(detail).toContain("buildBreadcrumbSchema");
    expect(detail).toContain("buildWebPageSchema");
    expect(detail).toContain("<JsonLd");
    expect(detail).toContain("<GalleryDetailClient plate={plate}");
    const breadcrumb = detail.match(/<nav[\s\S]*?<\/nav>/)?.[0] ?? "";
    expect(breadcrumb).toMatch(/href="\/"[^>]*className="[^"]*min-h-\[44px\][^"]*"/);
    expect(breadcrumb).toMatch(/href="\/gallery"[^>]*className="[^"]*min-h-\[44px\][^"]*"/);
  });

  it("places the plate identity before the dominant interactive instrument", () => {
    const detail = readSource("src/components/gallery/GalleryDetailClient.tsx");
    const title = detail.indexOf("<h1");
    const caption = detail.indexOf("{plate.caption}");
    const viewer = detail.indexOf("<GalleryViewer");

    expect(title).toBeGreaterThan(-1);
    expect(caption).toBeGreaterThan(title);
    expect(viewer).toBeGreaterThan(caption);
    expect(detail).toContain('accessibleLabel={`${plate.title} interactive geometry instrument`}');
    expect(detail).toContain("gallery-instrument__viewport");
    expect(detail).toContain("gallery-instrument__static-plate");
  });

  it("exposes named calibration controls, live values, camera states, and reset semantics", () => {
    render(<GalleryDetailClient plate={GEOMETRY[4]} />);

    expect(screen.getByRole("heading", { level: 1, name: "Golden Spiral" })).toBeTruthy();
    expect(screen.getByRole("group", { name: /calibration field/i })).toBeTruthy();
    expect(screen.getByRole("img", { name: /golden spiral interactive geometry instrument/i })).toBeTruthy();

    const expectedRanges = [
      ["Scale", "0.6", "1.8", "0.05"],
      ["Particle size", "8", "28", "1"],
      ["Brightness", "0.4", "1.4", "0.05"],
      ["Density", "0.5", "2", "0.1"],
      ["Flow strength", "0", "1.2", "0.05"],
      ["Trail amount", "0", "1", "0.05"],
    ] as const;

    for (const [name, min, max, step] of expectedRanges) {
      const slider = screen.getByRole("slider", { name });
      expect(slider.getAttribute("min")).toBe(min);
      expect(slider.getAttribute("max")).toBe(max);
      expect(slider.getAttribute("step")).toBe(step);
      expect(slider.parentElement?.className).toContain("min-h-[44px]");
    }

    expect(screen.getByText("1.10×")).toBeTruthy();
    expect(screen.getByText("1.10")).toBeTruthy();
    expect(screen.getByText("25%")).toBeTruthy();

    const cinematic = screen.getByRole("button", { name: "Cinematic view" });
    const orbit = screen.getByRole("button", { name: "Orbit view" });
    expect(cinematic.getAttribute("aria-pressed")).toBe("true");
    expect(orbit.getAttribute("aria-pressed")).toBe("false");
    expect(cinematic.className).toContain("min-h-[44px]");

    fireEvent.click(orbit);
    expect(cinematic.getAttribute("aria-pressed")).toBe("false");
    expect(orbit.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByTestId("gallery-viewer").getAttribute("data-camera")).toBe("orbit");

    fireEvent.change(screen.getByRole("slider", { name: "Scale" }), { target: { value: "1.5" } });
    fireEvent.change(screen.getByRole("slider", { name: "Brightness" }), { target: { value: "0.7" } });
    expect(screen.getByTestId("gallery-viewer").getAttribute("data-scale")).toBe("1.5");
    expect(screen.getByTestId("gallery-viewer").getAttribute("data-alpha")).toBe("0.7");

    const fitKey = screen.getByTestId("gallery-viewer").getAttribute("data-fit-key");
    const reset = screen.getByRole("button", { name: "Reset calibration and refit geometry" });
    expect(reset.className).toContain("min-h-[44px]");
    fireEvent.click(reset);
    expect(screen.getByTestId("gallery-viewer").getAttribute("data-fit-key")).not.toBe(fitKey);
    expect(screen.getByTestId("gallery-viewer").getAttribute("data-scale")).toBe("1.1");
    expect(screen.getByTestId("gallery-viewer").getAttribute("data-alpha")).toBe("1.1");
  });

  it("resolves every motion blocker without treating render quality as permission", () => {
    expect(resolveGalleryMotion({ motionOk: true, hermeticStillness: false, forceStillness: false })).toEqual({
      enabled: true,
      frameloop: "always",
      autoRotate: true,
      trails: true,
      shaderTime: true,
    });

    for (const blocked of [
      { motionOk: false, hermeticStillness: false, forceStillness: false },
      { motionOk: true, hermeticStillness: true, forceStillness: false },
      { motionOk: true, hermeticStillness: false, forceStillness: true },
      { motionOk: false, hermeticStillness: true, forceStillness: true },
    ]) {
      expect(resolveGalleryMotion(blocked)).toEqual({
        enabled: false,
        frameloop: "demand",
        autoRotate: false,
        trails: false,
        shaderTime: false,
      });
    }

    expect(resolveGalleryMotion.toString()).not.toMatch(/quality/i);
  });

  it("keeps direct orbit manipulation available while decorative motion is denied", () => {
    const viewer = readSource("src/components/gallery/GalleryViewer.tsx");

    expect(viewer).toContain("useMotionPreference");
    expect(viewer).toContain("resolveGalleryMotion");
    expect(viewer).toMatch(/frameloop=\{motion\.frameloop\}/);
    expect(viewer).toMatch(/<OrbitControls[\s\S]*?autoRotate=\{motion\.autoRotate\}/);
    expect(viewer).toMatch(/motionEnabled=\{motion\.shaderTime\}/);
    expect(viewer).toMatch(/motionEnabled=\{motion\.trails\}/);
    expect(viewer).not.toMatch(/reducedMotion \|\| qualityTier === "low"/);
    expect(viewer).toContain("Interactive WebGL is unavailable");

    const particles = readSource("src/components/gallery/LineParticles.tsx");
    expect(particles).toMatch(/uTime\.value = motionEnabled \? state\.clock\.elapsedTime : 0/);
  });

  it("refits the camera and invalidates demand rendering after camera mutation", () => {
    const viewer = readSource("src/components/gallery/GalleryViewer.tsx");
    const camera = new PerspectiveCamera(45, 1, 0.1, 50);
    const distance = fitGalleryCamera(camera, 2, 1.25);

    expect(distance).toBeGreaterThan(3);
    expect(camera.position.toArray()).toEqual([0, 0, distance]);
    expect(viewer).toMatch(/const \{ camera, invalidate \} = useThree\(\)/);
    expect(viewer).toMatch(/fitGalleryCamera\([\s\S]*?invalidate\(\)/);
  });

  it("never mounts a render-loop takeover when diagnostic rendering disables post-processing", () => {
    const viewer = readSource("src/components/gallery/GalleryViewer.tsx");

    expect(shouldMountGalleryPost(false)).toBe(true);
    expect(shouldMountGalleryPost(true)).toBe(false);
    expect(viewer).toMatch(/shouldMountGalleryPost\(debugForceVisible\)\s*\?\s*\(/);
    const postProps = viewer.match(/type GalleryPostProps = \{[\s\S]*?\};/)?.[0] ?? "";
    const postSignature = viewer.match(/function GalleryPost\(\{[\s\S]*?\}: GalleryPostProps\)/)?.[0] ?? "";
    expect(postProps).not.toMatch(/(^|\n)\s*enabled:/);
    expect(postSignature).not.toMatch(/(^|\n)\s*enabled,/);
  });

  it("uses bounded responsive viewport sizing and retains the existing email CTA contract", () => {
    const client = readSource("src/components/gallery/GalleryDetailClient.tsx");
    const page = readSource("src/app/gallery/page.tsx");
    const css = readSource("src/app/globals.css");

    expect(css).toContain(".gallery-instrument__viewport");
    expect(css).toMatch(/block-size:\s*clamp\([^;]*(?:svh|rem)/);
    expect(css).toMatch(/\.gallery-instrument__range\s*\{[\s\S]*?min-height:\s*44px/);
    expect(client).not.toContain('containerClassName="h-[70vh]"');
    expect(page).toContain('source="gallery-page"');
    expect(page).toContain('interests={["beginner-hermetic"]}');
    expect(page).toContain('variant="compact"');
    expect(page).toContain('secondaryHref="/principles"');
    expect(page).toContain('secondaryLabel="Principles Index"');
  });
});
