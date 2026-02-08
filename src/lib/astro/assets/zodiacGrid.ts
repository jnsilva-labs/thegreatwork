import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

const GRID_COLUMNS = 3;
const GRID_ROWS = 4;

const GRID_PATH = path.join(process.cwd(), "assets", "astro", "astrosigns4k.jpg");

const SIGN_POSITIONS: Record<ZodiacSign, { row: number; col: number }> = {
  aquarius: { row: 0, col: 0 },
  gemini: { row: 0, col: 1 },
  libra: { row: 0, col: 2 },
  pisces: { row: 1, col: 0 },
  cancer: { row: 1, col: 1 },
  scorpio: { row: 1, col: 2 },
  aries: { row: 2, col: 0 },
  leo: { row: 2, col: 1 },
  sagittarius: { row: 2, col: 2 },
  capricorn: { row: 3, col: 0 },
  virgo: { row: 3, col: 1 },
  taurus: { row: 3, col: 2 }
};

interface GridSource {
  buffer: Buffer;
  width: number;
  height: number;
  tileW: number;
  tileH: number;
}

let gridSourcePromise: Promise<GridSource> | null = null;
const tileCache = new Map<ZodiacSign, Buffer>();

const WHITE_LUMA_THRESHOLD = 244;
const EDGE_WHITE_RATIO_THRESHOLD = 0.9;
const MAX_EDGE_TRIM_RATIO = 0.12;

export const signToRowCol = (sign: ZodiacSign): { row: number; col: number } => {
  return SIGN_POSITIONS[sign];
};

const loadGridSource = async (): Promise<GridSource> => {
  if (!gridSourcePromise) {
    gridSourcePromise = (async () => {
      const buffer = await readFile(GRID_PATH);
      const metadata = await sharp(buffer).metadata();

      const width = metadata.width ?? 0;
      const height = metadata.height ?? 0;

      if (width <= 0 || height <= 0) {
        throw new Error(`Invalid zodiac grid metadata for ${GRID_PATH}`);
      }

      const tileW = Math.floor(width / GRID_COLUMNS);
      const tileH = Math.floor(height / GRID_ROWS);

      if (tileW <= 0 || tileH <= 0) {
        throw new Error(`Computed invalid tile size from ${GRID_PATH}`);
      }

      return {
        buffer,
        width,
        height,
        tileW,
        tileH
      };
    })();
  }

  return gridSourcePromise;
};

export const cropSignTile = async (sign: ZodiacSign): Promise<Buffer> => {
  const cached = tileCache.get(sign);
  if (cached) {
    return cached;
  }

  const source = await loadGridSource();
  const { row, col } = signToRowCol(sign);
  const insetX = Math.max(0, Math.floor(source.tileW * 0.05));
  const insetY = Math.max(0, Math.floor(source.tileH * 0.03));
  const width = source.tileW - insetX * 2;
  const height = source.tileH - insetY * 2;

  const initialTile = await sharp(source.buffer)
    .extract({
      left: col * source.tileW + insetX,
      top: row * source.tileH + insetY,
      width,
      height
    })
    .png()
    .toBuffer();

  const rawTile = await sharp(initialTile)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const rawWidth = rawTile.info.width;
  const rawHeight = rawTile.info.height;
  const channels = rawTile.info.channels;
  const data = rawTile.data;

  const isBrightPixel = (offset: number): boolean => {
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const luminance = r * 0.2126 + g * 0.7152 + b * 0.0722;
    return luminance >= WHITE_LUMA_THRESHOLD;
  };

  const columnWhiteRatio = (x: number): number => {
    let bright = 0;
    for (let y = 0; y < rawHeight; y += 1) {
      const offset = (y * rawWidth + x) * channels;
      if (isBrightPixel(offset)) {
        bright += 1;
      }
    }
    return bright / rawHeight;
  };

  const rowWhiteRatio = (y: number): number => {
    let bright = 0;
    for (let x = 0; x < rawWidth; x += 1) {
      const offset = (y * rawWidth + x) * channels;
      if (isBrightPixel(offset)) {
        bright += 1;
      }
    }
    return bright / rawWidth;
  };

  const maxTrimX = Math.floor(rawWidth * MAX_EDGE_TRIM_RATIO);
  const maxTrimY = Math.floor(rawHeight * MAX_EDGE_TRIM_RATIO);

  let trimLeft = 0;
  while (
    trimLeft < maxTrimX &&
    trimLeft < rawWidth - 2 &&
    columnWhiteRatio(trimLeft) >= EDGE_WHITE_RATIO_THRESHOLD
  ) {
    trimLeft += 1;
  }

  let trimRight = 0;
  while (
    trimRight < maxTrimX &&
    trimRight < rawWidth - trimLeft - 2 &&
    columnWhiteRatio(rawWidth - trimRight - 1) >= EDGE_WHITE_RATIO_THRESHOLD
  ) {
    trimRight += 1;
  }

  let trimTop = 0;
  while (
    trimTop < maxTrimY &&
    trimTop < rawHeight - 2 &&
    rowWhiteRatio(trimTop) >= EDGE_WHITE_RATIO_THRESHOLD
  ) {
    trimTop += 1;
  }

  let trimBottom = 0;
  while (
    trimBottom < maxTrimY &&
    trimBottom < rawHeight - trimTop - 2 &&
    rowWhiteRatio(rawHeight - trimBottom - 1) >= EDGE_WHITE_RATIO_THRESHOLD
  ) {
    trimBottom += 1;
  }

  const safeWidth = rawWidth - trimLeft - trimRight;
  const safeHeight = rawHeight - trimTop - trimBottom;

  const tile =
    safeWidth > 100 && safeHeight > 100
      ? await sharp(initialTile)
          .extract({
            left: trimLeft,
            top: trimTop,
            width: safeWidth,
            height: safeHeight
          })
          .png()
          .toBuffer()
      : initialTile;

  tileCache.set(sign, tile);
  return tile;
};

export const isZodiacSign = (value: string): value is ZodiacSign => {
  return value in SIGN_POSITIONS;
};
