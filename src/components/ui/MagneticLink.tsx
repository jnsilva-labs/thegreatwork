"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useUiStore } from "@/lib/uiStore";

type MagneticLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  location: string;
  label: string;
  variant?: string;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function MagneticLink({
  href,
  children,
  className,
  location,
  label,
  variant,
  target,
  rel,
  onClick,
}: MagneticLinkProps) {
  const reducedMotion = usePrefersReducedMotion();
  const stillness = useUiStore((state) => state.stillness);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const disabled =
    reducedMotion ||
    stillness ||
    (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches);

  const style = useMemo(() => {
    if (disabled) return undefined;
    return {
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    } as CSSProperties;
  }, [disabled, offset.x, offset.y]);

  return (
    <TrackedLink
      href={href}
      className={`${className ?? ""} magnetic-link`}
      location={location}
      label={label}
      variant={variant}
      target={target}
      rel={rel}
      onClick={onClick}
      onMouseMove={
        disabled
          ? undefined
          : (event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const deltaX = event.clientX - (rect.left + rect.width / 2);
              const deltaY = event.clientY - (rect.top + rect.height / 2);
              setOffset({
                x: Math.max(-4, Math.min(4, deltaX * 0.08)),
                y: Math.max(-4, Math.min(4, deltaY * 0.08)),
              });
            }
      }
      onMouseLeave={
        disabled
          ? undefined
          : () => {
              setOffset({ x: 0, y: 0 });
            }
      }
      style={style}
    >
      {children}
    </TrackedLink>
  );
}
