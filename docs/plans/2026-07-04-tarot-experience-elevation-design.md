# Tarot Experience Elevation — Design Review & Plan

Date: 2026-07-04

## Thesis

The tarot app's philosophy is its strength: a psychological mirror, not a fortune-teller. Jungian, alchemical, grounded in attention. The card model already carries `shadow` and `gift` fields — an ambition most tarot apps never reach. The problem is that the delivery contradicts the thesis in three ways.

## What holds it back

### 1. Every reading has the same shape

Six fixed boxes in a fixed order: mirror quote, shadow essay, phase essay, three actions, three prompts, mantra. When form never varies, even good content reads as templated. The "alchemical phase feels repetitive" complaint is the visible symptom.

### 2. The phase field improvises vocabulary the site already owns

Observed across real readings: one said "Calcination," one "Nigredo moving toward Albedo," one "Separatio toward Coagulatio" — mixing the four color-stages and the seven operations with no canon. Meanwhile `/great-work` is built on the four stages, typed in `src/data/greatWork.ts` as `nigredo | albedo | citrinitas | rubedo`. The tarot app never references it.

### 3. It is an island

State-only SPA routing (back button exits the app), no links into the Great Work, principles, or journey — on a site whose positioning is multi-disciplinary integration. The journal is a read-only archive: no notes, no delete, no pattern over time.

Additional findings:
- No reveal ritual: after the shuffle animation, cards appear face-up instantly. The flip machinery in `CardVisual` exists but is unused.
- `TarotShell` hardcodes `#04070d`; card accents and `void-*` colors are literal hex — the abyssal/crimson themes change text but not the room.
- Interpretation never speaks to spread positions ("The Root / The Stem / The Bloom") individually.
- No onboarding floor: reversed cards unexplained, spread descriptions hidden until after choosing.

## Direction

Keep the mirror philosophy; make the form serve it. Repetition becomes legible location (a stage on a map), the reveal becomes a ritual the user performs, and the journal becomes a practice instead of a log.

## Waves

### Wave 1 (this pass)
1. **Canonize the alchemical phase.** Schema: `phase` as enum of the four Great Work stages + one-sentence `phaseReason`. UI: a compact four-stage arc (I–IV, lit stage uses `stage.tone` from greatWork.ts), one line of why, quiet link to `/great-work#<stage>`. Legacy journal entries (prose `alchemicalPhase`) keep rendering as prose.
2. **Flip-to-reveal ritual.** Cards land face-down; the user turns each one (animated 3D flip; reversed cards rotate in). Second tap opens the detail modal. "Reveal Guidance" appears once all cards are turned. Instant flip under reduced motion/stillness/low power.
3. **Journal notes + delete.** Personal reflection field per entry (persisted to localStorage), delete with confirm.
4. **Theme-aware shell.** TarotShell background and structural accents derive from theme vars.

### Wave 2
- Per-position insights in the schema (`positionInsights[]`) and an editorial interpretation panel: mirror pull-quote → per-card/position moments → phase arc → engraved guidance list → mantra as closing seal, using the site motion primitives.
- Phase timeline in the Journal ("five readings in Nigredo; this one crossed to Albedo").
- Real URLs for tarot views (hash or search params).
- Beginner floor: reversed-card explainer, spread descriptions before choice, short "why this isn't fortune-telling" note linking sources.

### Wave 3
- Deterministic SVG share card for the mirror statement (reuse astrology share-card pattern).
- Streaming interpretation (mirrorStatement first via partial output).
- Deck expansion / Nano Banana integration.

## Cost posture (decided separately)

Current model `google/gemini-3.5-flash` ≈ $0.008/reading (~610 readings inside the monthly $5 Gateway free credit). If traffic approaches that: `google/gemini-3.1-flash-lite` (6× cheaper) or `openai/gpt-oss-120b` (17× cheaper, open-weight) are one-string swaps. Set a per-user rate limit in Gateway settings as abuse protection. Self-hosting OSS is not cost-efficient at this scale.
