# Astrology Month-Ahead Transits Design

Date: 2026-03-09
Status: Approved (brainstorming design)
Owner: Awareness Paradox

## 1. Purpose

Add a second-step astrology feature that gives users a meaningful reason to return after receiving a natal reading.

The new feature should:
- build on the public natal experience already live on `/astrology`
- offer a structured `See the Month Ahead` reading on demand
- preserve interpretive trust by relying on computed events rather than model guesswork
- surface enough signal to be useful without drowning users in technical detail
- create a measurable behavior loop so Awareness Paradox can learn what actually holds attention

## 2. Locked Decisions

### Trigger Model
- The monthly reading is computed only when the user explicitly asks for it
- The trigger label is `See the Month Ahead`

### Reading Window
- Use a rolling next-30-days window
- Include lunar-stage guidance within that same window

### Product Role
- Natal reading remains the primary astrology experience
- Month-ahead reading is the second layer
- The month-ahead reading should make return visits feel natural and worthwhile

### Analytics Priority
- Track the full astrology funnel, not just page views
- Use the month-ahead feature to learn who is paying attention, what is working, and where visitors fall away

## 3. Product Thesis

The natal reading tells a user what pattern they carry.

The month-ahead reading tells them what season they are entering.

Those two layers should feel connected but distinct. The natal result is foundational. The month-ahead result is situational.

This feature should not behave like a generic horoscope add-on. It should feel like a serious monthly briefing shaped by:
- natal context
- explicit transit events
- lunar timing
- practical symbolic interpretation

## 4. User Experience Shape

### Base Flow
1. User lands on `/astrology`
2. User submits natal form
3. Natal reading appears
4. User sees a secondary button: `See the Month Ahead`
5. If clicked, the system computes the 30-day transit reading
6. The month-ahead card appears beneath the natal result

### Why On-Demand
This model is preferred because it:
- keeps natal generation fast
- keeps early-stage API cost under control
- gives a clear signal of deeper user intent
- preserves a sense of progression in the product

## 5. Event Model

The monthly reading should be generated from a curated set of computed events, not raw sky noise.

### Category A: Lunar Stages
Always include:
- New Moon
- First Quarter
- Full Moon
- Last Quarter

These create the basic rhythm of the month and are accessible even to users with minimal astrology background.

### Category B: Major Sky Shifts
Include when they occur within the 30-day window:
- planetary ingresses
- retrograde stations
- direct stations

These establish the broader atmosphere of the month.

### Category C: Transit-to-Natal Contacts
Include only high-signal contacts to major natal points.

Priority v1:
- transiting Jupiter, Saturn, Uranus, Neptune, Pluto to natal Sun, Moon, Rising
- transiting Mars, Venus, Mercury to natal Sun, Moon, Rising only when very tight

Future expansion:
- chart ruler contacts
- select natal personal planets
- more nuanced chart emphasis once chart-ruler and house logic are stable

### Category D: Event Limits
For the first release, target roughly:
- 3 to 5 major themes
- 4 to 8 highlighted events
- 4 lunar-stage cues
- 3 to 5 practice suggestions

This keeps the output readable and prevents false richness.

## 6. What to Exclude in Version 1

Do not include:
- every Moon transit to natal planets
- low-value daily aspect spam
- minor or overly technical aspect types
- house-based delineation when birth time is unknown
- filler ingresses that do not materially affect the reading
- anything that makes the model sound exhaustive while actually becoming vague

The reading should feel selected, not dumped.

## 7. Aspect and Orb Discipline

Recommended aspect types for v1:
- conjunction
- square
- trine
- opposition
- sextile

Recommended approach:
- use tighter orbs for fast-moving planets
- allow slightly more flexibility only where interpretively justified
- prefer fewer cleaner events over more dubious ones

## 8. Unknown Birth Time Rules

When birth time is unknown:
- do not use houses
- do not use Ascendant-based claims
- do not rely on angle-based timing
- reduce specificity in interpretive claims
- focus the reading on Sun, Moon, and slower transit patterning

This limitation should be framed as part of the trust model, not hidden or apologized for.

## 9. Monthly Reading Structure

The month-ahead result should be organized like a concise symbolic briefing.

### A. Overview
One compact paragraph describing the broad climate of the next 30 days in relation to the natal chart.

### B. Major Themes
Return 3 to 5 themes only.

The goal is synthesis, not exhaustiveness.

### C. Transit Highlights
For each highlighted event:
- date or date range
- event name
- why it matters for this chart
- what to pay attention to

### D. Lunar Rhythm
Include four brief cues:
- New Moon
- First Quarter
- Full Moon
- Last Quarter

Each should answer:
- what this phase emphasizes
- what form of attention or practice it supports

### E. Practice Suggestions
Return 3 to 5 grounded suggestions such as:
- a journaling prompt
- a relational check-in
- a pacing adjustment
- a contemplative exercise
- a practical area to watch

### F. Cautions
Keep these sober and restrained.

They should warn against likely overreactions or confusions without sliding into fear language.

### G. Closing Line
End with one memorable orienting sentence that gathers the month into one clear direction.

## 10. Interpretive Guardrails

The model must only interpret supplied events. It must not infer or invent sky events.

Prompt instructions for the monthly layer should explicitly require:
- use only supplied transit payload
- do not invent dates, aspects, stations, or lunar events
- do not predict specific external outcomes
- frame guidance as symbolic timing and reflective practice
- acknowledge uncertainty when birth time is unknown
- preserve Awareness Paradox tone and anti-LLM style rules

## 11. Analytics and Behavior Tracking

The month-ahead feature should be instrumented as part of a broader astrology funnel.

### Funnel Layers

#### Acquisition
- `astro_page_view`
- source / referrer

#### Activation
- `astro_natal_submit`
- `astro_natal_success`
- `astro_natal_error`
- `astro_time_unknown_enabled`
- `astro_share_export`

#### Engagement
- `astro_month_ahead_click`
- `astro_month_ahead_success`
- `astro_month_ahead_error`
- `astro_chart_details_open`
- return visit to `/astrology`

#### Conversion
- CTA clicks after natal reading
- CTA clicks after month-ahead reading
- guide / Substack signup from astrology page

### What This Should Teach
The site owner should be able to learn:
- what percentage of astrology visitors submit the natal form
- what percentage of natal users ask for the monthly reading
- whether the month-ahead layer increases conversion
- whether unknown-birth-time users still engage
- whether export/share correlates with return behavior

## 12. Success Criteria

This feature is working if:
- a meaningful percentage of natal users click `See the Month Ahead`
- users spend more time in the astrology experience
- conversion after the reading improves
- users begin to return for repeated readings
- the month-ahead result feels more serious and useful than generic horoscope products

## 13. Recommended Rollout

### Phase A
- define transit event schema
- compute 30-day event payload
- add analytics events for click and request flow

### Phase B
- implement month-ahead API route and model prompt
- keep response schema strict

### Phase C
- add `See the Month Ahead` button and loading state in the UI
- render the month-ahead card below natal results

### Phase D
- review live usage data
- tune event filters, output structure, and CTA placement based on actual behavior
