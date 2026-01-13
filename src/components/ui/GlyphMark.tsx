"use client";

const glyphPaths = [
  "M12 2a10 10 0 1 0 0.001 0Z",
  "M4 4h16v16H4z",
  "M12 3l9 16H3z",
  "M4 12c4-6 12-6 16 0-4 6-12 6-16 0Z",
  "M5 5h14v14H5z M8 8h8v8H8z",
  "M4 12h16M12 4v16",
  "M6 6c3-3 9-3 12 0-3 3-9 3-12 0Z M6 18c3 3 9 3 12 0",
];

type GlyphMarkProps = {
  index: number;
};

export function GlyphMark({ index }: GlyphMarkProps) {
  const path = glyphPaths[index] ?? glyphPaths[0];

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-10 w-10 text-[color:var(--gilt)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d={path} />
    </svg>
  );
}
