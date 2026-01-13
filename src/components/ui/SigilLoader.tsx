"use client";

import { useEffect, useState } from "react";

export function SigilLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(timeout);
  }, []);

  if (ready) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[color:var(--obsidian)]/90">
      <div className="flex flex-col items-center gap-4 text-[0.6rem] uppercase tracking-[0.5em] text-[color:var(--mist)]">
        <svg viewBox="0 0 120 120" className="h-16 w-16">
          <circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="sigil-draw"
          />
        </svg>
        Forming the sigil
      </div>
    </div>
  );
}
