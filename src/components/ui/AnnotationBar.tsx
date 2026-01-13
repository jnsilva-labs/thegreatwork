"use client";

import { useHermeticStore } from "@/lib/hermeticStore";
import { useUiStore } from "@/lib/uiStore";
import { principles } from "@/data/principles";

export function AnnotationBar() {
  const activeChapter = useHermeticStore((state) => state.activeChapter);
  const showUi = useUiStore((state) => state.showUi);

  return (
    <div
      className={`pointer-events-none fixed bottom-6 left-1/2 z-20 w-[90%] max-w-3xl -translate-x-1/2 rounded-full border border-[color:var(--copper)]/40 bg-[color:var(--char)]/60 px-6 py-3 text-center text-[0.7rem] uppercase tracking-[0.35em] text-[color:var(--mist)] backdrop-blur-md transition-opacity ${
        showUi ? "opacity-100" : "opacity-0"
      }`}
    >
      {principles[activeChapter]?.short}
    </div>
  );
}
