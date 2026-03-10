import { ebookData } from "@/data/ebookHermeticPrinciples";
import type { EbookPrinciple } from "@/data/ebookHermeticPrinciples";

const IMG = "/ebook/hermetic-principles";

/* ─── shared page wrapper ─── */
function Page({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`ebook-page flex flex-col ${className}`}>
      {children}
    </section>
  );
}

/* ─── page footer ─── */
function PageFooter({ pageNum }: { pageNum: number }) {
  return (
    <footer className="mt-auto flex items-center justify-between pt-6 text-[8pt] text-[color:var(--mist)]">
      <span className="tracking-[0.3em] uppercase">Awareness Paradox</span>
      <span>{pageNum}</span>
    </footer>
  );
}

/* ─── Cover (p1) ─── */
function CoverPage() {
  return (
    <Page className="relative items-center justify-center text-center">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG}/img-01-cover-the-alchemist-rijksmuseum.jpg`}
          alt=""
          className="h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--bg)] via-transparent to-[color:var(--bg)]" />
      </div>
      <div className="relative z-10 space-y-6 px-8">
        <p className="text-xs uppercase tracking-[0.5em] text-[color:var(--gilt)]">
          Awareness Paradox
        </p>
        <h1 className="font-ritual text-[42pt] leading-tight whitespace-pre-line">
          {ebookData.title}
        </h1>
        <p className="mx-auto max-w-md text-base text-[color:var(--mist)]">
          {ebookData.subtitle}
        </p>
        <div className="mx-auto mt-8 h-px w-24 bg-[color:var(--gilt)]" />
        <p className="mt-4 text-sm italic text-[color:var(--mist)]">
          &ldquo;{ebookData.coverQuote}&rdquo;
        </p>
      </div>
    </Page>
  );
}

/* ─── Welcome (p2) ─── */
function WelcomePage() {
  const { welcome } = ebookData;
  return (
    <Page className="relative">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG}/p02-wright-alchemist.jpg`}
          alt=""
          className="h-full w-full object-cover opacity-10"
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col">
      <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
        Welcome
      </p>
      <h2 className="font-ritual mt-2 text-[24pt]">How to Use This Guide</h2>
      <div className="mt-6 space-y-4 text-[11pt] leading-relaxed">
        {welcome.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-[13pt] font-semibold text-[color:var(--gilt)]">
          How to use this guide
        </h3>
        <div className="mt-3 space-y-3 text-[11pt] leading-relaxed">
          {welcome.howToUse.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
      <div className="mt-8 border-l-2 border-[color:var(--gilt)] pl-5">
        <p className="text-[10pt] uppercase tracking-[0.3em] text-[color:var(--mist)]">
          A note on approach
        </p>
        <div className="mt-2 space-y-3 text-[11pt] leading-relaxed text-[color:var(--mist)]">
          {welcome.noteOnApproach.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
      <PageFooter pageNum={2} />
      </div>
    </Page>
  );
}

/* ─── Orientation (p3) ─── */
function OrientationPage() {
  const { orientation } = ebookData;
  return (
    <Page>
      <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
        Beginner Orientation
      </p>
      <h2 className="font-ritual mt-2 text-[24pt]">
        What &ldquo;Hermetic&rdquo; Means
      </h2>
      <div className="mt-6 flex gap-6">
        <div className="flex-1 space-y-4 text-[11pt] leading-relaxed">
          {orientation.body.map((p, i) => (
            <p key={i} className={i === 3 ? "font-semibold" : ""}>
              {p}
            </p>
          ))}
        </div>
        <div className="w-[30%] shrink-0 flex flex-col items-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${IMG}/p03-hermes-trismegistus-siena.jpg`}
            alt="Hermes Trismegistus mosaic from the Cathedral of Siena"
            className="w-full rounded object-cover opacity-50"
            style={{ maxHeight: "4in" }}
          />
          <p className="mt-1 text-[7pt] text-[color:var(--mist)]">
            Hermes Trismegistus, Cathedral of Siena (1480s), public domain
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-[13pt] font-semibold text-[color:var(--gilt)]">
          A practical way to think about the seven principles
        </h3>
        <div className="mt-3 space-y-3 text-[11pt] leading-relaxed">
          {orientation.practicalWay.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <ul className="mt-3 space-y-2 pl-5 text-[11pt] leading-relaxed text-[color:var(--mist)]">
          <li>What happens if I observe my life through this lens?</li>
          <li>What becomes visible that I was missing?</li>
          <li>What changes when I practice this principle consciously?</li>
        </ul>
        <p className="mt-4 text-[11pt] italic">That is enough to begin.</p>
      </div>
      <PageFooter pageNum={3} />
    </Page>
  );
}

/* ─── Principle page (p4–p10) ─── */
function PrinciplePage({
  principle,
  pageNum,
}: {
  principle: EbookPrinciple;
  pageNum: number;
}) {
  return (
    <Page>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10pt] uppercase tracking-[0.4em] text-[color:var(--mist)]">
            Principle {principle.numeral}
          </p>
          <h2 className="font-ritual mt-1 text-[26pt]">{principle.title}</h2>
        </div>
        {/* Motif-only images rendered small */}
        {principle.image?.placement === "motif" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={principle.image.src}
            alt={principle.image.alt}
            className="h-16 w-16 rounded object-cover opacity-40"
          />
        )}
      </div>

      {/* Core phrase callout */}
      <div className="mt-5 border-l-2 border-[color:var(--gilt)] bg-[color:var(--char)] px-5 py-3">
        <p className="font-ritual text-[14pt] italic text-[color:var(--gilt)]">
          {principle.corePhrase}
        </p>
      </div>

      {/* Body + optional side image */}
      <div className="mt-5 flex gap-6">
        <div className="flex-1 space-y-3 text-[10.5pt] leading-relaxed">
          {principle.meaning.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {principle.image &&
          (principle.image.placement === "top-right" ||
            principle.image.placement === "bottom-right") && (
            <div className="w-[35%] flex-col items-end flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={principle.image.src}
                alt={principle.image.alt}
                className="w-full rounded object-cover opacity-60"
                style={{ maxHeight: "3.5in" }}
              />
              <p className="mt-1 text-[7pt] text-[color:var(--mist)]">
                {principle.image.caption}
              </p>
            </div>
          )}
        {principle.image?.placement === "left-strip" && (
          <div className="w-[30%] flex-col flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={principle.image.src}
              alt={principle.image.alt}
              className="w-full rounded object-cover opacity-50"
              style={{ maxHeight: "4in" }}
            />
            <p className="mt-1 text-[7pt] text-[color:var(--mist)]">
              {principle.image.caption}
            </p>
          </div>
        )}
      </div>

      {/* Reflection */}
      <div className="mt-5 rounded border border-[color:var(--copper)]/40 px-5 py-3">
        <p className="text-[9pt] uppercase tracking-[0.3em] text-[color:var(--copper)]">
          Beginner Reflection
        </p>
        <p className="mt-2 text-[11pt] italic leading-relaxed">
          {principle.reflection}
        </p>
      </div>

      {/* Practice */}
      <div className="mt-4 rounded bg-[color:var(--char)] px-5 py-4">
        <p className="text-[9pt] uppercase tracking-[0.3em] text-[color:var(--gilt)]">
          Practice
        </p>
        <div className="mt-2 space-y-2 text-[10.5pt] leading-relaxed">
          {principle.practice.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <PageFooter pageNum={pageNum} />
    </Page>
  );
}

/* ─── 7-Day Practice Path (p11) ─── */
function PracticePathPage() {
  const { practicePath } = ebookData;
  return (
    <Page>
      <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
        Practice
      </p>
      <div className="flex items-start justify-between">
        <h2 className="font-ritual mt-2 text-[24pt]">A 7-Day Practice Path</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG}/p11-atalanta-fugiens-emblem.jpg`}
          alt="Alchemical emblem from Atalanta Fugiens"
          className="h-16 w-16 rounded object-cover opacity-40"
        />
      </div>
      <p className="mt-4 text-[11pt] italic leading-relaxed text-[color:var(--mist)]">
        {practicePath.intro}
      </p>

      <div className="mt-6 divide-y divide-[color:var(--copper)]/20">
        {practicePath.days.map((day) => (
          <div key={day.day} className="flex gap-4 py-3">
            <div className="w-16 shrink-0">
              <p className="text-[10pt] font-semibold text-[color:var(--gilt)]">
                Day {day.day}
              </p>
              <p className="text-[8pt] uppercase tracking-widest text-[color:var(--mist)]">
                {day.principle}
              </p>
            </div>
            <p className="text-[10.5pt] leading-relaxed">{day.instruction}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded border border-[color:var(--copper)]/30 bg-[color:var(--char)] px-5 py-4">
        <p className="text-[9pt] uppercase tracking-[0.3em] text-[color:var(--gilt)]">
          Daily Format (10–15 minutes)
        </p>
        <ul className="mt-3 space-y-1 text-[10.5pt]">
          {practicePath.dailyFormat.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--gilt)]" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[10.5pt] italic text-[color:var(--mist)]">
          {practicePath.closing}
        </p>
      </div>

      <PageFooter pageNum={11} />
    </Page>
  );
}

/* ─── Closing (p12) ─── */
function ClosingPage() {
  const { closing } = ebookData;
  return (
    <Page className="relative">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG}/img-08-zodiac-man-pdia.jpg`}
          alt=""
          className="h-full w-full object-cover opacity-10"
        />
      </div>
      <div className="relative z-10 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--mist)]">
          Next Steps
        </p>
        <h2 className="font-ritual mt-2 text-[24pt]">Continue the Path</h2>

        <div className="mt-6 space-y-4 text-[11pt] leading-relaxed">
          {closing.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-8 rounded border border-[color:var(--gilt)]/30 bg-[color:var(--char)]/80 px-6 py-5">
          <p className="text-[10pt] uppercase tracking-[0.3em] text-[color:var(--gilt)]">
            Next steps inside Awareness Paradox
          </p>
          <div className="mt-4 space-y-2">
            {closing.links.map((link) => (
              <p key={link.url} className="text-[11pt]">
                <span className="text-[color:var(--mist)]">{link.label}:</span>{" "}
                <span className="text-[color:var(--gilt)]">{link.url}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="mx-auto h-px w-24 bg-[color:var(--gilt)]" />
          <p className="mt-4 font-ritual text-[14pt] italic text-[color:var(--gilt)]">
            &ldquo;{closing.quote}&rdquo;
          </p>
        </div>

        <PageFooter pageNum={12} />
      </div>
    </Page>
  );
}

/* ─── Main page ─── */
export default function HermeticPrinciplesEbook() {
  return (
    <div className="ebook-container">
      {/* Screen-only toolbar */}
      <div className="ebook-screen-only sticky top-20 z-50 mb-4 flex items-center justify-between rounded bg-[color:var(--char)] px-4 py-2">
        <p className="text-sm text-[color:var(--mist)]">
          7 Hermetic Principles Starter Guide
        </p>
        <a
          href="/ebook/hermetic-principles-starter-guide.pdf"
          download
          className="rounded bg-[color:var(--gilt)] px-4 py-1.5 text-sm font-semibold text-[color:var(--bg)] no-underline"
        >
          Download PDF
        </a>
      </div>

      <CoverPage />
      <WelcomePage />
      <OrientationPage />
      {ebookData.principles.map((principle, i) => (
        <PrinciplePage
          key={principle.title}
          principle={principle}
          pageNum={i + 4}
        />
      ))}
      <PracticePathPage />
      <ClosingPage />
    </div>
  );
}
