import { createHash } from "node:crypto";
import sharp from "sharp";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { generateBigThreeFromGridPng } from "../lib/astro/sharecards/bigThreeFromGrid";

const sha256 = (value: Buffer): string => {
  return createHash("sha256").update(value).digest("hex");
};

const brightRatioInRect = (
  data: Uint8Array,
  width: number,
  channels: number,
  rect: { x: number; y: number; w: number; h: number }
): number => {
  let bright = 0;
  let total = 0;

  for (let y = rect.y; y < rect.y + rect.h; y += 1) {
    for (let x = rect.x; x < rect.x + rect.w; x += 1) {
      const offset = (y * width + x) * channels;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;
      if (luminance >= 244) {
        bright += 1;
      }
      total += 1;
    }
  }

  return total > 0 ? bright / total : 0;
};

describe("big three share image generation", () => {
  it("renders 9:16 output dimensions", async () => {
    const image = await generateBigThreeFromGridPng({
      sunSign: "scorpio",
      moonSign: "leo",
      risingSign: "capricorn",
      timeUnknown: false,
      watermark: true
    });

    const metadata = await sharp(image).metadata();
    expect(metadata.width).toBe(1080);
    expect(metadata.height).toBe(1920);
  });

  it("avoids bright seam bars on panel edges", async () => {
    const image = await generateBigThreeFromGridPng({
      sunSign: "scorpio",
      moonSign: "leo",
      risingSign: "capricorn",
      timeUnknown: false,
      watermark: true
    });

    const raw = await sharp(image).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = raw.info;
    const panelX = 150;
    const panelY = 1320;
    const panelW = 780;
    const panelH = 420;

    expect(width).toBe(1080);
    expect(height).toBe(1920);

    const leftRatio = brightRatioInRect(raw.data, width, channels, {
      x: panelX + 6,
      y: panelY + 24,
      w: 12,
      h: panelH - 48
    });

    const rightRatio = brightRatioInRect(raw.data, width, channels, {
      x: panelX + panelW - 18,
      y: panelY + 24,
      w: 12,
      h: panelH - 48
    });

    expect(leftRatio).toBeLessThan(0.08);
    expect(rightRatio).toBeLessThan(0.08);
  });

  it("is deterministic for identical input", async () => {
    const input = {
      sunSign: "scorpio" as const,
      moonSign: "leo" as const,
      risingSign: "capricorn" as const,
      timeUnknown: false,
      watermark: true
    };

    const first = await generateBigThreeFromGridPng(input);
    const second = await generateBigThreeFromGridPng(input);

    expect(second.byteLength).toBe(first.byteLength);
    expect(sha256(second)).toBe(sha256(first));
  });

  it("changes output when chart input changes", async () => {
    const first = await generateBigThreeFromGridPng({
      sunSign: "scorpio",
      moonSign: "leo",
      risingSign: "capricorn",
      timeUnknown: false,
      watermark: true
    });

    const second = await generateBigThreeFromGridPng({
      sunSign: "aries",
      moonSign: "pisces",
      risingSign: "taurus",
      timeUnknown: false,
      watermark: true
    });

    expect(sha256(second)).not.toBe(sha256(first));
  });

  it("changes output when watermark toggle changes", async () => {
    const withWatermark = await generateBigThreeFromGridPng({
      sunSign: "scorpio",
      moonSign: "leo",
      risingSign: "capricorn",
      timeUnknown: false,
      watermark: true
    });

    const withoutWatermark = await generateBigThreeFromGridPng({
      sunSign: "scorpio",
      moonSign: "leo",
      risingSign: "capricorn",
      timeUnknown: false,
      watermark: false
    });

    expect(sha256(withoutWatermark)).not.toBe(sha256(withWatermark));
  });
});
