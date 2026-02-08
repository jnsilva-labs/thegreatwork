import "server-only";

import sharp from "sharp";
import { cropSignTile, isZodiacSign, type ZodiacSign } from "../assets/zodiacGrid";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;

const PANEL_X = 150;
const PANEL_WIDTH = 780;
const PANEL_HEIGHT = 420;
const FIRST_PANEL_Y = 280;
const PANEL_GAP = 520;

const LABELS = ["SOLAR SELF", "LUNAR HEART", "ASCENDANT MASK"] as const;

const panelY = (index: number): number => FIRST_PANEL_Y + index * PANEL_GAP;

export interface BigThreeFromGridInput {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign?: ZodiacSign | null;
  timeUnknown?: boolean;
  watermark?: boolean;
}

const renderBackgroundSvg = (): string => {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="8%" r="92%">
      <stop offset="0%" stop-color="#24252b" stop-opacity="0.76" />
      <stop offset="56%" stop-color="#16171c" stop-opacity="0.52" />
      <stop offset="100%" stop-color="#101115" stop-opacity="0.3" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgGlow)" />
</svg>
`;
};

const renderPlaceholderSvg = (width: number, height: number): string => {
  const stars = Array.from({ length: 52 }, (_, index) => {
    const x = ((index * 73) % (width - 24)) + 12;
    const y = ((index * 191) % (height - 24)) + 12;
    const radius = index % 3 === 0 ? 1.6 : index % 3 === 1 ? 1.15 : 0.8;
    const opacity = index % 2 === 0 ? 0.35 : 0.22;

    return `<circle cx="${x}" cy="${y}" r="${radius}" fill="#d6c7a1" opacity="${opacity}"/>`;
  }).join("\n");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="panelFade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#23242a" />
      <stop offset="100%" stop-color="#14161b" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#panelFade)" />
  <rect width="100%" height="100%" fill="#000" opacity="0.36" />
  ${stars}
  <text x="50%" y="53%" text-anchor="middle" fill="#efe6d3" opacity="0.85" font-size="40" letter-spacing="2" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">Birth time needed</text>
</svg>
`;
};

const renderFrameOverlaySvg = (watermark: boolean): string => {
  const borderColor = "#9a7a4a";

  const panelRects = [0, 1, 2]
    .map((index) => {
      const y = panelY(index);
      return `<rect x="${PANEL_X}" y="${y}" width="${PANEL_WIDTH}" height="${PANEL_HEIGHT}" rx="2" fill="none" stroke="${borderColor}" stroke-opacity="0.9" stroke-width="2" />`;
    })
    .join("\n");

  const labels = LABELS.map((label, index) => {
    const labelY = panelY(index) + PANEL_HEIGHT + 44;
    const labelX = PANEL_X + PANEL_WIDTH / 2;
    return `<text x="${labelX}" y="${labelY}" text-anchor="middle" fill="#d2be92" font-size="27" letter-spacing="8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">${label}</text>`;
  }).join("\n");

  const header = `
    <text x="${CARD_WIDTH / 2}" y="132" text-anchor="middle" fill="#dcc8a1" font-size="72" letter-spacing="1.6" font-family="'Iowan Old Style', Baskerville, 'Times New Roman', Georgia, serif">Trinity of Self</text>
    <text x="${CARD_WIDTH / 2}" y="174" text-anchor="middle" fill="#bea982" fill-opacity="0.95" font-size="22" letter-spacing="6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">AWARENESS PARADOX</text>
  `;

  const watermarkText = watermark
    ? `<text x="${CARD_WIDTH - 48}" y="${CARD_HEIGHT - 42}" text-anchor="end" fill="#e4d9c0" fill-opacity="0.3" font-size="22" letter-spacing="3.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">@awarenessparadox</text>`
    : "";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}">
  ${header}
  ${panelRects}
  ${labels}
  ${watermarkText}
</svg>
`;
};

const tileToPanel = async (sign: ZodiacSign): Promise<Buffer> => {
  const tileBuffer = await cropSignTile(sign);
  return sharp(tileBuffer)
    .resize(PANEL_WIDTH, PANEL_HEIGHT, {
      fit: "contain",
      position: "center",
      background: "#111318"
    })
    .png()
    .toBuffer();
};

const placeholderToPanel = async (): Promise<Buffer> => {
  return sharp(Buffer.from(renderPlaceholderSvg(PANEL_WIDTH, PANEL_HEIGHT))).png().toBuffer();
};

export const generateBigThreeFromGridPng = async (
  input: BigThreeFromGridInput
): Promise<Buffer> => {
  const watermark = input.watermark !== false;

  const sunPanel = await tileToPanel(input.sunSign);
  const moonPanel = await tileToPanel(input.moonSign);

  const risingSign: ZodiacSign | null =
    input.risingSign && isZodiacSign(input.risingSign) ? input.risingSign : null;

  const shouldUsePlaceholder = input.timeUnknown === true || !risingSign;

  const risingPanel = shouldUsePlaceholder
    ? await placeholderToPanel()
    : await tileToPanel(risingSign);

  const base = sharp({
    create: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      channels: 4,
      background: "#101115"
    }
  });

  const output = await base
    .composite([
      { input: Buffer.from(renderBackgroundSvg()) },
      { input: sunPanel, left: PANEL_X, top: panelY(0) },
      { input: moonPanel, left: PANEL_X, top: panelY(1) },
      { input: risingPanel, left: PANEL_X, top: panelY(2) },
      { input: Buffer.from(renderFrameOverlaySvg(watermark)) }
    ])
    .png()
    .toBuffer();

  return output;
};
