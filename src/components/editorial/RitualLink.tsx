import type { ReactNode } from "react";
import { TrackedLink } from "@/components/analytics/TrackedLink";

type RitualLinkProps = {
  href: string;
  children: ReactNode;
  location: string;
  label: string;
  tone?: "gilt" | "quiet";
  className?: string;
};

export function RitualLink({
  href,
  children,
  location,
  label,
  tone = "gilt",
  className,
}: RitualLinkProps) {
  return (
    <TrackedLink
      href={href}
      location={location}
      label={label}
      variant={`ritual-${tone}`}
      className={`ritual-link ritual-link--${tone} inline-flex min-h-[44px] items-center ${className ?? ""}`}
    >
      <span>{children}</span>
      <span className="ritual-link__mark" aria-hidden="true">
        ↗
      </span>
    </TrackedLink>
  );
}
