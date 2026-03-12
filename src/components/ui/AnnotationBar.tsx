"use client";

import { usePathname } from "next/navigation";
import { useHermeticStore } from "@/lib/hermeticStore";
import { useUiStore } from "@/lib/uiStore";
import { principles } from "@/data/principles";
import { trackedSections } from "@/data/homepage";

export function AnnotationBar() {
  const activeChapter = useHermeticStore((state) => state.activeChapter);
  const scrollProgress = useHermeticStore((state) => state.scrollProgress);
  const showUi = useUiStore((state) => state.showUi);
  const pathname = usePathname();

  const isHomepage = pathname === "/";
  const annotation = isHomepage
    ? trackedSections[activeChapter]?.subtitle ?? trackedSections[activeChapter]?.title
    : principles[activeChapter]?.short;
  const opacity = isHomepage
    ? scrollProgress < 0.15
      ? 1 - scrollProgress * 4.6
      : scrollProgress < 0.3
        ? 0.3 - (scrollProgress - 0.15)
        : 0.15
    : 1;
  const marquee = `${annotation}  •  ${annotation}  •  ${annotation}  •  ${annotation}`;

  return (
    <div
      className={`annotation-bar pointer-events-none fixed bottom-4 left-1/2 z-20 w-[92%] max-w-4xl -translate-x-1/2 overflow-hidden rounded-full border border-[color:var(--copper)]/32 bg-[color:var(--char)]/52 px-4 py-2 text-center text-[0.62rem] uppercase tracking-[0.35em] text-[color:var(--mist)] backdrop-blur-md transition-opacity sm:bottom-6 sm:px-6 ${
        showUi ? "opacity-100" : "opacity-0"
      }`}
      style={{ opacity: showUi ? opacity : 0 }}
    >
      <div className="annotation-bar__track">
        <span>{marquee}</span>
        <span aria-hidden="true">{marquee}</span>
      </div>
    </div>
  );
}
