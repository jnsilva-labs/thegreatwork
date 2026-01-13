import type { GreatWorkGlyphId } from "@/data/greatWork";

type AlchemyGlyphProps = {
  id: GreatWorkGlyphId;
  className?: string;
};

export function AlchemyGlyph({ id, className }: AlchemyGlyphProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {id === "ouroboros" && (
          <>
            <circle cx="32" cy="32" r="20" />
            <path d="M44 16c3 0 6 3 7 6-3-1-5-1-7 2-2 2-4 3-7 3 2-3 4-6 7-11Z" />
          </>
        )}
        {id === "athanor" && (
          <>
            <rect x="18" y="16" width="28" height="36" rx="4" />
            <path d="M24 40h16" />
            <path d="M28 28h8" />
            <path d="M24 52h16" />
          </>
        )}
        {id === "retort" && (
          <>
            <circle cx="28" cy="32" r="12" />
            <path d="M36 24l12-6" />
            <path d="M44 18l4 8" />
          </>
        )}
        {id === "sun" && (
          <>
            <circle cx="32" cy="32" r="18" />
            <circle cx="32" cy="32" r="4" />
          </>
        )}
        {id === "moon" && (
          <>
            <circle cx="32" cy="32" r="18" />
            <circle cx="38" cy="26" r="16" stroke="none" fill="currentColor" />
          </>
        )}
        {id === "mercury" && (
          <>
            <circle cx="32" cy="30" r="10" />
            <path d="M22 16c5 6 15 6 20 0" />
            <path d="M32 40v12" />
            <path d="M26 48h12" />
          </>
        )}
        {id === "sulfur" && (
          <>
            <path d="M32 14l10 16H22l10-16Z" />
            <path d="M32 30v18" />
            <path d="M24 48h16" />
          </>
        )}
        {id === "salt" && (
          <>
            <circle cx="32" cy="32" r="18" />
            <path d="M16 32h32" />
          </>
        )}
      </g>
    </svg>
  );
}
