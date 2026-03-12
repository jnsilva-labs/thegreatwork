"use client";

export function FallbackEngraving() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
      <div className="fallback-engraving-shell rounded-full border border-[color:var(--copper)]/32 bg-[color:var(--char)]/54 p-8 backdrop-blur-sm sm:p-10">
        <svg viewBox="0 0 600 600" className="fallback-engraving h-72 w-72 text-[color:var(--gilt)] sm:h-80 sm:w-80">
          <g className="fallback-engraving__flower" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7">
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <circle
                key={`c-${angle}`}
                cx={300 + Math.cos((angle * Math.PI) / 180) * 100}
                cy={300 + Math.sin((angle * Math.PI) / 180) * 100}
                r={120}
              />
            ))}
            <circle cx="300" cy="300" r="120" />
          </g>
          <g className="fallback-engraving__frame" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5">
            <polygon points="300,120 455,210 455,390 300,480 145,390 145,210" />
            <polygon points="300,60 515,180 515,420 300,540 85,420 85,180" />
          </g>
        </svg>
      </div>
    </div>
  );
}
