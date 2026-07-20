import type { ReactNode } from "react";

type OraclePanelProps = {
  heading: ReactNode;
  children: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function OraclePanel({ heading, children, eyebrow, footer, className }: OraclePanelProps) {
  return (
    <section className={`oracle-room ${className ?? ""}`} aria-label={typeof heading === "string" ? heading : undefined}>
      <header className="oracle-room__header">
        {eyebrow ? <p className="type-eyebrow oracle-room__eyebrow">{eyebrow}</p> : null}
        <h2 className="type-title font-ritual oracle-room__title">{heading}</h2>
      </header>
      <div className="oracle-room__body">{children}</div>
      {footer ? <footer className="oracle-room__footer">{footer}</footer> : null}
    </section>
  );
}
