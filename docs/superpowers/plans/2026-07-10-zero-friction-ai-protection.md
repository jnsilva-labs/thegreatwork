# Zero-Friction AI Protection Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add no-cost, low-friction protection for shared tarot and natal AI usage while authenticating Vercel-to-Render astrology traffic.

**Architecture:** A Vercel-only signed HttpOnly cookie tracks a soft daily per-browser allowance of 10 shared tarot readings and 3 natal readings; it is intentionally not a distributed security ledger. Strict server-side tarot request reconstruction, process-local burst control, and a shared Vercel/Render service secret contain the practical abuse paths without adding a CAPTCHA to tarot or paid infrastructure.

**Tech Stack:** Next.js 16 route handlers, Node `crypto`, Zod, Vitest, Express, Supertest, Vercel environment variables, Render environment variables.

---

## File structure

- Create `src/lib/usage/dailyUsage.ts`: signed cookie parsing, allowance checks, response commit, retry timing.
- Create `src/lib/usage/burstLimit.ts`: bounded in-memory burst/in-flight limiter; documented as best-effort.
- Create `src/features/tarot/services/sharedRequest.ts`: Zod contract and default-deck-only prompt reconstruction for shared AI.
- Create `src/app/api/tarot/interpret/handler.ts` and `src/app/api/astro/natal/handler.ts`: dependency-injected handlers so route behavior is testable without live upstreams.
- Create `src/test/daily-usage.test.ts`, `src/test/burst-limit.test.ts`, `src/test/tarot.shared-request.test.ts`: deterministic unit coverage.
- Modify `src/app/api/tarot/interpret/route.ts`: use `NextRequest`, validate/reconstruct before AI, enforce soft allowance and burst control.
- Modify `src/features/tarot/services/geminiService.ts` and `src/features/tarot/pages/Reading.tsx`: send a minimal shared request; make the daily tarot limit a BYOK-eligible fallback.
- Modify `src/app/api/astro/natal/route.ts`: enforce the three-per-day soft natal allowance after Turnstile/session validation and before upstream work.
- Modify `src/app/api/astro/month-ahead/route.ts`: send the Vercel-to-Render service-secret header.
- Modify `astro-service/src/app.ts`: require the service-secret header for `/chart` and `/transits`, leaving `/healthz` public.
- Create `astro-service/test/service-auth.test.ts`: direct Render endpoint auth coverage.
- Modify `.env.example` and `README.md`: document variable names and operational setup only; never include secret values.

## Manual environment setup before deployment

1. Generate two distinct random values locally:

   ```bash
   openssl rand -base64 48
   ```

2. In Vercel production and preview environments, set:

   ```text
   DAILY_USAGE_COOKIE_SECRET=<first value>
   ASTRO_SERVICE_SECRET=<second value>
   ```

3. In the Render `astro-service` environment, set only:

   ```text
   ASTRO_SERVICE_SECRET=<same second value>
   ```

4. Do not put either secret in a checked-in `.env` file, browser bundle, or the client request.

5. In production, a missing or blank `DAILY_USAGE_COOKIE_SECRET` is a configuration error: shared tarot and natal routes must return a generic `503` rather than silently bypassing the cap. Local tests and development must set an explicit test secret.

## Chunk 1: Soft quota and request boundaries

### Task 1: Add deterministic daily-usage tests

**Files:**
- Create: `src/test/daily-usage.test.ts`
- Create: `src/lib/usage/dailyUsage.ts`

- [ ] **Step 1: Write failing tests for signed daily usage.**

  Cover a fresh visitor, valid signed usage, a tampered signature, malformed JSON, yesterday’s cookie, a missing/blank secret, the tenth tarot success, the eleventh tarot rejection, the third natal success, and the fourth natal rejection. Fix the clock in each test so UTC reset and retry timing are deterministic.

  ```ts
  expect(readDailyUsage({ cookie: undefined, now })).toMatchObject({ tarotUsed: 0, natalUsed: 0 });
  expect(checkDailyUsage({ usage: tarotAtTen, kind: "tarot", now }).allowed).toBe(false);
  ```

- [ ] **Step 2: Run the new test to verify it fails.**

  Run: `npm test -- src/test/daily-usage.test.ts`

  Expected: FAIL because `@/lib/usage/dailyUsage` does not exist.

- [ ] **Step 3: Implement `dailyUsage.ts`.**

  Define:

  ```ts
  export type UsageKind = "tarot" | "natal";
  export type DailyUsage = { v: 1; id: string; day: string; tarotUsed: number; natalUsed: number };
  export const DAILY_USAGE_COOKIE = "ap_daily_usage";
  export function readDailyUsage(input: { cookie?: string; now: Date }): DailyUsage;
  export function checkDailyUsage(input: { usage: DailyUsage; kind: UsageKind; now: Date }): { allowed: boolean; retryAfter: number; remaining: number };
  export function incrementDailyUsage(usage: DailyUsage, kind: UsageKind): DailyUsage;
  export function serializeDailyUsage(usage: DailyUsage, now: Date): { value: string; maxAge: number; expires: Date };
  ```

  Use `createHmac("sha256", DAILY_USAGE_COOKIE_SECRET)`, `timingSafeEqual`, `randomUUID`, and `base64url` JSON. Reject unexpected keys, values outside non-negative safe integers, invalid IDs, and dates that are not `YYYY-MM-DD`. Never reuse `ASTRO_SERVICE_SECRET` or the Turnstile secret. Throw a typed configuration error when the usage secret is absent. If the cookie is invalid or belongs to another UTC date, return a fresh usage object; calculate one `expiresAt` value at the next UTC midnight and derive cookie `expires`/`maxAge` and `Retry-After` from it. Route handlers must set `HttpOnly`, `Secure` when `NODE_ENV === "production"`, `SameSite=Lax`, `Path=/`, and that exact `expires`/`maxAge`; add a `Set-Cookie` test assertion for every successful usage commit.

- [ ] **Step 4: Run the new test to verify it passes.**

  Run: `npm test -- src/test/daily-usage.test.ts`

  Expected: PASS.

- [ ] **Step 5: Commit.**

  ```bash
  git add src/lib/usage/dailyUsage.ts src/test/daily-usage.test.ts
  git commit -m "feat: track soft daily AI usage"
  ```

### Task 2: Add best-effort burst protection

**Files:**
- Create: `src/lib/usage/burstLimit.ts`
- Create: `src/test/burst-limit.test.ts`

- [ ] **Step 1: Write failing burst-limit tests.**

  Verify two requests are accepted in a 60-second window, a third is rejected with a positive retry duration, an active request blocks a duplicate, `finish` clears the active marker, and expired entries are removed.

- [ ] **Step 2: Run the test to verify it fails.**

  Run: `npm test -- src/test/burst-limit.test.ts`

  Expected: FAIL because `@/lib/usage/burstLimit` does not exist.

- [ ] **Step 3: Implement a bounded module-local limiter.**

  Export a factory so tests receive a fresh instance. Use a maximum map size and opportunistic expiry cleanup. Its API should reserve before expensive work and release in `finally`:

  ```ts
  const limiter = createBurstLimiter({ windowMs: 60_000, maxAttempts: 2, maxEntries: 2_000 });
  const reservation = limiter.reserve(key, now);
  try { /* expensive call */ } finally { reservation.release(); }
  ```

  Document that it is instance-local and must not be described as a persistent rate limit.

- [ ] **Step 4: Run the test to verify it passes.**

  Run: `npm test -- src/test/burst-limit.test.ts`

  Expected: PASS.

- [ ] **Step 5: Commit.**

  ```bash
  git add src/lib/usage/burstLimit.ts src/test/burst-limit.test.ts
  git commit -m "feat: add best-effort request burst control"
  ```

### Task 3: Canonicalize shared tarot requests

**Files:**
- Create: `src/features/tarot/services/sharedRequest.ts`
- Create: `src/test/tarot.shared-request.test.ts`
- Modify: `src/features/tarot/services/geminiService.ts`
- Modify: `src/features/tarot/pages/Reading.tsx`

- [ ] **Step 1: Write failing shared-request tests.**

  Test acceptance of a supported spread with the exact default-deck card count; rejection of oversized question/intention text, duplicate ids, unknown card ids, invalid position ids, a mismatch between spread and positions, and arbitrary extra prompt fields.

- [ ] **Step 2: Run the test to verify it fails.**

  Run: `npm test -- src/test/tarot.shared-request.test.ts`

  Expected: FAIL because `sharedRequest.ts` does not exist.

- [ ] **Step 3: Define and implement the minimal public contract.**

  The shared endpoint receives only:

  ```ts
  type SharedTarotRequest = {
    question: string;
    intention: string;
    spreadId: "one-card" | "three-card" | "celtic-cross";
    cards: Array<{ id: string; isReversed: boolean; positionId: number }>;
  };
  ```

  Use strict Zod parsing and bounded strings (question maximum 500 characters, intention maximum 80). Look up `SPREADS[spreadId]` and `DEFAULT_DECK.cards`; reconstruct `SpreadDefinition` and full `DrawnCard[]` on the server. Do not copy client-provided names, keywords, meanings, or descriptions into the model prompt.

  Shared AI supports the canonical Rider-Waite deck only. In `Reading.tsx`, determine whether the active deck is custom and pass an explicit `sharedEligible` flag to `generateInterpretation`. If custom and no personal key exists, return a typed `CUSTOM_DECK_REQUIRES_PERSONAL_KEY` error before calling the shared route and invite the visitor to Settings. If custom and a personal key exists, skip the shared endpoint entirely and call direct Gemini. Test both branches.

  Update `callSharedEndpoint` to send the minimal contract. Do not change the direct-BYOK contract; a visitor’s own key may continue to interpret a custom deck.

- [ ] **Step 4: Run the shared-request and existing tarot tests.**

  Run: `npm test -- src/test/tarot.shared-request.test.ts src/test/tarot.interpretation-schema.test.ts src/test/tarot.prompt.test.ts`

  Expected: PASS.

- [ ] **Step 5: Commit.**

  ```bash
  git add src/features/tarot/services/sharedRequest.ts src/features/tarot/services/geminiService.ts src/features/tarot/pages/Reading.tsx src/test/tarot.shared-request.test.ts
  git commit -m "feat: validate shared tarot requests"
  ```

### Task 4: Enforce soft tarot usage on the shared route

**Files:**
- Modify: `src/app/api/tarot/interpret/route.ts`
- Modify: `src/features/tarot/services/geminiService.ts`
- Modify: `src/features/tarot/pages/Reading.tsx`
- Test: `src/test/tarot.shared-request.test.ts`

- [ ] **Step 1: Extend tests around the route decision helpers.**

  Move handler logic into `handler.ts` and export `createTarotInterpretHandler(deps)`, while `route.ts` only exports the production `POST` wrapper. The dependency interface includes `generateText`, `now`, `burstLimiter`, and daily-usage helpers. Tests invoke a fresh handler with fakes and a real `NextRequest` containing an explicit Cookie header. Prove invalid input returns before AI invocation; the first ten successful requests receive an updated cookie; the eleventh returns `429 DAILY_TAROT_LIMIT` with `Retry-After`; model failure does not increment usage; a rapid third attempt is rejected before AI invocation. This avoids mock leakage from singleton limiters.

- [ ] **Step 2: Run the focused tests to verify the new cases fail.**

  Run: `npm test -- src/test/tarot.shared-request.test.ts`

  Expected: FAIL until the route boundary uses the helpers.

- [ ] **Step 3: Update the route.**

  Change `route.ts` to delegate `POST(request: NextRequest)` to the production handler. Validate/reconstruct the request before quota work. Use the signed cookie id for burst reservation when present. A fresh visitor gets an ephemeral fallback key from a SHA-256 hash of Vercel's ingress `x-forwarded-for` first address plus the current UTC day; never trust a body/query/header supplied as a custom client key, and do not use a global `unknown` bucket. Check allowance before `generateText`, release the burst reservation in `finally`, and attach the newly signed cookie only to a successful `NextResponse.json` result. Catch the typed missing-usage-secret error at the route boundary and return a generic `503`.

  Exhaustion response:

  ```ts
  { code: "DAILY_TAROT_LIMIT", error: "You’ve used today’s 10 shared readings. Return tomorrow or use a personal Gemini key." }
  ```

  Map `DAILY_TAROT_LIMIT` to `needsPersonalKey: true` in the client. Use copy that preserves a simple return-tomorrow path, not a generic outage message.

- [ ] **Step 4: Run focused tests.**

  Run: `npm test -- src/test/tarot.shared-request.test.ts src/test/tarot.error-mapping.test.ts`

  Expected: PASS.

- [ ] **Step 5: Commit.**

  ```bash
  git add src/app/api/tarot/interpret/route.ts src/app/api/tarot/interpret/handler.ts src/features/tarot/services/geminiService.ts src/features/tarot/pages/Reading.tsx src/test/tarot.shared-request.test.ts src/test/tarot.error-mapping.test.ts
  git commit -m "feat: add soft daily tarot allowance"
  ```

## Chunk 2: Natal allowance and Render service authentication

### Task 5: Apply the soft natal allowance

**Files:**
- Modify: `src/app/api/astro/natal/route.ts`
- Create: `src/test/astro.daily-usage.test.ts`

- [ ] **Step 1: Write failing natal allowance tests.**

  Move orchestration into `handler.ts` and expose `createNatalHandler(deps)`. Supply fakes for geocoding, Render fetch, AI generation, verification/session helpers, `now`, and daily usage. Verify an authenticated third request succeeds and commits the cookie; a fourth request returns `429 DAILY_NATAL_LIMIT` before geocoding; an invalid payload does not consume usage; a failed upstream request does not consume usage; and the existing 30-minute Turnstile session path remains valid.

- [ ] **Step 2: Run the test to verify it fails.**

  Run: `npm test -- src/test/astro.daily-usage.test.ts`

  Expected: FAIL until the route has a testable boundary and usage check.

- [ ] **Step 3: Update the natal route.**

  Make `route.ts` only export the production wrapper from `handler.ts`. After input validation and the existing Turnstile/session decision, check `kind: "natal"`; before `geocodeBirthPlace`, return a `429` with `Retry-After` when exhausted. Catch the typed missing-usage-secret error as a generic `503`. Commit the incremented cookie only to the successful final natal response. Do not consume usage for malformed input, verification failure, geocode failure, Render failure, or language-model failure.

  Preserve the current 12/min instance limiter for this pass and add a comment that it is a burst control rather than distributed quota enforcement.

- [ ] **Step 4: Run focused tests.**

  Run: `npm test -- src/test/astro.daily-usage.test.ts src/test/astro.validation.test.ts`

  Expected: PASS.

- [ ] **Step 5: Commit.**

  ```bash
  git add src/app/api/astro/natal/route.ts src/app/api/astro/natal/handler.ts src/test/astro.daily-usage.test.ts
  git commit -m "feat: add soft daily natal allowance"
  ```

### Task 6: Authenticate Vercel-to-Render astrology calls

**Files:**
- Modify: `src/app/api/astro/natal/handler.ts`
- Modify: `src/app/api/astro/month-ahead/route.ts`
- Modify: `astro-service/src/app.ts`
- Create: `astro-service/test/service-auth.test.ts`
- Modify: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: Write failing Render service-auth tests.**

  With `ASTRO_SERVICE_SECRET` set for the test process, use Supertest to verify `/chart/natal` and `/transits/*` reject absent and wrong `X-Astro-Service-Secret` headers with `401`, accept a correct header through to their existing validation, and keep `/healthz` available.

- [ ] **Step 2: Run the Astro service test to verify it fails.**

  Run: `npm test --prefix astro-service -- service-auth.test.ts`

  Expected: FAIL because the service currently accepts public chart/transit requests.

- [ ] **Step 3: Implement constant-time service authentication.**

  Add Express middleware in `astro-service/src/app.ts` after `/healthz` and before `/chart`/`/transits`. If the Render secret is absent, return `503 SERVICE_AUTH_UNAVAILABLE`; if the supplied header is absent, malformed, has a different byte length, or fails `timingSafeEqual`, return `401 SERVICE_UNAUTHORIZED`. Compare buffers only after the length guard. Include a wrong-length header test so malformed requests cannot become `500` errors.

  Add a small Vercel-side helper or local function that retrieves `ASTRO_SERVICE_SECRET`. Both natal and month-ahead requests must:

  ```ts
  headers: {
    "Content-Type": "application/json",
    "X-Astro-Service-Secret": serviceSecret,
  }
  ```

  Return a generic `503` configuration error when Vercel lacks the secret. Never include the secret in logs or errors.

- [ ] **Step 4: Document setup.**

  Add variable names and the Vercel/Render placement to `.env.example` and README. State that `ASTRO_SERVICE_SECRET` must be the same value in both deployments, while `DAILY_USAGE_COOKIE_SECRET` belongs only in Vercel.

- [ ] **Step 5: Run focused service and root tests.**

  Run: `npm test --prefix astro-service -- service-auth.test.ts`

  Expected: PASS.

  Run: `npm test -- src/test/astro.daily-usage.test.ts src/test/astro.validation.test.ts`

  Expected: PASS.

- [ ] **Step 6: Commit.**

  ```bash
  git add src/app/api/astro/natal/handler.ts src/app/api/astro/month-ahead/route.ts astro-service/src/app.ts astro-service/test/service-auth.test.ts .env.example README.md
  git commit -m "feat: authenticate astro service requests"
  ```

### Task 7: Verify the release and configure environments

**Files:**
- Modify: none unless a verification failure requires a focused fix.

- [ ] **Step 1: Run all root quality gates.**

  Run: `npm test`

  Expected: all root tests pass.

  Run: `npm run lint`

  Expected: no new warnings or errors.

  Run: `npm run check:plates`

  Expected: `Plate generation OK`.

  Run: `npm run build`

  Expected: production compilation, type checking, and static generation succeed.

- [ ] **Step 2: Run all Astro service quality gates.**

  Run: `npm test --prefix astro-service`

  Expected: all Astro service tests pass.

  Run: `npm run build --prefix astro-service`

  Expected: TypeScript compilation succeeds.

- [ ] **Step 3: Set the secrets in hosting dashboards.**

  Set `DAILY_USAGE_COOKIE_SECRET` and `ASTRO_SERVICE_SECRET` in Vercel; set the same `ASTRO_SERVICE_SECRET` in Render. Deploy the Vercel code that sends the header while Render still accepts public requests, then deploy Render authentication. This ordering avoids an outage. If independent deployment timing is uncertain, deploy Render middleware in a short-lived compatibility mode that logs missing headers first, confirm Vercel requests carry the header, then enforce `401`.

- [ ] **Step 4: Smoke test production.**

  - Make one tarot reading with no CAPTCHA and confirm a normal result.
  - Make a natal reading with existing Turnstile behavior and confirm a normal result.
  - Confirm Render `/healthz` still responds.
  - Confirm direct Render chart/transit calls without the header return `401`.
  - Confirm the eleventh shared tarot request and fourth natal request show their return-tomorrow path without exposing server details.

- [ ] **Step 5: Commit verification-only docs if needed.**

  ```bash
  git status --short
  ```

  Expected: clean worktree, or only intentional documentation changes.
