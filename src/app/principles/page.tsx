import Link from "next/link";
import { principles } from "@/data/principles";

export default function PrinciplesIndexPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            Hermetic Principles
          </p>
          <h1 className="font-ritual text-5xl sm:text-6xl">Principles Index</h1>
          <p className="max-w-2xl text-base text-[color:var(--mist)] sm:text-lg">
            Each principle is presented in the canonical order with axiom, marginalia,
            and a brief practice.
          </p>
        </header>

        <div className="divide-y divide-[color:var(--copper)]/30">
          {principles.map((principle, index) => (
            <Link
              key={principle.slug}
              href={`/principles/${principle.slug}`}
              className="group block py-6 transition hover:text-[color:var(--bone)]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
                    {"I II III IV V VI VII".split(" ")[index]}
                  </div>
                  <h2 className="font-ritual text-3xl">{principle.title}</h2>
                </div>
                <p className="max-w-md text-sm text-[color:var(--mist)]">
                  {principle.short}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <footer className="border-t border-[color:var(--copper)]/40 pt-6 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
          Axioms and sequence follow The Kybalion (1908).
        </footer>
      </div>
    </div>
  );
}
