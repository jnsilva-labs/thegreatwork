import type { ReactNode } from "react";

type OraclePanelProps = {
  heading: ReactNode;
  children: ReactNode;
  eyebrow?: ReactNode;
  footer?: ReactNode;
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
};

export function OraclePanel({
  heading,
  children,
  eyebrow,
  footer,
  headingLevel = "h2",
  className,
}: OraclePanelProps) {
  const Heading = headingLevel;

  return (
    <section className={`oracle-room ${className ?? ""}`} aria-label={typeof heading === "string" ? heading : undefined}>
      <header className="oracle-room__header">
        {eyebrow ? <p className="type-eyebrow oracle-room__eyebrow">{eyebrow}</p> : null}
        <Heading className="type-title font-ritual oracle-room__title">{heading}</Heading>
      </header>
      <div className="oracle-room__body">{children}</div>
      {footer ? <footer className="oracle-room__footer">{footer}</footer> : null}
    </section>
  );
}
