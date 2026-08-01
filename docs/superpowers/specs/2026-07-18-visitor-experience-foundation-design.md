# Visitor Experience Foundation Design

**Date:** 2026-07-18
**Status:** Approved design and specification review, awaiting user review

## Intent

Make Awareness Paradox easier to enter, faster to use, safer for keyboard and motion-sensitive visitors, and more measurable without paid services or a visual redesign. Preserve the site's Editorial Ritual character: calm composition, selective cinematic motion, and material depth rather than heavier panels or extra controls.

## Chosen approach

Use one coordinated release that combines the highest-value visitor-flow, accessibility, performance, analytics, and visual-polish changes. A performance-only release would leave clear conversion leaks in place; a UI-only release would preserve slow startup and incomplete measurement.

## Experience changes

### Reading entry

- Keep the existing homepage `I Want a Reading` path, but replace its ambiguous single CTA with two direct actions:
  - **Tarot · Draw a card** links to `/tarot`.
  - **Astrology · Create a chart** links to `/astrology`.
- Do not add a `/readings` interstitial or a modal. The visitor chooses a practice in one click.
- On the Tarot home screen, lead with the labelled question input. Keep a one-card reading selected by default, treat spread cards as selectors, and provide an explicit primary action such as **Reveal the card**. The primary action requires a non-empty trimmed question and starts the selected spread.
- On Astrology, add a concise early action that anchors directly to the natal form (`#natal-widget`), while retaining the contextual and lineage material lower on the page. Add that stable ID and a fixed-navigation scroll margin to the natal widget.
- Add a brief, plain-language birth-data handling note beside natal submission only after verifying it is truthful against the current server behavior. It must not make a retention claim the implementation cannot support.

### Accessibility and resilient interaction

- Add a skip link and one `main id="main-content" tabIndex={-1}` target in the app shell. Convert existing page-local `main` elements to sections or divs so the document never nests main landmarks.
- Make the navigation drawer, Tarot card-detail overlay, and Tarot API-key/error overlay proper accessible dialogs where they remain modal: labelled, modal, initially focused, keyboard-dismissible, focus-trapped, and restored to the triggering control when closed. A non-modal error must instead be an announced inline alert.
- Use native buttons for interactive Tarot cards and preserve 44px minimum mobile targets across the complete changed-control inventory, including planetary chart hit areas, Tarot intentions, back/return controls, card-detail controls, and launch actions.
- Associate every visible form label with its control, add useful input names/autocomplete values, provide accessible names for search and icon-only controls, and expose selection state for toggles and share options.
- Announce Tarot interpretation failures with a live region and preserve the existing personal-key fallback behavior.
- Honor reduced-motion preferences for Tarot and natal-result motion. Replace broad `transition: all` declarations with explicit properties.

### Performance, measurement, and visual refinement

- Render the static engraving immediately; only dynamically load the Three/WebGL homepage scene after a positive capability check, outside the ordinary non-scene route graph. Prefer idle loading after the first content paint when the browser supports it.
- Keep the scene's current desktop character but use a lighter path for constrained hardware and remove low-value post-processing before reducing compositional detail.
- Replace frame-rate React/Zustand updates for homepage scroll and pointer ornament with request-animation-frame-throttled CSS-variable or scene-ref updates. Keep application state for discrete navigation and user controls only.
- Make analytics truly lazy. Queue UI events until PostHog is initialized, capture the initial pageview immediately after initialization, and drain the queue without a second static PostHog import path.
- Add a free post-build regression check that protects ordinary non-scene routes from inheriting Three/WebGL chunks and sets a documented initial-JS budget. Exempt `/ripley-scroll`, whose purpose is to load the scene, and give it a separate documented budget if it is checked.
- Visually, clarify primary actions through contrast, spacing, and gentle engraving/motion cues. Do not introduce new framed-card systems, autoplay sound, extra overlays, or visual noise.

## Architecture and data flow

1. The home-page reading card contains two semantic, tracked anchor actions (for example, existing `TrackedLink` components) so each direct destination retains CTA measurement without adding client-side navigation code.
2. Tarot keeps its local reading state for this release. The selected spread is stored in component state; `Reveal the card` invokes the existing start-reading callback with the question, intention, and selected spread. The API route applies the same trimmed non-empty question rule so a malformed client cannot spend a shared reading with blank content. No new public API or persistence layer is introduced.
3. Astrology's early link targets the existing natal-widget anchor. Natal submission, Turnstile/session handling, daily quota, Render request, and AI generation are unchanged.
4. A dedicated client homepage-scene boundary owns capability detection and dynamic scene loading. Its fallback engraving is present from the server render and remains available for reduced-motion and low-power visitors.
5. Analytics exposes a client-safe queue module. UI tracking enqueues events without importing PostHog; the provider initializes dynamically, sends the initial pageview, then drains queued events.
6. Dialog focus management is encapsulated in a small reusable primitive or hook shared by the menu and Tarot overlay; it must not add a new component library.

## Error handling and safety

- A missing or whitespace-only question produces clear, accessible inline feedback and does not call the Tarot service; the route rejects the same invalid payload before model work or quota commitment.
- Existing Tarot shared-tier, BYOK fallback, natal quota, Turnstile, and generic server-error contracts remain unchanged.
- No new sensitive client storage is introduced. Privacy copy is omitted until it can be verified exactly.
- Dynamic WebGL import failures retain the engraving fallback and never block the primary content or navigation.
- Analytics failure or delayed loading must never delay navigation, rendering, or user actions.

## Test and acceptance plan

- Unit/component tests cover Tarot default spread, question validation, explicit reveal action, correct request payload, and route rejection of blank questions without quota commitment.
- Add focused tests for analytics queue/initial pageview behavior and dynamic-scene capability branches where practical.
- Add keyboard tests for drawer and Tarot dialog focus, escape close, and focus restoration; verify reduced-motion branches.
- Verify the early Astrology anchor and fixed-header offset, home Tarot/Astrology destinations, form labels/state semantics, one non-nested main landmark, and the complete 44px changed-control inventory.
- Run the existing full app suite, lint, plate check, production build, Astro-service tests, and Astro-service build.
- Inspect production build output to confirm ordinary non-scene routes (explicitly excluding `/ripley-scroll`) no longer include the scene bundle, then enforce that expectation with the new free regression check.
- Perform visible desktop and mobile QA of homepage readability, menu navigation, Tarot beginning-to-reading flow, natal validation/loading/error states, and reduced-motion behavior.

## Out of scope

- Authentication, accounts, paid infrastructure, hard quota enforcement, and new AI vendors.
- A visual rebrand, new typography system, extra homepage sections, or a `/readings` landing page.
- Persisting full Tarot view/reading state into shareable URLs; that is valuable but is a separate, deeper routing change.
