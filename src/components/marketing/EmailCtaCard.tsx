import { TrackedLink } from "@/components/analytics/TrackedLink";
import { getSubstackUrl } from "@/lib/substack";

type EmailCtaCardProps = {
  title: string;
  body: string;
  source?: string;
  leadMagnet?: string;
  interests?: string[];
  redirectPath?: string;
  variant?: "full" | "compact";
  eyebrow?: string;
  primaryHref?: string;
  primaryLabel?: string;
  ctaNote?: string;
  alreadySubscribedHref?: string | null;
  alreadySubscribedLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  tertiaryHref?: string;
  tertiaryLabel?: string;
};

export function EmailCtaCard(props: EmailCtaCardProps) {
  const {
    title,
    body,
    source,
    variant = "full",
    eyebrow = "Free Guide",
    primaryHref = getSubstackUrl(),
    primaryLabel = "Subscribe on Substack",
    ctaNote = "Subscribe on Substack to receive the Starter Guide link in your welcome email.",
    alreadySubscribedHref = null,
    alreadySubscribedLabel = "Already Subscribed? Get Guide Link",
    secondaryHref = "/start-here",
    secondaryLabel = "Start Here",
    tertiaryHref = "/letters",
    tertiaryLabel = "Read the Letters",
  } = props;

  const compact = variant === "compact";
  const sourceLocation = source ? `email_cta:${source}` : "email_cta";

  return (
    <section className="rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--char)]/55 p-5 sm:p-6">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gilt)]">
          {eyebrow}
        </p>
        <h2 className={compact ? "font-ritual text-2xl" : "font-ritual text-3xl sm:text-4xl"}>
          {title}
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-[color:var(--mist)] sm:text-base">
          {body}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <div className={compact ? "space-y-3" : "space-y-4"}>
          <TrackedLink
            href={primaryHref}
            location={sourceLocation}
            label={primaryLabel}
            variant="primary"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[color:var(--gilt)]/60 bg-[color:var(--gilt)]/15 px-6 py-3 text-xs uppercase tracking-[0.3em] text-[color:var(--bone)] transition hover:border-[color:var(--gilt)]"
          >
            {primaryLabel}
          </TrackedLink>
          <p className="text-xs text-[color:var(--mist)]">{ctaNote}</p>
          {alreadySubscribedHref ? (
            <TrackedLink
              href={alreadySubscribedHref}
              location={sourceLocation}
              label={alreadySubscribedLabel}
              variant="already-subscribed"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
            >
              {alreadySubscribedLabel}
            </TrackedLink>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em]">
          <TrackedLink
            href={secondaryHref}
            location={sourceLocation}
            label={secondaryLabel}
            variant="secondary"
            className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
          >
            {secondaryLabel}
          </TrackedLink>
          {tertiaryHref && tertiaryLabel ? (
            <TrackedLink
              href={tertiaryHref}
              location={sourceLocation}
              label={tertiaryLabel}
              variant="tertiary"
              className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--copper)]/55 px-4 py-2 text-[color:var(--mist)] transition hover:border-[color:var(--gilt)] hover:text-[color:var(--bone)]"
            >
              {tertiaryLabel}
            </TrackedLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
