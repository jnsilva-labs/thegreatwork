import type { ReactNode } from "react";
import { TrackedLink } from "@/components/analytics/TrackedLink";

type TrustNoteProps = {
  heading: ReactNode;
  children: ReactNode;
  link?: {
    href: string;
    label: string;
  };
  className?: string;
};

export function TrustNote({ heading, children, link, className }: TrustNoteProps) {
  return (
    <aside className={`trust-note open-field ${className ?? ""}`}>
      <h3 className="trust-note__heading">{heading}</h3>
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
