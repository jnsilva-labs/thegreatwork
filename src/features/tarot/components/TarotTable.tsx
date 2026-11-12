'use client';

import React from 'react';
import { SpreadType } from '../types';

type GhostPosition = {
  x: number;
  y: number;
  rotate?: number;
};

/**
 * Where each of the ten ghost cards sits, per spread. Cards a spread does
 * not use collapse into the deck's position and fade out, so changing the
 * spread reads as the table re-dealing itself.
 */
const SPREAD_POSITIONS: Record<SpreadType, GhostPosition[]> = {
  'one-card': [{ x: 0, y: 0 }],
  'three-card': [
    { x: -64, y: 0 },
    { x: 0, y: 0 },
    { x: 64, y: 0 },
  ],
  'celtic-cross': [
    { x: -26, y: 0 },
    { x: -26, y: 0, rotate: 90 },
    { x: -26, y: 64 },
    { x: -86, y: 0 },
    { x: -26, y: -64 },
    { x: 34, y: 0 },
    { x: 104, y: 78 },
    { x: 104, y: 26 },
    { x: 104, y: -26 },
    { x: 104, y: -78 },
  ],
};

const DECK_LAYERS = [
  { rotate: -3.2, dx: -2, dy: 2 },
  { rotate: 1.6, dx: 1, dy: 0 },
  { rotate: 0, dx: 0, dy: 0 },
];

function CardBack() {
  return (
    <svg viewBox="0 0 72 116" fill="none" aria-hidden="true" className="h-full w-full">
      <rect x="1" y="1" width="70" height="114" rx="4" className="fill-[color:var(--panel)]" stroke="color-mix(in srgb, var(--gilt) 72%, transparent)" />
      <rect x="6" y="6" width="60" height="104" rx="2" stroke="color-mix(in srgb, var(--gilt) 42%, transparent)" strokeWidth="0.75" />
      <path
        d="M36 26C38.2 42.5 47.5 51.8 64 54C47.5 56.2 38.2 65.5 36 82C33.8 65.5 24.5 56.2 8 54C24.5 51.8 33.8 42.5 36 26Z"
        transform="translate(0, 4)"
        stroke="color-mix(in srgb, var(--gilt) 85%, transparent)"
        strokeWidth="1"
      />
      <circle cx="36" cy="58" r="3" stroke="color-mix(in srgb, var(--gilt) 60%, transparent)" strokeWidth="0.75" />
      {[
        [11, 11],
        [61, 11],
        [11, 105],
        [61, 105],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.1" className="fill-[color:var(--gilt)]/70" />
      ))}
    </svg>
  );
}

type TarotTableProps = {
  spread: SpreadType;
  motionOk: boolean;
};

/**
 * The reading table: a face-down deck waiting at the left, and the chosen
 * spread's shape dealt out in ghost cards that glide to their new places
 * when the spread changes. Decorative only — the real controls stay in the
 * form below.
 */
export const TarotTable: React.FC<TarotTableProps> = ({ spread, motionOk }) => {
  const positions = SPREAD_POSITIONS[spread] ?? SPREAD_POSITIONS['one-card'];
  const maxGhosts = 10;

  return (
    <div aria-hidden="true" className="tarot-table relative mx-auto w-full max-w-3xl" data-motion={motionOk ? 'on' : 'off'}>
      <div className="relative flex h-[260px] items-center overflow-hidden">
        {/* The deck */}
        <div className="tarot-deck relative ml-2 h-[116px] w-[72px] shrink-0 sm:ml-4">
          {DECK_LAYERS.map((layer, index) => (
            <div
              key={index}
              className="absolute inset-0"
              style={{ transform: `translate(${layer.dx}px, ${layer.dy}px) rotate(${layer.rotate}deg)` }}
            >
              <CardBack />
            </div>
          ))}
        </div>

        {/* The spread field */}
        <div className="relative h-full flex-1">
          <div className="absolute left-[55%] top-1/2 scale-[0.78] sm:scale-100">
            {Array.from({ length: maxGhosts }).map((_, index) => {
              const position = positions[index];
              const active = position !== undefined;
              return (
                <div
                  key={index}
                  className={`tarot-ghost absolute left-0 top-0 h-[84px] w-[52px] -translate-x-1/2 -translate-y-1/2 sm:h-[96px] sm:w-[60px] ${active ? 'tarot-ghost--active' : ''}`}
                  style={{
                    transform: `translate(calc(-50% + ${(position?.x ?? -260) * 1}px), calc(-50% + ${(position?.y ?? 0) * 1}px)) rotate(${position?.rotate ?? 0}deg) scale(${active ? 1 : 0.6})`,
                    transitionDelay: motionOk ? `${index * 45}ms` : '0ms',
                  }}
                >
                  <div className="tarot-ghost__face h-full w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotTable;
