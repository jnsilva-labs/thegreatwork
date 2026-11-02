import type { SVGProps } from "react";

export type OrnamentName = "star" | "lozenge" | "ring" | "mandorla";

/** Maps the typed glyph characters the editorial components used to accept. */
export function ornamentFromGlyph(glyph: string): OrnamentName {
  switch (glyph) {
    case "◇":
      return "lozenge";
    case "◎":
      return "ring";
    case "⟐":
      return "mandorla";
    case "✦":
    default:
      return "star";
  }
}

type OrnamentProps = SVGProps<SVGSVGElement> & {
  name?: OrnamentName;
};

/**
 * Drawn hairline ornaments in the engraving style, replacing typed glyph
 * characters (✦ ◇ ◎ ⟐) that rendered as thin system-font symbols. Strokes
 * inherit currentColor so the gilt/mist text colors keep working.
 */
export function Ornament({ name = "star", ...props }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      {...props}
    >
      {name === "star" && (
        <>
          <path d="M12 3C12.7 8.2 15.8 11.3 21 12C15.8 12.7 12.7 15.8 12 21C11.3 15.8 8.2 12.7 3 12C8.2 11.3 11.3 8.2 12 3Z" />
          <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "lozenge" && (
        <>
          <path d="M12 4L20 12L12 20L4 12Z" />
          <path d="M12 8.5L15.5 12L12 15.5L8.5 12Z" opacity="0.55" />
        </>
      )}
      {name === "ring" && (
        <>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3.2" opacity="0.7" />
          <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "mandorla" && (
        <>
          <path d="M12 4C15.6 6 17.4 8.7 17.4 12C17.4 15.3 15.6 18 12 20C8.4 18 6.6 15.3 6.6 12C6.6 8.7 8.4 6 12 4Z" />
          <path d="M12 7.5V16.5" opacity="0.55" />
        </>
      )}
    </svg>
  );
}
