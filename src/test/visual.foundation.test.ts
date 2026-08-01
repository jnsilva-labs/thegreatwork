import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("illuminated archive visual foundation", () => {
  const upgradedSurfaces = [
    "src/app/globals.css",
    "src/components/ui/ScrollOrchestrator.tsx",
    "src/components/scene/SceneShell.tsx",
    "src/components/ui/NavBar.tsx",
    "src/components/ui/Footer.tsx",
    "src/components/ui/HomepageHero.tsx",
    "src/components/ui/HomepageSection.tsx",
    "src/components/astro/NatalChartWidget.tsx",
    "src/components/astro/PlanetaryArc.tsx",
    "src/components/astro/share/SharePanel.tsx",
    "src/components/gallery/GalleryDetailClient.tsx",
    "src/components/gallery/GalleryViewer.tsx",
    "src/features/tarot/pages/Home.tsx",
    "src/features/tarot/pages/Reading.tsx",
    "src/features/tarot/pages/Settings.tsx",
    "src/features/tarot/components/CardVisual.tsx",
    "src/features/tarot/components/SpreadLayout.tsx",
    "src/features/tarot/components/PhaseArc.tsx",
    "src/features/tarot/components/TarotCardFace.tsx",
  ];

  it("defines the visual aliases and local font foundation", () => {
    const globals = readSource("src/app/globals.css");
    const layout = readSource("src/app/layout.tsx");

    expect(globals).toMatch(/--teal:\s*var\(--border\);/);
    expect(globals).toMatch(/--gold:\s*var\(--accent\);/);
    expect(globals).toMatch(/--stone:\s*var\(--muted\);/);
    expect(globals).toMatch(/--font-ritual-serif:\s*var\(--font-ritual\);/);

    expect(globals).toMatch(/\.type-body\s*{[\s\S]*?font-size:\s*var\(--type-body\)/);
    for (const fontImport of [
      '@fontsource/cormorant-garamond/400.css',
      '@fontsource/cormorant-garamond/400-italic.css',
      '@fontsource/manrope/400.css',
      '@fontsource/manrope/500.css',
      '@fontsource/manrope/600.css',
      '@fontsource/manrope/700.css',
    ]) {
      expect(layout).toContain(fontImport);
    }
    expect(layout).not.toContain('@fontsource/manrope/400-italic.css');
    expect(layout).not.toContain('@fontsource/cormorant-garamond/600.css');
    expect(globals).toMatch(
      /\.italic\s*{[\s\S]*?font-family:\s*var\(--font-ritual-serif\);[\s\S]*?font-style:\s*italic;/,
    );
  });

  it("keeps these visual surfaces free of broad transitions and remote textures", () => {
    const surfaces = [
      readSource("src/app/globals.css"),
      readSource("src/app/layout.tsx"),
      readSource("src/features/tarot/components/CardVisual.tsx"),
    ].join("\n");

    expect(surfaces).not.toMatch(/transition:\s*all\b/);
    expect(surfaces).not.toContain("transition-all");
    expect(surfaces).not.toContain("transparenttextures.com");
  });

  it("keeps the Tarot texture decorative and theme-derived", () => {
    const card = readSource("src/features/tarot/components/CardVisual.tsx");

    expect(card).toMatch(/pointer-events-none[^\n]*background-image:radial-gradient/);
    expect(card).toContain("var(--gilt)");
    expect(card).not.toContain("rgba(197,160,89");
  });

  it("keeps every upgraded surface free of broad transitions and remote visual assets", () => {
    const surfaces = upgradedSurfaces.map(readSource).join("\n");
    const remoteVisualPattern = /(?:background|background-image)\s*[:=][^\n]*url\(["']?https?:\/\/|\b(?:src|poster)\s*=\s*["']https?:\/\//;

    expect(surfaces).not.toMatch(/transition:\s*all\b/);
    expect(surfaces).not.toContain("transition-all");
    expect('src="https://example.com/remote-plate.jpg"').toMatch(remoteVisualPattern);
    expect('href="https://example.com/source"').not.toMatch(remoteVisualPattern);
    expect('src="data:image/svg+xml,%3Csvg%3E"').not.toMatch(remoteVisualPattern);
    expect(surfaces).not.toMatch(remoteVisualPattern);
    expect(surfaces).not.toContain("transparenttextures.com");
  });

  it("keeps essential labels at twelve pixels with restrained mobile tracking", () => {
    const surfaces = upgradedSurfaces.map(readSource).join("\n");

    expect(surfaces).not.toMatch(/text-\[(?:9|10|11)px\]/);
    expect(surfaces).not.toMatch(/["'`\s]tracking-\[0\.(?:2[1-9]|[3-9]\d*)em\]/);
    expect(surfaces).not.toMatch(/text-\[color:var\(--mist\)\]\/(?:[1-6]\d|7[0-5])\b/);
  });

  it("keeps the Tarot settings key field and gallery calibration controls touch-safe", () => {
    const settings = readSource("src/features/tarot/pages/Settings.tsx");
    const gallery = readSource("src/components/gallery/GalleryDetailClient.tsx");

    expect(settings).toMatch(/id="personal-api-key"[\s\S]*?className="[^"]*min-h-\[44px\]/);
    expect(gallery).toMatch(/className="flex min-h-\[44px\] items-center"/);
  });

  it("gates Tarot settings transitions through the shared motion preference and semantic materials", () => {
    const settings = readSource("src/features/tarot/pages/Settings.tsx");

    expect(settings).toContain("useMotionPreference");
    expect(settings).toContain("motionOk ? 'transition-colors' : ''");
    expect(settings).toContain("motionOk ? 'transition-transform' : ''");
    expect(settings).not.toContain("bg-[rgba(184,155,94,0.06)]");
  });
});
