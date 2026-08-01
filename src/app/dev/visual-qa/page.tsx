import type { Metadata } from "next";
import { VisualQaFixtures } from "@/components/dev/VisualQaFixtures";

export const metadata: Metadata = {
  title: "Visual QA — Awareness Paradox",
  description: "Deterministic internal fixtures for the Awareness Paradox visual system.",
  robots: { index: false, follow: false },
};

export default function VisualQaPage() {
  return (
    <div className="min-h-screen px-6 py-16 text-[color:var(--bone)] sm:px-10 lg:px-20" data-visual-qa-page="editorial-primitives">
      <div className="mx-auto max-w-6xl">
        <header className="mb-20 max-w-3xl space-y-4 border-b border-[color:var(--copper)]/30 pb-8">
          <p className="type-eyebrow text-[color:var(--gilt)]">Internal · Deterministic · No API calls</p>
          <h1 className="type-display font-ritual">Visual QA</h1>
          <p className="type-body text-[color:var(--mist)]">
            Editorial primitives rendered against the active theme for responsive, accessibility, and material review.
          </p>
        </header>
        <VisualQaFixtures />
      </div>
    </div>
  );
}
