import { notFound } from "next/navigation";
import { principles } from "@/data/principles";

export default async function PrincipleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const principle = principles.find((item) => item.slug === slug);
  if (!principle) {
    notFound();
  }

  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl space-y-10">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
            {principle.title}
          </p>
          <h1 className="font-ritual text-5xl sm:text-6xl">{principle.axiom}</h1>
          <p className="text-lg text-[color:var(--mist)]">{principle.short}</p>
        </header>

        <section className="space-y-6 text-[color:var(--mist)]">
          <p className="text-base leading-relaxed sm:text-lg">{principle.body}</p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--char)]/40 p-6">
            <h2 className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
              Keys
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-[color:var(--bone)]">
              {principle.keys.map((key) => (
                <li key={key}>— {key}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[color:var(--copper)]/40 bg-[color:var(--char)]/40 p-6">
            <h2 className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
              Practice
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-[color:var(--bone)]">
              {principle.practice.map((prompt) => (
                <li key={prompt}>— {prompt}</li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="border-t border-[color:var(--copper)]/40 pt-6 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
          Axioms and sequence follow The Kybalion (1908).
        </footer>
      </div>
    </div>
  );
}
