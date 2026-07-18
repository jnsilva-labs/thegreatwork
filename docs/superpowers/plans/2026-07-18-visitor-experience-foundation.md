# Visitor Experience Foundation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the reading journey clearer, keyboard-safe, motion-safe, faster to load, and accurately measurable while preserving Awareness Paradox's restrained Editorial Ritual visual language.

**Architecture:** Ship the visitor-flow/accessibility work as a self-contained first slice, followed by performance/analytics isolation. Tarot gains one shared pure question validator used by both the client and request parser; focus management gains one reusable dialog hook. The homepage scene and analytics move behind dedicated lazy client boundaries, while scroll/pointer motion is published through a throttled mutable channel rather than React state on every frame.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Zustand, Three.js/react-three-fiber, Vitest, GSAP, PostHog.

---

## Chunk 1: Reading flow, trust, accessibility, and visual affordance

### Task 1: Reject blank Tarot questions before quota work

**Files:**
- Create: `src/lib/tarot/question.ts`
- Create: `src/test/tarot.question.test.ts`
- Modify: `src/app/api/tarot/interpret/request.ts:1-117`
- Modify: `src/test/tarot.interpret-request.test.ts`
- Modify: `src/test/tarot.interpret-handler.test.ts`

- [ ] **Step 1: Write the failing pure validation tests**

```ts
import { describe, expect, it } from "vitest";
import { normalizeTarotQuestion } from "@/lib/tarot/question";

describe("normalizeTarotQuestion", () => {
  it("trims a meaningful question", () => {
    expect(normalizeTarotQuestion("  What needs attention?  ")).toBe("What needs attention?");
  });

  it("rejects whitespace-only questions", () => {
    expect(normalizeTarotQuestion("  \n ")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the new test to verify it fails**

Run: `npm test -- src/test/tarot.question.test.ts`
Expected: FAIL because `@/lib/tarot/question` does not exist.

- [ ] **Step 3: Add the smallest shared validator**

```ts
export const TAROT_QUESTION_REQUIRED_MESSAGE = "Ask a question before revealing the cards.";

export function normalizeTarotQuestion(value: string): string | null {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}
```

- [ ] **Step 4: Run the pure validation test**

Run: `npm test -- src/test/tarot.question.test.ts`
Expected: PASS.

- [ ] **Step 5: Add failing route-boundary assertions**

Add a whitespace-only request case to `tarot.interpret-request.test.ts`; it must return the existing invalid-request shape. Add a handler test that submits that payload and asserts `400`, generator call count `0`, and no `Set-Cookie` header.

- [ ] **Step 6: Run the focused parser/handler tests to verify the current parser fails**

Run: `npm test -- src/test/tarot.interpret-request.test.ts src/test/tarot.interpret-handler.test.ts`
Expected: FAIL on whitespace-only input being accepted.

- [ ] **Step 7: Use the validator in the request parser before handler quota/burst work**

Normalize `value.question` after type/length checks. When it returns `null`, return the parser's validation error; otherwise use the normalized string in the canonical request. Do not alter shared-tier, BYOK, or cookie behavior.

- [ ] **Step 8: Re-run the focused suite**

Run: `npm test -- src/test/tarot.question.test.ts src/test/tarot.interpret-request.test.ts src/test/tarot.interpret-handler.test.ts`
Expected: PASS.

- [ ] **Step 9: Commit the server-safe validation boundary**

```bash
git add src/lib/tarot/question.ts src/test/tarot.question.test.ts src/app/api/tarot/interpret/request.ts src/test/tarot.interpret-request.test.ts src/test/tarot.interpret-handler.test.ts
git commit -m "fix: reject blank tarot questions"
```

### Task 2: Add a focused DOM test harness for changed interactions

**Files:**
- Modify: `package.json`
- Modify: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/test/tarot.home.test.tsx`
- Create: `src/test/ui.focus-dialog.test.tsx`
- Create: `src/test/nav.dialog.test.tsx`
- Create: `src/test/tarot.reading-dialog.test.tsx`

- [ ] **Step 1: Add DOM-only test dependencies**

Add `jsdom`, `@testing-library/react`, and `@testing-library/user-event` as development dependencies. Do not use a browser automation dependency for unit interaction tests.

- [ ] **Step 2: Configure a focused jsdom project without changing pure test defaults**

Keep the existing Node environment for `src/test/**/*.test.ts`. Add a jsdom project or per-file setup for `*.test.tsx`, loading `src/test/setup.ts`; that setup supplies the narrow browser shims the changed components need (for example `matchMedia`).

- [ ] **Step 3: Write failing Tarot-home interaction coverage**

Render Home with spies. Assert one-card is selected by default, clicking another spread changes `aria-pressed` without calling `onStartReading`, a blank Reveal announces the inline error, and a trimmed question plus Reveal calls `onStartReading` once with the selected spread.

- [ ] **Step 4: Write failing dialog interaction coverage**

Render a minimal test host using the focus-dialog hook. Assert initial focus, Escape close, Tab/Shift+Tab wrapping, and restoration to the trigger. This is the required automated boundary before applying it to NavBar and Reading.

- [ ] **Step 5: Add failing integration tests for the real dialog consumers**

Render NavBar and the smallest practical Reading fixture with their dependencies mocked at module edges. For each real trigger, assert initial close-control focus, Escape invokes the correct state close path, Tab/Shift+Tab remains inside, and focus returns to the original menu/card button. These tests must exercise the actual trigger-ref plumbing, not only the generic hook.

- [ ] **Step 6: Run the new tests to verify they fail for missing behavior**

Run: `npm test -- src/test/tarot.home.test.tsx src/test/ui.focus-dialog.test.tsx src/test/nav.dialog.test.tsx src/test/tarot.reading-dialog.test.tsx`
Expected: test harness loads; interaction assertions fail until the UI/hook tasks are implemented.

- [ ] **Step 7: Commit the focused test harness**

```bash
git add package.json package-lock.json vitest.config.ts src/test/setup.ts src/test/tarot.home.test.tsx src/test/ui.focus-dialog.test.tsx src/test/nav.dialog.test.tsx src/test/tarot.reading-dialog.test.tsx
git commit -m "test: add interaction coverage for reading flow"
```

### Task 3: Make Tarot question-first with an explicit reveal action

**Files:**
- Modify: `src/features/tarot/pages/Home.tsx:14-124`
- Modify: `src/features/tarot/pages/Settings.tsx:20-115`
- Modify: `src/features/tarot/pages/DeckManager.tsx:50-150`
- Modify: `src/features/tarot/pages/Journal.tsx:45-85`
- Modify: `src/features/tarot/components/SpreadLayout.tsx`
- Test: `src/test/tarot.home.test.tsx`

- [ ] **Step 1: Add local selection/error state without changing TarotApp routing**

In `Home.tsx`, initialize `selectedSpread` to `"one-card"` and `questionError` to `null`. Import `normalizeTarotQuestion` and `TAROT_QUESTION_REQUIRED_MESSAGE`. Keep `onStartReading` and its `ReadingRequest` payload unchanged.

- [ ] **Step 2: Change each spread card from a start button into a selector**

On click, only call `setSelectedSpread`. Give each button `aria-pressed={selectedSpread === spread.id}`, an explicit selected visual, and `min-h-[44px]`. Do not issue a reading from these cards.

- [ ] **Step 3: Add a semantic question field and primary reveal button**

Give the question label `htmlFor="tarot-question"`; give the input `id`, `name="question"`, `autoComplete="off"`, and `aria-describedby` pointing to a live inline error when present. Add a 48px minimum primary button labelled `Reveal the card` (or the selected spread's equivalent). Its handler normalizes the question, shows the inline error if absent, and otherwise calls:

```ts
onStartReading({ question: normalized, intention, spreadId: selectedSpread });
```

- [ ] **Step 4: Raise the remaining changed Tarot controls to mobile target size and state semantics**

Set intention controls and return/back controls to `min-h-[44px]`; turn the Settings reversals control into a 44px minimum hit-area button with `aria-pressed`; add `aria-label="Back to Tarot home"` to icon-only back controls; add labelled/name/autocomplete metadata to Journal search, Deck Manager inputs, and the visible Personal API Key field in Settings.

- [ ] **Step 5: Replace changed broad transitions with explicit properties**

Replace `transition-all` in the changed Tarot surfaces, including `SpreadLayout.tsx`, with the smallest needed `transition-[border-color,background-color,color,transform,opacity]` class set. Preserve the current calm hover behavior.

- [ ] **Step 6: Run focused interaction, service, and visual checks**

Run: `npm test -- src/test/tarot.home.test.tsx src/test/tarot.question.test.ts src/test/tarot.interpret-request.test.ts src/test/tarot.interpret-handler.test.ts`
Expected: PASS.

Then verify in a visible browser at desktop and 390px width: blank question shows announced inline feedback; selected spread changes without starting a reading; Reveal starts only the selected spread; all changed controls remain at least 44px tall.

- [ ] **Step 7: Commit the question-first Tarot flow**

```bash
git add src/features/tarot/pages/Home.tsx src/features/tarot/pages/Settings.tsx src/features/tarot/pages/DeckManager.tsx src/features/tarot/pages/Journal.tsx src/features/tarot/components/SpreadLayout.tsx
git commit -m "feat: clarify tarot reading entry"
```

### Task 4: Give reading visitors direct, truthful entry points

**Files:**
- Modify: `src/app/page.tsx:19-44`
- Modify: `src/components/ui/HomepageHero.tsx:10-24,112-168`
- Modify: `src/app/astrology/page.tsx:56-124`
- Modify: `src/components/astro/NatalChartWidget.tsx:366-501`

- [ ] **Step 1: Replace the homepage reading door's single destination with two tracked actions**

Extend only the reading door data to hold a `choices` array. Render it as two existing `MagneticLink` anchors, preserving `location="home:hero-door"` and using distinct labels/variants:

```ts
{ label: "Tarot · Draw a card", href: "/tarot", variant: "tarot" }
{ label: "Astrology · Create a chart", href: "/astrology#natal-widget", variant: "astrology" }
```

Do not add a modal, `/readings` route, or a fourth homepage door.

- [ ] **Step 2: Add an early Astrology anchor CTA**

Place a single tracked semantic link after the introductory copy, pointed at `#natal-widget`, with the existing visual language and a 44px minimum target. Keep source/context text lower on the page.

- [ ] **Step 3: Make the natal form a stable target with accurate form metadata**

Set `id="natal-widget"` and a Tailwind fixed-header scroll margin on the widget outer wrapper. Add `name` and appropriate autocomplete values to birth-date, birth-time, and birth-place fields. Make the time field required only while the visitor has not marked time unknown. Ensure the time-unknown label/control has a 44px target.

- [ ] **Step 4: Add exact, defensible birth-data copy beside submission**

Use: `Your birth details are sent to calculate this reading; please enter only what is needed.` Do not claim deletion, non-retention, or local-only processing.

- [ ] **Step 5: Verify destinations and form behavior in browser**

At desktop and 390px width, confirm each homepage reading choice has the correct URL, the Astrology CTA lands below the fixed header, native form validation respects time unknown, and the privacy note is visible before submission.

- [ ] **Step 6: Commit the visitor entry-point improvements**

```bash
git add src/app/page.tsx src/components/ui/HomepageHero.tsx src/app/astrology/page.tsx src/components/astro/NatalChartWidget.tsx
git commit -m "feat: clarify reading paths"
```

### Task 5: Establish page landmarks and reusable modal focus management

**Files:**
- Create: `src/components/ui/useFocusDialog.ts`
- Create: `src/lib/a11y/focusCycle.ts`
- Create: `src/test/a11y.focus-cycle.test.ts`
- Test: `src/test/ui.focus-dialog.test.tsx`
- Modify: `src/app/layout.tsx:46-56`
- Modify: `src/app/page.tsx:82-129`
- Modify: `src/app/ripley-scroll/page.tsx:259-468`
- Modify: `src/components/ui/NavBar.tsx:22-340`
- Modify: `src/features/tarot/pages/Reading.tsx:155-187,268-302,374-461`
- Modify: `src/features/tarot/components/SpreadLayout.tsx`
- Modify: `src/features/tarot/components/CardVisual.tsx:36-51`

- [ ] **Step 1: Write failing pure focus-cycle tests**

Test a helper that receives the current index, focusable count, Shift state, and whether the event is Tab; assert it returns the wrapped target index only at the first/last boundaries and `null` otherwise.

- [ ] **Step 2: Run the focus-cycle test to verify it fails**

Run: `npm test -- src/test/a11y.focus-cycle.test.ts`
Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement the pure focus-cycle helper and test it**

Keep it DOM-free and limited to determining wrap direction. Re-run the focused test and expect PASS.

- [ ] **Step 4: Build `useFocusDialog` around that helper**

The hook accepts `open`, `dialogRef`, `initialFocusRef`, `triggerRef`, and `onClose: () => void`; on open, focus the close control; on Escape invoke `onClose`; on Tab cycle focusable descendants; on close restore focus to the trigger. It must add and remove listeners deterministically and must not add a dependency.

- [ ] **Step 5: Add the sole document main landmark and skip link**

In RootLayout, render a visually-hidden, focus-visible `href="#main-content"` link immediately inside body and wrap `children` in `main id="main-content" tabIndex={-1}`. Replace the existing `main` elements in `page.tsx` and `ripley-scroll/page.tsx` with non-landmark containers.

- [ ] **Step 6: Apply the dialog hook to menu and Tarot overlay**

Give NavBar's trigger a ref, `aria-expanded`, and `aria-controls`; give the aside a labelled `role="dialog" aria-modal="true"`; use its Close button as initial focus. Convert `CardVisual` from faux `div role="button"` to native button without changing its visual internals. Extend the card selection callback through SpreadLayout so Reading receives the clicked native button and stores it in `lastCardTriggerRef` before opening the detail dialog. Apply the hook with that trigger ref to Reading's card detail overlay, give it title/description IDs, make close/previous/next controls 44px, and contain overscroll.

- [ ] **Step 7: Move Tarot API errors into announced inline feedback**

Replace the fixed API-key/error overlay with an inline `role="alert"` or `aria-live="assertive"` panel beside the interpretation controls. Preserve personal-key fallback actions and 44px dismissal/retry controls; do not place it inside the card-detail dialog or trap focus.

- [ ] **Step 8: Test and perform keyboard QA**

Run: `npm test -- src/test/a11y.focus-cycle.test.ts src/test/ui.focus-dialog.test.tsx src/test/nav.dialog.test.tsx src/test/tarot.reading-dialog.test.tsx`
Expected: PASS.

Manual desktop QA: Tab to skip link, open/close menu with Enter/Escape, confirm Tab stays inside and returns to trigger; open Tarot detail, test same behavior, then verify error is announced without trapping focus.

- [ ] **Step 9: Commit landmark and dialog safety**

```bash
git add src/components/ui/useFocusDialog.ts src/lib/a11y/focusCycle.ts src/test/a11y.focus-cycle.test.ts src/app/layout.tsx src/app/page.tsx src/app/ripley-scroll/page.tsx src/components/ui/NavBar.tsx src/features/tarot/pages/Reading.tsx src/features/tarot/components/CardVisual.tsx src/features/tarot/components/SpreadLayout.tsx
git commit -m "feat: improve keyboard navigation safety"
```

### Task 6: Respect motion preferences and refine changed visual controls

**Files:**
- Create: `src/lib/motion/shouldAnimateNatalReveal.ts`
- Create: `src/test/natal.motion.test.ts`
- Modify: `src/components/astro/NatalChartWidget.tsx:105-123`
- Modify: `src/components/astro/PlanetaryArc.tsx:147-165`
- Modify: `src/features/tarot/pages/Reading.tsx`
- Modify: `src/features/tarot/components/CardVisual.tsx`
- Modify: `src/app/globals.css:210-239,932-940,1377-1410`

- [ ] **Step 1: Write failing pure natal-motion tests**

```ts
expect(shouldAnimateNatalReveal({ reducedMotion: true, hasResult: true })).toBe(false);
expect(shouldAnimateNatalReveal({ reducedMotion: false, hasResult: true })).toBe(true);
```

- [ ] **Step 2: Run the test to verify it fails, then implement the pure predicate**

Run: `npm test -- src/test/natal.motion.test.ts`
Expected before implementation: FAIL; after implementation: PASS.

- [ ] **Step 3: Gate the natal GSAP timeline and spinning treatment**

Read `usePrefersReducedMotion` in `NatalChartWidget`; do not create the GSAP context when the predicate is false. Make the result content immediately visible in that path.

- [ ] **Step 4: Apply complete changed-control motion/touch polish**

Make PlanetaryArc hit areas 44×44 without enlarging the visible glyph. Add a non-animated Tarot reveal path under reduced motion. Replace only changed `transition: all` and `transition-all` declarations with named transition properties. Preserve the present copper/gilt hierarchy and avoid new decorative boxes.

- [ ] **Step 5: Run focused motion tests and visual QA**

Run: `npm test -- src/test/motion.preference.test.ts src/test/natal.motion.test.ts`
Expected: PASS.

Verify with reduced motion enabled that natal results appear without GSAP motion and Tarot cards never pulse/spin/bounce; verify normal mode remains restrained and readable.

- [ ] **Step 6: Commit motion-safe visual polish**

```bash
git add src/lib/motion/shouldAnimateNatalReveal.ts src/test/natal.motion.test.ts src/components/astro/NatalChartWidget.tsx src/components/astro/PlanetaryArc.tsx src/features/tarot/pages/Reading.tsx src/features/tarot/components/CardVisual.tsx src/app/globals.css
git commit -m "fix: respect reduced motion in readings"
```

## Chunk 2: Homepage performance and dependable measurement

### Task 7: Isolate the WebGL scene behind a capability and idle boundary

**Files:**
- Create: `src/lib/scene/capability.ts`
- Create: `src/components/scene/HomepageSceneBoundary.tsx`
- Create: `src/test/scene.capability.test.ts`
- Modify: `src/components/ui/WebGLGuard.tsx`
- Modify: `src/app/page.tsx:1-129`
- Modify: `src/components/scene/RitualCanvas.tsx:1-102`
- Modify: `src/components/scene/AetherField.tsx`

- [ ] **Step 1: Write failing capability tests**

Cover false outcomes for reduced motion, Save-Data, `slow-2g`/`2g`, two-or-fewer CPU cores, and missing WebGL; cover true only when all conditions allow it. Keep browser reads outside the pure helper by passing a small capability input object.

- [ ] **Step 2: Run the capability test to verify it fails**

Run: `npm test -- src/test/scene.capability.test.ts`
Expected: FAIL because `@/lib/scene/capability` does not exist.

- [ ] **Step 3: Extract the capability predicate from WebGLGuard**

Create `canRenderWebGLScene(input)` and have WebGLGuard use it so `/ripley-scroll` behavior remains stable. Do not classify normal mobile devices as motion-disabled solely because they use the existing low render tier.

- [ ] **Step 4: Create the homepage-only dynamic scene boundary**

`HomepageSceneBoundary` initially renders `FallbackEngraving`. In an effect, collect browser capability input; only when allowed, schedule a `requestIdleCallback` with a timeout fallback, then render:

```ts
const RitualCanvas = dynamic(() => import("./RitualCanvas").then((m) => m.RitualCanvas), {
  ssr: false,
  loading: () => null,
});
```

Cancel idle work on unmount. A dynamic-import failure leaves the engraving in place.

- [ ] **Step 5: Replace the homepage static scene import**

In `src/app/page.tsx`, replace the `WebGLGuard`/`RitualCanvas` pair with `HomepageSceneBoundary`. Keep `/ripley-scroll` as the intentional dynamic scene route and do not alter its behavior.

- [ ] **Step 6: Reduce constrained scene cost only after the boundary works**

For low quality, skip nonessential composer passes before geometry: Bloom only on high tier; remove Noise and Vignette on low tier. Reduce `AetherField` particle counts one tier at a time after a visible comparison; do not change scene composition blindly.

- [ ] **Step 7: Run tests, build, and inspect fallback behavior**

Run: `npm test -- src/test/scene.capability.test.ts src/test/motion.preference.test.ts && npm run build`
Expected: PASS and successful production build.

Verify desktop normal capability loads the scene after initial content; reduced motion/Save-Data/low-core paths retain engraving; `/ripley-scroll` still renders its intended scene.

- [ ] **Step 8: Commit scene isolation**

```bash
git add src/lib/scene/capability.ts src/components/scene/HomepageSceneBoundary.tsx src/test/scene.capability.test.ts src/components/ui/WebGLGuard.tsx src/app/page.tsx src/components/scene/RitualCanvas.tsx src/components/scene/AetherField.tsx
git commit -m "perf: defer homepage webgl scene"
```

### Task 8: Queue analytics and capture the actual landing page

**Files:**
- Create: `src/lib/analytics/queue.ts`
- Create: `src/lib/analytics/lifecycle.ts`
- Create: `src/test/analytics.queue.test.ts`
- Create: `src/test/analytics.lifecycle.test.ts`
- Modify: `src/lib/analytics/track.ts`
- Modify: `src/components/analytics/PostHogProvider.tsx`

- [ ] **Step 1: Write failing bounded-queue and lifecycle tests**

Test that events preserve order, draining returns each event exactly once, a configurable cap drops the oldest event, and events emitted after activation reach the live capture sink rather than accumulating. Test lifecycle orchestration for: exactly one initial pageview; the latest pathname/query when initialization is delayed; queued events draining after that pageview; and later navigation producing one additional pageview.

- [ ] **Step 2: Run the queue tests to verify they fail**

Run: `npm test -- src/test/analytics.queue.test.ts src/test/analytics.lifecycle.test.ts`
Expected: FAIL because the queue module does not exist.

- [ ] **Step 3: Implement the pure queue and activation lifecycle**

Export a queue factory or resettable module with `enqueueAnalyticsEvent`, `activateAnalyticsSink`, `deactivateAnalyticsSink`, and test-only reset. Activation atomically installs the live sink and returns/drains historical events exactly once. Keep lifecycle orchestration PostHog-free by injecting `capture`, pathname/query getters, and route-change input.

- [ ] **Step 4: Remove the static PostHog dependency from `track.ts`**

Preserve dataLayer, gtag, custom event, and queue behavior. Remove `import posthog from "posthog-js"` and direct capture. This module must never delay navigation.

- [ ] **Step 5: Make PostHogProvider the only PostHog import path and live sink**

After its delayed dynamic import initializes PostHog, use the lifecycle helper to capture the current pathname plus query immediately, activate the live event sink, then capture the historical queue. On later pathname changes, capture exactly one pageview per route after initialization. On unmount, deactivate the sink. Guard cancellation and avoid duplicate initial pageviews.

- [ ] **Step 6: Run analytics tests and inspect the build graph**

Run: `npm test -- src/test/analytics.queue.test.ts src/test/analytics.lifecycle.test.ts && npm run build`
Expected: PASS and no static PostHog import outside the provider.

- [ ] **Step 7: Commit analytics reliability**

```bash
git add src/lib/analytics/queue.ts src/lib/analytics/lifecycle.ts src/test/analytics.queue.test.ts src/test/analytics.lifecycle.test.ts src/lib/analytics/track.ts src/components/analytics/PostHogProvider.tsx
git commit -m "fix: capture initial analytics pageview"
```

### Task 9: Stop high-frequency UI motion from causing React render churn

**Files:**
- Create: `src/lib/scene/motionState.ts`
- Create: `src/test/scene.motion-state.test.ts`
- Modify: `src/components/ui/ScrollOrchestrator.tsx`
- Modify: `src/components/ui/HomepageHero.tsx`
- Modify: `src/components/ui/HomepageSection.tsx`
- Modify: `src/components/ui/AnnotationBar.tsx`
- Modify: `src/components/ui/HeroSigil.tsx`
- Modify: `src/components/ui/NavBar.tsx`
- Modify: `src/components/ui/StillnessListener.tsx`
- Modify: `src/components/scene/HomepageSceneBoundary.tsx`
- Modify: `src/components/scene/SceneShell.tsx`
- Modify: `src/components/scene/RitualCanvas.tsx`
- Modify: `src/components/scene/AetherField.tsx`
- Modify: `src/components/scene/FractalVeil.tsx`
- Modify: `src/components/scene/SigilCore.tsx`
- Modify: `src/components/scene/SacredGeometrySigil.tsx`
- Modify: `src/components/scene/EngravedPath.tsx`
- Modify: `src/components/scene/HaloNodes.tsx`

- [ ] **Step 1: Write failing mutable-motion publisher tests**

Test that one published snapshot exposes current scroll, hero, pointer, and chapter values; subscribers receive the latest value once per explicit publish; replacing the snapshot does not retain stale subscribers after unsubscribe; and reset restores a neutral snapshot after homepage unmount.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/test/scene.motion-state.test.ts`
Expected: FAIL because the publisher does not exist.

- [ ] **Step 3: Implement the mutable snapshot publisher**

Keep it framework-free: a snapshot getter, publish function, and subscribe/unsubscribe. It must be safe to read in Three `useFrame` without React state.

- [ ] **Step 4: Coalesce scroll/pointer calculation into one animation frame**

In ScrollOrchestrator, retain measurement and hash updates. Queue Lenis scroll/pointer values; on one RAF, publish a snapshot and write CSS variables on `document.documentElement`. Update Zustand only when `activeChapter`, `principleId`, `activeAlchemyStage` (only when its threshold-derived value changes), or explicit stillness controls actually change. Do not write continuous `scrollProgress`, `progressByChapter`, `shift`, pointer, hero, clarity, or intensity into Zustand every frame. On homepage unmount, remove every `--ap-*` variable this task owns and reset the mutable snapshot to neutral values.

- [ ] **Step 5: Move DOM ornament to CSS-variable transforms**

Replace continuous Zustand subscriptions in HomepageHero, HomepageSection, AnnotationBar, and HeroSigil with CSS variable styles. Preserve discrete chapter/reveal state in React. Replace Hero card-pointer React state with element-local CSS variables set directly on pointer movement.

- [ ] **Step 6: Move WebGL consumers to mutable refs**

Define an explicit `motionSource` boundary: HomepageSceneBoundary renders `RitualCanvas motionSource="homepage"`; `/ripley-scroll` keeps the default `motionSource="store"`. Thread the source through SceneShell and all shared scene consumers. Only the homepage source reads mutable snapshots in `useFrame`; the store source retains existing Zustand-driven Ripley presets and must not read stale homepage values. For the homepage source, RitualCanvas, SceneShell, AetherField, FractalVeil, SigilCore, SacredGeometrySigil, EngravedPath, and HaloNodes update refs/material/group properties in `useFrame`. Update NavBar and StillnessListener to read the current snapshot or a derived value when restoring homepage stillness, rather than stale Zustand `scrollProgress`. Ensure SacredGeometrySigil still receives discrete chapter data where needed; it must not freeze due to a removed render prop. Move only continuous clarity/intensity/opacity/scale/position work to refs; retain discrete tier/chapter control in React.

- [ ] **Step 7: Run tests and do a performance visual QA pass**

Run: `npm test -- src/test/scene.motion-state.test.ts src/test/motion.preference.test.ts && npm run build`
Expected: PASS and successful production build.

Verify the homepage scroll narrative, hash progression, keyboard arrows, stillness controls, hero parallax, pointer ornament, and scene response at desktop and 390px. Confirm no visible jump on resize.

- [ ] **Step 8: Commit the motion-channel refactor**

```bash
git add src/lib/scene/motionState.ts src/test/scene.motion-state.test.ts src/components/ui/ScrollOrchestrator.tsx src/components/ui/HomepageHero.tsx src/components/ui/HomepageSection.tsx src/components/ui/AnnotationBar.tsx src/components/ui/HeroSigil.tsx src/components/ui/NavBar.tsx src/components/ui/StillnessListener.tsx src/components/scene/HomepageSceneBoundary.tsx src/components/scene/RitualCanvas.tsx src/components/scene/SceneShell.tsx src/components/scene/AetherField.tsx src/components/scene/FractalVeil.tsx src/components/scene/SigilCore.tsx src/components/scene/SacredGeometrySigil.tsx src/components/scene/EngravedPath.tsx src/components/scene/HaloNodes.tsx
git commit -m "perf: decouple homepage motion from react renders"
```

### Task 10: Protect the performance gains with a free build check

**Files:**
- Create: `scripts/check-bundle-budget.cjs`
- Modify: `package.json`
- Modify: `README.md`

- [ ] **Step 1: Write the checker with explicit route and exception constants**

Use Node built-ins only. After `next build`, read each ordinary route's generated HTML and collect unique initial `/_next/` JavaScript resources. Sum their raw file sizes. Read `.next/react-loadable-manifest.json` to identify the `RitualCanvas` dynamic chunk group. Assert that ordinary routes do not reference those scene chunks; explicitly exclude `/ripley-scroll`.

- [ ] **Step 2: Set budgets from the post-refactor build**

Run a fresh production build, record current ordinary-route raw initial-JS totals, and set a conservative documented ceiling slightly above the measured value. Do not invent a gzip budget without a reliable local gzip calculation; if gzip is included, calculate it with Node `zlib` in the same script.

- [ ] **Step 3: Add a package script and concise documentation**

Add `"check:bundle": "node scripts/check-bundle-budget.cjs"`. Document that it follows `npm run build`, protects ordinary non-scene routes, and intentionally exempts `/ripley-scroll`.

- [ ] **Step 4: Run the checker after a production build**

Run: `npm run build && npm run check:bundle`
Expected: PASS and a concise route/budget report.

- [ ] **Step 5: Commit the regression guard**

```bash
git add scripts/check-bundle-budget.cjs package.json README.md
git commit -m "test: guard route bundle budgets"
```

## Chunk 3: Integrated verification and release readiness

### Task 11: Verify the complete release without claiming unrun checks

**Files:**
- Modify only if verification exposes a real defect in the files above.

- [ ] **Step 1: Inspect the intended diff and formatting**

Run: `git diff --check main...HEAD && git status --short`
Expected: no whitespace errors; no unrelated `.claude/napkin.md`, `package-lock.json`, or `.superpowers/` artifacts staged.

- [ ] **Step 2: Run all app checks**

Run: `npm test && npm run lint && npm run check:plates && npm run build && npm run check:bundle`
Expected: passing tests/build/checks. Record the two known pre-existing lint warnings only if they persist; do not call lint warning-free unless output proves it.

- [ ] **Step 3: Run Astro-service checks**

Run: `npm test --prefix astro-service && npm run build --prefix astro-service`
Expected: service tests and TypeScript build pass. If the sandbox blocks Supertest's local listener, rerun with the minimal local-listener approval and record that fact.

- [ ] **Step 4: Perform final visible QA**

Check desktop and 390px mobile: homepage engraving-to-scene transition, reading split links, Tarot blank/error/success paths, menu/card dialog keyboard behavior, natal anchor/form/privacy copy, 44px controls, reduced motion, no unexpected scroll lock, and non-scene route loading without WebGL regressions.

- [ ] **Step 5: Commit any verified final fixes and report deployment requirements**

Do not stage unrelated worktree artifacts. Report that the previously documented Vercel/Render secrets remain required for the already-built AI protection; this visitor-experience pass requires no new paid service or environment variable.
