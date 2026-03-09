# Public Astrology Experience Design

Date: 2026-03-09
Status: Approved (brainstorming design)
Owner: Awareness Paradox

## 1. Purpose

Turn astrology into a public, integrated product surface inside Awareness Paradox that:
- increases visits and session depth
- creates a personal entry point into the brand
- grows email signups and return visits
- preserves symbolic seriousness and trust
- avoids generic astrology-app tone and low-integrity prediction language

This design covers product shape, interpretive guardrails, model usage, and rollout sequence for the public astrology experience.

## 2. Locked Decisions

### Access Model
- Remove password protection from the natal tool
- Stop treating `/astrology` as a bridge page with a hidden product behind it
- Make `/astrology` the public astrology experience

### Product Shape
- Use one integrated public page
- Keep natal reading as the primary entry experience
- Add a next-30-days reading as the second layer
- Include lunar-stage guidance inside that 30-day reading

### Positioning
- Astrology should be presented as symbolic timing, temperament, and correspondence
- It should not be framed as deterministic prediction
- It should serve both beginners and more experienced symbolic readers

### Model Strategy
- Stay on `gpt-4.1-mini` for now
- Reassess model upgrade after user growth, repeat usage, or quality feedback justifies it

## 3. Core Product Thesis

Astrology is one of the few parts of Awareness Paradox that can create immediate personal relevance.

The rest of the site builds authority and atmosphere. Astrology can build attachment.

That makes it a growth surface, not just a study page.

The section should therefore do three things at once:
- establish credibility
- produce a useful personal reading
- create a reason to return

## 4. Public Page Architecture

`/astrology` should become the actual tool page, not just the marketing wrapper.

### Section A: Orientation
Keep:
- worldview framing
- historical lineage
- what astrology is here
- what it is not

Adjustments:
- reduce front-loaded copy slightly so the tool appears sooner
- preserve seriousness without making the page feel like a lecture

### Section B: Live Natal Tool
Public form fields:
- name optional
- birth date
- birth time
- time unknown toggle
- birth place
- house system

This tool should sit directly on `/astrology`.

### Section C: Natal Reading Result
Retain the current strong elements:
- big three
- snapshot
- strengths
- shadows
- paradox
- mantra
- sigil/export/share

Restructure result into clearer sections:
- Natal Snapshot
- Core Pattern
- Strengths
- Growth Edges
- Relationship Tone
- Work / Calling
- Practice Keys

### Section D: Next 30 Days
Add a distinct monthly reading beneath the natal result.

This should answer:
- what is moving now
- what this may stir
- what to watch
- what to practice

The monthly reading should not be blended into natal interpretation. Natal tells the user what pattern they carry. The 30-day reading tells them what season they are entering.

### Section E: Lunar Rhythm
Inside the 30-day reading, include:
- next New Moon
- first quarter
- Full Moon
- last quarter

Each phase should have one short reflection cue, not a long forecast paragraph.

### Section F: Trust Layer
Add one compact explanation block that states:
- birth data is geocoded and normalized to UTC
- chart positions are computed from ephemeris data
- upcoming sky events are computed before interpretation
- the reading is reflective guidance, not deterministic prediction

### Section G: Return Loop
End the experience with:
- come back next month
- save or export the reading
- join the astrology letters / email path

## 5. Accuracy Model

Accuracy must come from precomputed data, not from model improvisation.

### Natal Reading
Keep the current architecture:
- geocode birthplace
- derive timezone
- convert local birth time to UTC
- compute natal chart with Swiss Ephemeris
- derive canonical big three and placements
- pass structured chart data into the model

### 30-Day Transit Reading
Use a structured transit pipeline:
1. Compute a 30-day window from the request date
2. Compute transit positions for that period
3. Extract only high-signal events
4. Build a structured interpretation payload
5. Pass that payload into the model
6. Validate against a strict response schema

### Event Types to Include
- New Moon
- Full Moon
- lunar quarters
- planetary ingresses
- retrograde stations
- direct stations
- major transits to natal Sun, Moon, Rising, chart ruler, and key personal planets

### Priority Filter
Use only high-signal events. Avoid flooding the model with daily sky noise.

Recommended priority order:
- lunations
- Jupiter and Saturn contacts to major natal points
- outer-planet contacts when clearly relevant
- Mercury, Venus, and Mars contacts only when tightly aspecting important natal placements
- sign ingresses only when they materially alter the reading frame

### Unknown Birth Time Handling
If birth time is unknown:
- omit house claims
- omit Ascendant-specific interpretation
- avoid house-based transit claims
- weaken timing specificity
- focus on transits to Sun, Moon, and slower-moving planetary themes

This limitation should be stated clearly and treated as a trust feature, not a weakness.

## 6. Interpretation Guardrails

The model must never be asked to infer the sky on its own.

It should be instructed to:
- use only supplied natal and transit data
- avoid inventing placements, events, or timing
- avoid deterministic claims
- avoid specific external predictions
- frame outputs as observation, seasonality, and attention
- acknowledge uncertainty cleanly when birth time is unknown

### Required Output Shape for Monthly Reading
Recommended fields:
- title
- timeframe
- overview
- majorThemes
- transitHighlights
- lunarStages
- practiceSuggestions
- cautions
- closingLine
- disclaimer

## 7. Writing Style and Voice

The astrology voice should feel more like thoughtful Hellenistic or symbolic practitioners than app-store mysticism.

### Desired Qualities
- clear
- measured
- dignified
- source-aware
- non-fatalistic
- reflective without sounding therapeutic or mushy

### Influences
Copy should be informed by:
- meditative clarity associated with teachers such as Alan Watts, Ram Dass, and Thich Nhat Hanh
- the seriousness and observational precision associated with strong Hellenistic and traditional astrology writing

This means calm, spacious language with intellectual weight, not trend language.

### Explicit Anti-Patterns
Disallow:
- em dashes
- “it’s not X, it’s Y” constructions
- generic coaching language
- therapy clichés
- inflated certainty
- fear-based transit hype
- vague “the universe wants you to…” phrasing

### Enforcement Strategy
Prompt rules alone are not enough. Enforce style through:
- explicit banned-pattern instructions
- curated examples or few-shot samples later if needed
- output review and rejection rules for repeated bad patterns

## 8. Cost and Growth Tradeoff

Using `gpt-4.1-mini` is acceptable at this stage because:
- per-use cost is low enough to support experimentation
- astrology can function as a growth engine rather than a static content page
- the feature can create return visits and email conversion if designed well

This makes sense only if the tool is tied to growth outcomes:
- stronger session depth
- more shares
- more email signups
- monthly return loops

It should not become an unlimited free novelty generator with no follow-up value.

## 9. Rollout Recommendation

### Phase A
- remove password gate
- expose natal tool publicly
- integrate tool into `/astrology`

### Phase B
- refactor the astrology result UI for clearer public-facing structure
- improve trust copy and repeat-use CTAs

### Phase C
- build transit computation pipeline
- add event selection and structured monthly interpretation payload

### Phase D
- launch 30-day reading with lunar-stage guidance
- add return-loop features and analytics review

## 10. Success Criteria

This redesign is working if:
- astrology becomes one of the most-used entry points on the site
- users stay longer on page after generating readings
- more users subscribe after a reading
- monthly return behavior emerges once transit readings launch
- the output feels more serious and trustworthy than mass-market astrology apps
