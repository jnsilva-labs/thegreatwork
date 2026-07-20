import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("illuminated archive visual foundation", () => {
  it("defines the visual aliases and local font foundation", () => {
    const globals = readSource("src/app/globals.css");
    const layout = readSource("src/app/layout.tsx");

    for (const token of ["--teal:", "--gold:", "--stone:", "--font-ritual:"]) {
      expect(globals).toContain(token);
    }

    expect(globals).toMatch(/\.type-body\s*{[^}]*font-size:\s*var\(--type-body\)/s);
    expect(layout).toContain('@fontsource/cormorant-garamond/');
    expect(layout).toContain('@fontsource/manrope/');
    expect(layout).not.toContain('@fontsource/cormorant-garamond/600.css');
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
