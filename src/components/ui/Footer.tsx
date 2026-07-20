import { TrackedLink } from "@/components/analytics/TrackedLink";
import { SocialLinks } from "@/components/ui/SocialLinks";

const exploreLinks = [
  { href: "/start-here", label: "Start Here" },
  { href: "/study", label: "The Path" },
  { href: "/great-work", label: "The Great Work" },
  { href: "/gallery", label: "Sacred Geometry" },
  { href: "/principles", label: "Principles" },
];

const practiceLinks = [
  { href: "/tarot", label: "Tarot" },
  { href: "/astrology", label: "Astrology" },
  { href: "/journey", label: "Journey" },
  { href: "/letters", label: "Letters" },
];

const trustLinks = [
  { href: "/about", label: "About" },
  { href: "/method", label: "Method" },
  { href: "/sources", label: "Sources" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className="footer-shell relative z-10 border-t border-[color:var(--copper)]/40 bg-[color:var(--obsidian)]">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10 lg:px-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.25fr]">
          <section aria-labelledby="footer-purpose" className="space-y-4">
            <h2 id="footer-purpose" className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--gilt)]">Purpose</h2>
            <TrackedLink
              href="/"
              location="footer:purpose"
              label="Awareness Paradox"
              variant="footer-brand"
              className="flex min-h-[44px] items-center gap-3 font-ritual text-2xl text-[color:var(--bone)] transition-colors hover:text-[color:var(--gilt)]"
            >
              <span className="h-px w-8 bg-[color:var(--copper)]" />
              Awareness Paradox
            </TrackedLink>
            <p className="max-w-xs text-sm leading-relaxed text-[color:var(--mist)]">
              A source-conscious archive for reflective study of Hermeticism, alchemy, divination, astrology, and sacred form.
            </p>
            <SocialLinks variant="compact" />
          </section>

          <FooterNav id="footer-explore" title="Explore" links={exploreLinks} />
          <FooterNav id="footer-practice" title="Practice" links={practiceLinks} />

          <section aria-labelledby="footer-trust" className="space-y-4">
            <h2 id="footer-trust" className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--gilt)]">Trust</h2>
            <ul className="space-y-1">
              {trustLinks.map((link) => <FooterLink key={link.href} {...link} />)}
            </ul>
            <p className="border-l border-[color:var(--gilt)]/45 pl-3 text-xs leading-relaxed text-[color:var(--mist)]">
              Interpretations are AI-assisted reflective guidance. See Method and Privacy for how the instruments work.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-[color:var(--copper)]/20 pb-[max(0rem,env(safe-area-inset-bottom))] pt-6 text-xs uppercase tracking-[0.25em] text-[color:var(--mist)]">
          &copy; {new Date().getFullYear()} Awareness Paradox
        </div>
      </div>
    </footer>
  );
}

function FooterNav({ id, title, links }: { id: string; title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <nav aria-labelledby={id} className="space-y-4">
      <h2 id={id} className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--gilt)]">{title}</h2>
      <ul className="space-y-1">
        {links.map((link) => <FooterLink key={link.href} {...link} />)}
      </ul>
    </nav>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <TrackedLink
        href={href}
        location="footer"
        label={label}
        variant="footer-nav"
        className="inline-flex min-h-[44px] items-center text-xs uppercase tracking-[0.2em] text-[color:var(--mist)] transition-colors hover:text-[color:var(--bone)]"
      >
        {label}
      </TrackedLink>
    </li>
  );
}
