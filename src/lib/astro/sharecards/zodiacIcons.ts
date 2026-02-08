import type { ZodiacSign } from "./constants";

const iconPaths: Record<ZodiacSign, string> = {
  Aries: `
    <path d="M-28 22 C-30 -4 -18 -24 0 -26 C18 -24 30 -4 28 22" />
    <path d="M-2 -24 C-8 -14 -12 -6 -12 10" />
    <path d="M2 -24 C8 -14 12 -6 12 10" />
  `,
  Taurus: `
    <circle cx="0" cy="8" r="16" />
    <path d="M-22 -6 C-24 -22 -12 -30 0 -28 C12 -30 24 -22 22 -6" />
    <path d="M-12 -18 C-12 -8 -8 -2 0 -2 C8 -2 12 -8 12 -18" />
  `,
  Gemini: `
    <path d="M-18 -24 H18" />
    <path d="M-18 24 H18" />
    <path d="M-10 -24 V24" />
    <path d="M10 -24 V24" />
  `,
  Cancer: `
    <path d="M-22 10 C-12 26 8 22 8 6 C8 -8 -10 -10 -20 0" />
    <path d="M22 -10 C12 -26 -8 -22 -8 -6 C-8 8 10 10 20 0" />
    <circle cx="-14" cy="8" r="4" />
    <circle cx="14" cy="-8" r="4" />
  `,
  Leo: `
    <path d="M-20 18 C-28 4 -20 -16 -4 -16 C10 -16 20 -4 18 10 C16 22 2 28 -12 22" />
    <path d="M-2 -14 C6 -24 22 -24 28 -10" />
    <circle cx="-4" cy="4" r="6" />
  `,
  Virgo: `
    <path d="M-24 22 V-20" />
    <path d="M-24 -20 C-18 -18 -12 -12 -10 -2 V22" />
    <path d="M-10 -20 C-4 -18 2 -12 4 -2 V22" />
    <path d="M4 -20 C10 -18 16 -12 18 -2 V8" />
    <path d="M18 8 C20 20 12 28 2 24" />
  `,
  Libra: `
    <path d="M-26 20 H26" />
    <path d="M-18 6 H18" />
    <path d="M-18 6 C-18 -8 -8 -18 0 -18 C8 -18 18 -8 18 6" />
  `,
  Scorpio: `
    <path d="M-24 22 V-20" />
    <path d="M-24 -20 C-18 -18 -12 -12 -10 -2 V22" />
    <path d="M-10 -20 C-4 -18 2 -12 4 -2 V22" />
    <path d="M4 -20 C10 -18 16 -12 18 -2 V18" />
    <path d="M18 18 L28 10" />
    <path d="M20 8 H30" />
  `,
  Sagittarius: `
    <path d="M-20 20 L24 -24" />
    <path d="M10 -24 H24 V-10" />
    <path d="M-20 4 C-10 2 -2 2 6 8" />
    <path d="M-12 12 C-4 10 4 10 12 16" />
  `,
  Capricorn: `
    <path d="M-24 18 V-20" />
    <path d="M-24 -20 C-14 -18 -10 -8 -8 6" />
    <path d="M-8 6 C-6 20 6 26 16 20 C26 14 24 0 14 -2 C6 -4 0 2 0 10" />
  `,
  Aquarius: `
    <path d="M-26 -4 L-14 -12 L-2 -4 L10 -12 L22 -4" />
    <path d="M-26 14 L-14 6 L-2 14 L10 6 L22 14" />
  `,
  Pisces: `
    <path d="M-18 -20 C-6 -10 -6 10 -18 20" />
    <path d="M18 -20 C6 -10 6 10 18 20" />
    <path d="M-10 0 H10" />
  `
};

export interface ZodiacIconOptions {
  sign: ZodiacSign;
  x: number;
  y: number;
  size: number;
  stroke?: string;
  opacity?: number;
}

export const renderZodiacIcon = ({
  sign,
  x,
  y,
  size,
  stroke = "rgba(232,227,216,0.82)",
  opacity = 1
}: ZodiacIconOptions): string => {
  const path = iconPaths[sign];

  return `
    <g transform="translate(${x}, ${y}) scale(${size / 100})" fill="none" stroke="${stroke}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">
      ${path}
    </g>
  `;
};
