# Zero-Friction AI Protection — Design

Date: 2026-07-10

## Decision

Keep tarot free of a Turnstile challenge. The shared AI allowance is a soft, per-browser daily cap: 10 tarot interpretations and 3 natal readings. It is deliberately not an identity-level abuse control; preserving a welcoming first reading is more important at the current traffic level.

## Constraints

- The public Next.js application runs on Vercel.
- `astro-service` runs on Render.
- No new paid infrastructure or durable database/cache.
- Existing astrology Turnstile behavior remains unchanged.
- A user may choose a personal Gemini key after the shared tarot allowance is used.

## Options considered

1. **Verified daily pass:** Require Turnstile before issuing a daily allowance. Stronger protection, but adds repeat-visit friction. Rejected.
2. **Soft per-browser allowance:** Signed HttpOnly usage cookie plus best-effort burst protection. The normal tarot flow stays friction-free. Chosen.
3. **BYOK after a minimal allowance:** Strongest cost cap, but weakens the primary product experience. Retain only as the fallback.

## Architecture

### Daily usage cookie

Create a Node-runtime helper at `src/lib/usage/dailyUsage.ts` backed by a Vercel-only `DAILY_USAGE_COOKIE_SECRET`. It signs a compact HttpOnly cookie containing a random browser id, UTC date, tarot count, and natal count.

- Cookie: `ap_daily_usage`
- Attributes: `HttpOnly`, `Secure` in production, `SameSite=Lax`, `Path=/`
- Reset: first request on a new UTC day; expiry is the next UTC midnight.
- Limits: tarot `10`, natal `3`.
- Invalid or tampered cookies become a fresh allowance; no cookie error is shown to visitors.
- Usage is committed only after a successful provider result so failed requests do not spend an allowance.

This is a courtesy cap, not a security boundary. A user can clear a cookie and a determined attacker can use fresh browsers or concurrent serverless instances.

### Best-effort burst protection

Add a small process-local burst limiter at `src/lib/usage/burstLimit.ts`.

- Prefer the signed browser id as the key; otherwise use a platform-provided request IP as a weak fallback.
- Tarot: allow two attempts per 60 seconds and one in-flight request per key.
- Keep the existing coarse astrology limiter while gradually consolidating shared limiter code.

The burst limiter blocks accidental double submissions and cheap rapid retries without becoming a claimed distributed rate limiter.

### Tarot boundary

Before calling the AI gateway, the route validates a strict Zod request contract: bounded question/intention strings, a supported spread, expected card count, and known card ids/positions. The server reconstructs canonical tarot card/spread prompt content from local constants rather than trusting client-supplied meanings and keywords.

After validation, the route checks the soft allowance and burst limiter. An exhausted visitor receives `429 DAILY_TAROT_LIMIT`, a reset-oriented message, and `Retry-After`. The existing BYOK path remains available as the voluntary fallback.

### Natal boundary

Keep current Turnstile/session behavior for natal readings. After successful input validation and access verification—but before geocoding, Render, or the language model—the route checks the three-per-day natal allowance. It commits only after a successful response. Month-ahead remains outside this allowance for this pass.

### Render service authentication

Add `ASTRO_SERVICE_SECRET` to both Vercel and Render. The Vercel natal and month-ahead routes send it as `X-Astro-Service-Secret`; Render checks it in constant time before its chart and transit routes. The health endpoint remains available for Render health checks.

This blocks direct public use of the Render compute endpoint. It does not expose the secret to browsers.

## Errors and UX

- Tarot stays challenge-free.
- `DAILY_TAROT_LIMIT`: explain that today’s shared allowance is used, invite a return tomorrow, and offer the existing personal-key route.
- `DAILY_NATAL_LIMIT`: explain that today’s three readings are used and invite a return tomorrow.
- Burst rejection: use a brief retry message; do not reveal implementation details.
- Missing Render secret: a server-side configuration error, never a browser-visible secret.

## Verification

- Unit-test valid, malformed, tampered, and day-expired usage cookies; cap behavior; and reset timing.
- Route-test that invalid/oversized tarot input never invokes the model, the eleventh tarot attempt returns `429`, and failed model calls do not decrement the allowance.
- Route-test that the fourth natal attempt returns `429` before expensive upstream calls and existing Turnstile sessions still work.
- Test Render endpoints for missing, incorrect, and correct service-secret headers.
- Run root tests, lint, plate checks, build, and the Astro service tests.

## Out of scope

- A distributed, abuse-resistant ledger.
- CAPTCHA on tarot.
- Shared quota caps for month-ahead readings.
- WebGL, analytics, navigation, and accessibility improvements from the broader audit.
