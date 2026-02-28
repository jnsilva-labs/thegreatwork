import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Thank You",
  path: "/thank-you/starter-guide",
  description: "Thanks for requesting the Hermetic Principles Starter Guide.",
  noIndex: true,
});

export default function StarterGuideThankYouPage() {
  return (
    <div className="min-h-screen px-6 py-20 text-[color:var(--bone)] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-4xl space-y-10 rounded-2xl border border-[color:var(--copper)]/30 bg-[color:var(--char)]/45 p-8 sm:p-10">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">Free Guide</p>
          <h1 className="font-ritual text-4xl sm:text-5xl">Your guide is ready</h1>
          <p className="text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
            Download the <strong className="text-[color:var(--bone)]">7 Hermetic Principles Starter Guide</strong> below.
            Read one principle at a time. Let one idea become an instrument before moving to the next.
          </p>
        </header>

        <a
          href="https://cziuwes8ddupfrhu.public.blob.vercel-storage.com/hermetic-principles-starter-guide.pdf"
          download
          className="inline-flex min-h-[52px] items-center justify-center self-start rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/15 px-8 py-3 text-sm uppercase tracking-[0.3em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)] hover:bg-[color:var(--gilt)]/25"
        >
          Download the PDF
        </a>

        <section className="space-y-4">
          <h2 className="font-ritual text-2xl">What to do next</h2>
          <ol className="space-y-3 text-sm leading-relaxed text-[color:var(--mist)]">
            <li>1. Read one principle at a time. Do not rush through all seven.</li>
            <li>2. Choose the principle that feels most active in your life right now and sit with it for a few days.</li>
            <li>3. Return to the site to go deeper — astrology, tarot, and the full practice path await.</li>
          </ol>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/start-here"
            className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-5 py-2 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
          >
            Go to Start Here
          </Link>
          <Link
            href="/principles"
            className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-5 py-2 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
          >
            Read the Principles
          </Link>
          <Link
            href="/letters"
            className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-5 py-2 text-xs uppercase tracking-[0.28em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
          >
            Weekly Letters
          </Link>
        </div>
      </div>
    </div>
  );
}
