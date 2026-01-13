import { useId } from "react";

type OuroborosProps = {
  className?: string;
};

export function Ouroboros({ className }: OuroborosProps) {
  const gradientId = useId();

  return (
    <svg
      className={className}
      viewBox="0 0 220 220"
      role="img"
      aria-label="Ouroboros emblem"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8e3d8" />
          <stop offset="100%" stopColor="#b89b5e" />
        </linearGradient>
      </defs>
      <g className="ouroboros">
        <circle
          className="ouroboros-ring"
          cx="110"
          cy="110"
          r="72"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M168 58c8 0 16 7 18 16-7-2-13-1-18 4-6 5-12 7-20 6 5-8 10-15 20-26Z"
          fill="#e8e3d8"
          opacity="0.9"
        />
        <circle cx="170" cy="66" r="2.5" fill="#0b0c10" />
      </g>
    </svg>
  );
}
