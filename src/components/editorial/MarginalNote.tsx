import type { ReactNode } from "react";

type MarginalNoteProps = {
  heading?: ReactNode;
  children: ReactNode;
  glyph?: ReactNode;
  className?: string;
};

export function MarginalNote({ heading, children, glyph = "✦", className }: MarginalNoteProps) {
  return (
    <aside className={`marginalia ${className ?? ""}`} aria-label={typeof heading === "string" ? heading : undefined}>
      <span className="marginalia__glyph" aria-hidden="true">
        {glyph}
      </span>
      <div>
        {heading ? <h3 className="marginalia__heading">{heading}</h3> : null}
        <div className="marginalia__body">{children}</div>
      </div>
    </aside>
  );
}
