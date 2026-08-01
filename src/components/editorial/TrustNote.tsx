import type { ReactNode } from "react";
import { TrackedLink } from "@/components/analytics/TrackedLink";

type TrustNoteProps = {
  heading: ReactNode;
  children: ReactNode;
  eyebrow?: ReactNode;
  headingLevel?: "h2" | "h3" | "h4";
  link?: {
    href: string;
    label: string;
  };
  className?: string;
};

export function TrustNote({
  heading,
  children,
  eyebrow = "Method note",
  headingLevel = "h3",
  link,
  className,
}: TrustNoteProps) {
  const Heading = headingLevel;

  return (
    <aside className={`trust-note open-field ${className ?? ""}`}>
      {eyebrow ? <p className="type-eyebrow trust-note__eyebrow">{eyebrow}</p> : null}
      <Heading className="trust-note__heading">{heading}</Heading>
      <div className="trust-note__body">{children}</div>
      {link ? (
        <TrackedLink
          href={link.href}
          location="trust-note"
          label={link.label}
          variant="trust-note"
          className="trust-note__link"
        >
          {link.label}
        </TrackedLink>
      ) : null}
    </aside>
  );
}
