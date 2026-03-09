# Public Astrology Experience Implementation Plan

Date: 2026-03-09
Source Design: `docs/plans/2026-03-09-public-astrology-experience-design.md`
Status: Ready for execution

## 1. Implementation Goal

Ship a public astrology experience that:
- removes the private beta gate
- consolidates the tool into `/astrology`
- preserves accurate natal computation
- prepares the backend for a structured 30-day transit reading
- enforces Awareness Paradox voice constraints while staying on `gpt-4.1-mini`

## 2. Constraints

- Keep Swiss Ephemeris and current chart-computation pipeline intact
- Avoid shipping transit interpretation that relies on unconstrained model guesswork
- Preserve the strongest parts of the current natal reading result
- Keep time-unknown handling explicit and conservative
- Avoid broad unrelated refactors in adjacent routes

## 3. Phase 1: Public Natal Rollout

### 3.1 Remove Access Gate
Tasks:
- remove password requirement from `/api/astro/natal`
- remove password requirement from `/api/astro/share/big-three` if public export is desired
- retire or bypass `/api/astro/access`
- remove beta-only access logic from `/astro`

Deliverable:
- natal reading becomes publicly available

### 3.2 Consolidate Into `/astrology`
Tasks:
- embed `NatalChartWidget` directly into `/astrology`
- remove “private beta” framing and CTA language
- decide whether `/astro` redirects to `/astrology` or becomes an alias page
- update metadata and copy to reflect public availability

Deliverable:
- one public astrology experience at `/astrology`

### 3.3 Reframe Result UI
Tasks:
- regroup current result modules into clearer sections
- rename “Shadows” to “Growth Edges” if tone review supports it
- keep paradox, mantra, and share/export modules
- add a trust/explanation block below or near the result

Deliverable:
- natal result feels more structured and trustworthy

## 4. Phase 2: Style Control and Prompt Hardening

### 4.1 Natal Prompt Refinement
Tasks:
- update prompt instructions in `src/lib/openai/respond.ts`
- encode banned writing patterns:
  - no em dashes
  - no “it’s not X, it’s Y”
  - no generic coaching language
  - no inflated certainty
- tighten tone guidance toward measured, dignified, source-aware prose

Deliverable:
- improved natal-reading voice on the current model

### 4.2 Output Safeguards
Tasks:
- add lightweight post-processing checks for banned patterns where practical
- preserve canonical sign and rising enforcement
- add fallback copy or retry behavior if output violates core style rules

Deliverable:
- more consistent brand voice with low-cost safeguards

## 5. Phase 3: Transit Data Layer

### 5.1 Transit Computation Model
Tasks:
- define a new transit request/response schema
- compute a 30-day transit window from the current date
- calculate positions/events through the astro service or adjacent computation layer
- determine which event types are required for launch

Deliverable:
- deterministic structured transit payload

### 5.2 Event Selection
Tasks:
- implement event filtering and priority ranking
- include:
  - lunations
  - lunar quarters
  - planetary ingresses
  - retrograde/direct stations
  - high-signal transit-to-natal aspects
- exclude noisy low-value daily events

Deliverable:
- compact, high-signal event list suitable for interpretation

### 5.3 Unknown Time Degradation
Tasks:
- create a separate handling path for time-unknown users
- omit houses, Ascendant-based transit claims, and high-specificity timing
- ensure monthly reading remains useful without overclaiming

Deliverable:
- trust-preserving transit output for incomplete birth data

## 6. Phase 4: Monthly Reading UI

### 6.1 Result Architecture
Tasks:
- add a “Next 30 Days” section beneath natal output
- decide whether this is inline, collapsible, or tabbed
- add lunar-stage sub-section
- add “what to watch” and “what to practice” framing

Deliverable:
- clear monthly reading layer that complements natal output

### 6.2 Repeat-Visit Loop
Tasks:
- add “come back next month” prompt
- add astrology-specific email CTA or monthly reminder framing
- consider lightweight saved history later if storage model supports it

Deliverable:
- astrology becomes a recurring habit surface

## 7. Suggested Technical Work Order

1. ungate `/api/astro/natal`
2. ungate share export if desired
3. embed widget into `/astrology`
4. simplify or redirect `/astro`
5. refine natal prompt and style constraints
6. verify public natal flow end to end
7. define transit schema and event-selection logic
8. implement monthly-reading backend
9. wire monthly-reading UI
10. add repeat-use CTA and analytics checks

## 8. Verification Plan

For the public natal rollout:
- run `npm run build`
- run `npm run lint`
- verify `/astrology` renders with live form
- verify natal generation works with known birth time
- verify natal generation works with unknown birth time
- verify share export still works if kept public
- verify `/astro` behavior after consolidation

For the transit phase:
- verify transit payload contains only supported event types
- verify monthly reading never invents unsupplied events
- verify time-unknown reading avoids houses and rising claims
- manually inspect multiple readings for banned voice patterns

## 9. Analytics / Product Checks

Track after public launch:
- astrology page visits
- natal submissions
- completion rate
- email CTA clicks after reading
- share/export usage
- repeat visits from astrology users

Track after transit launch:
- percentage of users who request the monthly reading
- repeat monthly visits
- relative conversion from natal-only vs natal-plus-transit users

## 10. Immediate Next Build Slice

If implementation starts now, the highest-leverage first slice is:
- remove the password gate
- move the live natal widget into `/astrology`
- replace beta framing with public trust framing
- refine the natal prompt for style and anti-LLM constraints

This yields the strongest near-term product gain without waiting on the transit engine.
