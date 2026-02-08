import { describe, expect, it } from "vitest";
import { calculateAspects } from "../src/lib/aspects";

describe("calculateAspects", () => {
  const options = { orbDefault: 6, orbLuminary: 8 };

  it("detects exact major aspects", () => {
    const result = calculateAspects(
      {
        sun: 0,
        moon: 60,
        mercury: 90,
        venus: 120,
        mars: 180,
        jupiter: 30,
        saturn: 210,
        uranus: 240,
        neptune: 300,
        pluto: 330,
        node: 150
      },
      options
    );

    expect(result.some((a) => a.a === "sun" && a.b === "moon" && a.type === "sextile")).toBe(true);
    expect(result.some((a) => a.a === "sun" && a.b === "mercury" && a.type === "square")).toBe(true);
    expect(result.some((a) => a.a === "sun" && a.b === "venus" && a.type === "trine")).toBe(true);
    expect(result.some((a) => a.a === "sun" && a.b === "mars" && a.type === "opposition")).toBe(true);
  });

  it("does not include non-aspects outside orb", () => {
    const result = calculateAspects(
      {
        sun: 0,
        moon: 50,
        mercury: 95,
        venus: 122,
        mars: 171,
        jupiter: 10,
        saturn: 44,
        uranus: 77,
        neptune: 188,
        pluto: 251,
        node: 319
      },
      { orbDefault: 2, orbLuminary: 2 }
    );

    expect(result.find((a) => a.a === "sun" && a.b === "moon")).toBeUndefined();
  });

  it("handles wrap-around angles", () => {
    const result = calculateAspects(
      {
        sun: 359.8,
        moon: 0.1,
        mercury: 45,
        venus: 135,
        mars: 225,
        jupiter: 315,
        saturn: 170,
        uranus: 260,
        neptune: 80,
        pluto: 20,
        node: 200
      },
      options
    );

    const conjunction = result.find(
      (a) => a.a === "sun" && a.b === "moon" && a.type === "conjunction"
    );

    expect(conjunction).toBeDefined();
    expect(conjunction?.orb).toBeLessThan(1);
  });

  it("applies luminary orb override", () => {
    const result = calculateAspects(
      {
        sun: 0,
        moon: 67,
        mercury: 127,
        venus: 194,
        mars: 247,
        jupiter: 307,
        saturn: 10,
        uranus: 70,
        neptune: 130,
        pluto: 190,
        node: 250
      },
      { orbDefault: 6, orbLuminary: 8 }
    );

    expect(result.some((a) => a.a === "sun" && a.b === "moon" && a.type === "sextile")).toBe(true);
    expect(result.some((a) => a.a === "mercury" && a.b === "venus" && a.type === "sextile")).toBe(false);
  });

  it("is deterministic and stably ordered", () => {
    const points = {
      sun: 0,
      moon: 60,
      mercury: 120,
      venus: 180,
      mars: 240,
      jupiter: 300,
      saturn: 30,
      uranus: 90,
      neptune: 150,
      pluto: 210,
      node: 270,
      asc: 330,
      mc: 45
    } as const;

    const first = calculateAspects(points, options);
    const second = calculateAspects(points, options);

    expect(second).toEqual(first);
  });
});
