"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/track";

type TrackedLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  location: string;
  label: string;
  variant?: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

const isExternalHref = (href: string): boolean => {
  return href.startsWith("https://") || href.startsWith("http://");
};

export function TrackedLink({
  href,
  children,
  className,
  location,
  label,
  variant = "link",
  target,
  rel,
  onClick
}: TrackedLinkProps) {
  const external = isExternalHref(href);

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    trackEvent("site_cta_click", {
      location,
      label,
      href,
      variant,
      external
    });

    onClick?.(event);
  };

  if (external) {
    return (
      <a
        href={href}
        target={target ?? "_blank"}
        rel={rel ?? "noopener noreferrer"}
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
