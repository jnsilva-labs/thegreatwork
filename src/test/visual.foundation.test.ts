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

    expect(layout).toContain('@fontsource/cormorant-garamond/');
    expect(layout).toContain('@fontsource/manrope/');
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
});
