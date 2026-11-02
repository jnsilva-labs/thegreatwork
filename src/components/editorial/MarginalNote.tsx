import type { ReactNode } from "react";
import { Ornament, ornamentFromGlyph } from "./Ornament";

type MarginalNoteProps = {
  heading?: ReactNode;
  children: ReactNode;
  glyph?: ReactNode;
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
};

export function MarginalNote({
  heading,
  children,
  glyph = "✦",
  headingLevel = "h3",
  className,
}: MarginalNoteProps) {
  const Heading = headingLevel;

  return (
    <aside className={`marginalia ${className ?? ""}`} aria-label={typeof heading === "string" ? heading : undefined}>
      <span className="marginalia__glyph" aria-hidden="true">
        {typeof glyph === "string" ? (
          <Ornament name={ornamentFromGlyph(glyph)} className="inline-block h-[1.15em] w-[1.15em]" />
        ) : (
          glyph
        )}
      </span>
      <div>
        {heading ? <Heading className="marginalia__heading">{heading}</Heading> : null}
        <div className="marginalia__body">{children}</div>
      </div>
    </aside>
  );
}
