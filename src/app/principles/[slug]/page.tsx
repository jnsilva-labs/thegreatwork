import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { principles } from "@/data/principles";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo/schema";

type RouteParams = { slug: string };

export function generateStaticParams(): RouteParams[] {
  return principles.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const principle = principles.find((item) => item.slug === slug);

  if (!principle) {
    return buildPageMetadata({
      title: "Principle Not Found",
      path: `/principles/${slug}`,
      description: "Requested Hermetic principle was not found.",
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${principle.title} (Hermetic Principle)`,
    path: `/principles/${principle.slug}`,
    description: `${principle.axiom} ${principle.short}`,
    keywords: [principle.title, "Hermetic principle", "Kybalion", ...principle.keys],
  });
}

export default async function PrincipleDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const principle = principles.find((item) => item.slug === slug);
  if (!principle) {
    notFound();
  }
  const index = principles.findIndex((item) => item.slug === principle.slug);
  const previousPrinciple = index > 0 ? principles[index - 1] : null;
  const nextPrinciple = index < principles.length - 1 ? principles[index + 1] : null;

  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl space-y-10">
        <JsonLd
          id={`principle-breadcrumb-${principle.slug}`}
          data={buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Hermetic Principles", path: "/principles" },
            { name: principle.title, path: `/principles/${principle.slug}` },
          ])}
        />
        <JsonLd
          id={`principle-webpage-${principle.slug}`}
          data={buildWebPageSchema({
            name: `${principle.title} — Hermetic Principle`,
            path: `/principles/${principle.slug}`,
            description: `${principle.axiom} ${principle.short}`,
          })}
        />
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-[color:var(--mist)]"
        >
          <Link href="/" className="transition hover:text-[color:var(--bone)]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/principles" className="transition hover:text-[color:var(--bone)]">
            Principles
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[color:var(--bone)]">{principle.title}</span>
        </nav>
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

        <nav
          aria-label="Related principle navigation"
          className="grid gap-4 rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--char)]/40 p-5 sm:grid-cols-2"
        >
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
              Continue the Sequence
            </p>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em]">
              {previousPrinciple ? (
                <Link
                  href={`/principles/${previousPrinciple.slug}`}
                  className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 transition hover:border-[color:var(--gilt)]"
                >
                  Previous: {previousPrinciple.title}
                </Link>
              ) : null}
              {nextPrinciple ? (
                <Link
                  href={`/principles/${nextPrinciple.slug}`}
                  className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 transition hover:border-[color:var(--gilt)]"
                >
                  Next: {nextPrinciple.title}
                </Link>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
              Related Paths
            </p>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em]">
              <Link
                href="/principles"
                className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 transition hover:border-[color:var(--gilt)]"
              >
                All Principles
              </Link>
              <Link
                href="/gallery"
                className="rounded-full border border-[color:var(--copper)]/60 px-4 py-2 transition hover:border-[color:var(--gilt)]"
              >
                Sacred Geometry
              </Link>
            </div>
          </div>
        </nav>

        <footer className="border-t border-[color:var(--copper)]/40 pt-6 text-xs uppercase tracking-[0.35em] text-[color:var(--mist)]">
          Axioms and sequence follow The Kybalion (1908).
        </footer>
      </div>
    </div>
  );
}
