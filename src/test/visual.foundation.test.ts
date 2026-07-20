import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("illuminated archive visual foundation", () => {
  it("defines the visual aliases and local font foundation", () => {
    const globals = readSource("src/app/globals.css");
    const layout = readSource("src/app/layout.tsx");

    expect(globals).toMatch(/--teal:\s*var\(--border\);/);
    expect(globals).toMatch(/--gold:\s*var\(--accent\);/);
    expect(globals).toMatch(/--stone:\s*var\(--muted\);/);
    expect(globals).toMatch(/--font-ritual-serif:\s*var\(--font-ritual\);/);

    expect(globals).toMatch(/\.type-body\s*{[^}]*font-size:\s*var\(--type-body\)/s);
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
      /\.italic\s*{[^}]*font-family:\s*var\(--font-ritual-serif\);[^}]*font-style:\s*italic;/s,
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
});
