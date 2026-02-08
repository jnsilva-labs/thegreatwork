"use client";

import { socialLinks } from "@/data/homepage";

type SocialLinksProps = {
  variant?: "prominent" | "compact";
};

export function SocialLinks({ variant = "compact" }: SocialLinksProps) {
  const isProminent = variant === "prominent";

  return (
    <div
      className={`flex items-center ${
        isProminent ? "gap-6 flex-wrap" : "gap-4"
      }`}
    >
      {socialLinks.map((link) => (
        <a
          key={link.platform}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={`group flex items-center justify-center transition-colors text-[color:var(--mist)] hover:text-[color:var(--gilt)] ${
            isProminent ? "gap-3 min-h-[44px] py-2" : "min-w-[44px] min-h-[44px]"
          }`}
        >
          <SocialIcon
            platform={link.platform}
            size={isProminent ? 24 : 18}
          />
          {isProminent && (
            <span className="text-xs uppercase tracking-[0.3em]">
              {link.label}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}

function SocialIcon({
  platform,
  size = 18,
}: {
  platform: string;
  size?: number;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (platform) {
    case "instagram":
      return (
        <svg {...props}>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...props}>
          <rect x="2" y="4" width="20" height="16" rx="4" />
          <polygon
            points="10,8.5 16,12 10,15.5"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...props}>
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );
    case "x":
      return (
        <svg {...props}>
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      );
    default:
      return null;
  }
}
