import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function baseProps(size: number | undefined, props: IconProps) {
  const rest: IconProps = { ...props };
  delete (rest as { size?: number }).size;
  return {
    width: size ?? 16,
    height: size ?? 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
}

function DotIcon(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export function Sparkles(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
      <path d="M5 16l.9 2.1L8 19l-2.1.9L5 22l-.9-2.1L2 19l2.1-.9L5 16Z" />
      <path d="M19 14l.7 1.5 1.6.7-1.6.7-.7 1.6-.7-1.6-1.5-.7 1.5-.7.7-1.5Z" />
    </svg>
  );
}

export function CircleDot(props: IconProps) {
  return <DotIcon {...props} />;
}

export function Triangle(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M12 4 20 19H4L12 4Z" />
    </svg>
  );
}

export function Infinity(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M7.5 15.5c1.8 0 3-1.3 4.5-3.5 1.5-2.2 2.7-3.5 4.5-3.5 2.2 0 4 1.8 4 4s-1.8 4-4 4c-1.8 0-3-1.3-4.5-3.5-1.5-2.2-2.7-3.5-4.5-3.5-2.2 0-4 1.8-4 4s1.8 4 4 4Z" />
    </svg>
  );
}

export function ExternalLink(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function Loader2(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
    </svg>
  );
}

export function Save(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M5 4h12l2 2v14H5z" />
      <path d="M8 4v6h8V4" />
      <path d="M8 19h8" />
    </svg>
  );
}

export function X(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function Share2(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.7 10.7 6.6-3.4" />
      <path d="m8.7 13.3 6.6 3.4" />
    </svg>
  );
}

export function Eye(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function Key(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9" />
      <path d="M18 12v3" />
      <path d="M21 12v2" />
    </svg>
  );
}

export function AlertTriangle(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M12 3 22 20H2L12 3Z" />
      <path d="M12 9v5" />
      <path d="M12 18h.01" />
    </svg>
  );
}

export function Calendar(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  );
}

export function Search(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function Plus(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function Trash2(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 14h10l1-14" />
      <path d="M10 10v6M14 10v6" />
    </svg>
  );
}

export function Link(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M10.5 13.5 8 16a4 4 0 1 1-5.6-5.6L5 7.8" />
      <path d="m13.5 10.5 2.5-2.5a4 4 0 1 1 5.6 5.6L19 16.2" />
      <path d="m9 15 6-6" />
    </svg>
  );
}

export function Info(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}

export function ShieldCheck(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M12 3 5 6v6c0 4.5 3.1 7.5 7 9 3.9-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function Zap(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

export function ImageOff(props: IconProps) {
  return (
    <svg {...baseProps(props.size, props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 19 5-5 4 4 2-2 3 3" />
      <path d="m3 3 18 18" />
    </svg>
  );
}
