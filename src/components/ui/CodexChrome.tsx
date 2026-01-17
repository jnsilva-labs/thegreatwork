"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUiStore } from "@/lib/uiStore";
import { principles } from "@/data/principles";

const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII"];

export function CodexChrome() {
  const showUi = useUiStore((state) => state.showUi);
  const pathname = usePathname();
  const activeSlug = pathname?.startsWith("/principles/") ? pathname.split("/")[2] : "";

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const slugs = principles.map((principle) => principle.slug);
    const hasMissing = slugs.some((slug) => !slug);
    const unique = new Set(slugs);
    if (hasMissing || unique.size !== slugs.length) {
      console.warn("[CodexChrome] Principle slugs must be defined and unique.", slugs);
    }
  }, []);

  return (
    <>
      <nav
        className={`pointer-events-auto fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:flex ${
          showUi ? "opacity-100" : "opacity-0"
        } transition-opacity`}
      >
        <ol className="flex flex-col gap-4 border-l border-[color:var(--copper)]/40 pl-4 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
          {principles.map((principle, index) => (
            <li key={principle.slug}>
              <Link
                href={`/principles/${principle.slug}`}
                className={`group flex items-center gap-4 transition-colors hover:text-[color:var(--bone)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[color:var(--gilt)] ${
                  activeSlug === principle.slug ? "text-[color:var(--bone)]" : ""
                }`}
              >
                <span className="font-ritual text-sm text-[color:var(--gilt)]">
                  {romanNumerals[index]}
                </span>
                <span className="hidden whitespace-nowrap text-[0.65rem] tracking-[0.4em] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline">
                  {principle.title}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>

    </>
  );
}
