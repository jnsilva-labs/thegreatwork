"use client";

import { useRouter } from "next/navigation";
import { principleSlugs } from "@/data/principles";

export function useChapterNavigation() {
  const router = useRouter();

  const goToChapter = (index: number) => {
    const slug = principleSlugs[index];
    const el = slug ? document.getElementById(slug) : null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (slug) {
      router.push(`/principles/${slug}`);
    }
  };

  return { goToChapter, slugs: principleSlugs };
}
