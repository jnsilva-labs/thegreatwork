# Astrology Month-Ahead Transits Implementation Plan

Date: 2026-03-09
Source Design: `docs/plans/2026-03-09-astrology-month-ahead-transits-design.md`
Status: Ready for execution

## 1. Implementation Goal

Add an on-demand `See the Month Ahead` feature to the public astrology experience that:
- computes a 30-day transit payload
- interprets only explicit computed events
- includes lunar-stage guidance
- respects unknown-birth-time limitations
- instruments the funnel so usage can be studied in detail

## 2. Constraints

- Keep natal reading generation intact and fast
- Do not auto-generate monthly readings on every natal request
- Do not let the LLM invent transit events
- Preserve low-cost operation on `gpt-4.1-mini`
- Keep version 1 focused on high-signal events only

## 3. Phase 1: Transit Data Contract

### 3.1 Add Transit Request and Response Types
Tasks:
- define request shape for a month-ahead reading
- define transit event types
- define monthly reading output schema
- define lunar-stage item schema

Deliverable:
- stable TS/Zod contracts for event computation and interpretation

### 3.2 Decide Event Payload Structure
Tasks:
- represent each event with date/date range, event type, bodies involved, aspect if applicable, and priority
- model unknown-birth-time constraints explicitly in payload metadata
- include derived natal summary needed by the monthly interpreter

Deliverable:
- compact, interpretation-ready transit payload

## 4. Phase 2: Transit Computation Layer

### 4.1 Compute 30-Day Window
Tasks:
- create a start date and end date window from current date
- determine UTC/date handling strategy
- ensure event dates display cleanly for the end user

Deliverable:
- deterministic 30-day calculation frame

### 4.2 Compute Lunar Stages
Tasks:
- calculate New Moon, First Quarter, Full Moon, Last Quarter within the window
- normalize into readable event objects

Deliverable:
- lunar rhythm event set

### 4.3 Compute Major Sky Shifts
Tasks:
- compute ingresses
- compute retrograde stations
- compute direct stations

Deliverable:
- major-month-atmosphere event set

### 4.4 Compute Transit-to-Natal Contacts
Tasks:
- compute major transit contacts to natal Sun, Moon, and Rising
- start with:
  - Jupiter
  - Saturn
  - Uranus
  - Neptune
  - Pluto
- include Mars, Venus, Mercury only under tight orb thresholds

Deliverable:
- curated contact event set for interpretation

## 5. Phase 3: Event Selection and Filtering

### 5.1 Priority Rules
Tasks:
- rank events by signal strength
- cap result set to a manageable size
- prefer fewer high-value events over many low-value ones

Deliverable:
- filtered interpretation payload

### 5.2 Unknown Time Degradation
Tasks:
- remove Ascendant and house-related transit claims when timeUnknown is true
- ensure the event list remains useful without angles/houses

Deliverable:
- trust-preserving unknown-time behavior

## 6. Phase 4: Month-Ahead Interpretation Route

### 6.1 New API Route
Tasks:
- add a new API route, likely under `/api/astro/month-ahead`
- validate request input
- calculate event payload
- call OpenAI only after event payload is finalized
- return structured JSON response

Deliverable:
- production-ready month-ahead API route

### 6.2 Prompt and Schema
Tasks:
- add month-ahead prompt alongside natal prompt
- encode:
  - only use supplied events
  - no invented forecasts
  - no deterministic claims
  - no em dashes
  - no “it is not X, it is Y”
- define response schema:
  - overview
  - majorThemes
  - transitHighlights
  - lunarStages
  - practiceSuggestions
  - cautions
  - closingLine
  - disclaimer

Deliverable:
- disciplined month-ahead interpreter

## 7. Phase 5: Astrology UI Integration

### 7.1 Add On-Demand CTA
Tasks:
- add `See the Month Ahead` button below natal result
- add loading, success, and error states
- keep natal experience unchanged until the user opts in

Deliverable:
- clean second-step interaction

### 7.2 Render Month-Ahead Card
Tasks:
- add a dedicated monthly reading card under natal output
- structure sections for overview, themes, highlights, lunar rhythm, practice, cautions, and close
- add a subtle return CTA

Deliverable:
- coherent public monthly reading UI

## 8. Phase 6: Analytics Instrumentation

### 8.1 Natal Funnel Events
Tasks:
- instrument:
  - `astro_page_view`
  - `astro_natal_submit`
  - `astro_natal_success`
  - `astro_natal_error`
  - `astro_time_unknown_enabled`
  - `astro_share_export`

Deliverable:
- measurable natal funnel

### 8.2 Month-Ahead Events
Tasks:
- instrument:
  - `astro_month_ahead_click`
  - `astro_month_ahead_success`
  - `astro_month_ahead_error`
  - `astro_month_ahead_cta_click`
  - `astro_chart_details_open`

Deliverable:
- measurable engagement and conversion layer for the new feature

## 9. Suggested Work Order

1. define transit schemas
2. build 30-day date/window utilities
3. compute lunar stages
4. compute major sky shifts
5. compute transit-to-natal contacts
6. add filtering/prioritization
7. build month-ahead API route
8. add prompt + response schema
9. add UI button and result card
10. add analytics events
11. run end-to-end verification

## 10. Verification Plan

### Data Verification
- verify lunar-stage dates fall inside 30-day window
- verify transit event payload uses only supported event categories
- verify filtered event count stays within designed range
- verify unknown-time requests omit prohibited claims

### API Verification
- verify success path for known birth time
- verify success path for unknown birth time
- verify invalid requests return structured errors
- verify model responses conform to schema

### UI Verification
- verify natal result still renders without regression
- verify `See the Month Ahead` button only appears after natal success
- verify loading and error states are understandable
- verify monthly reading card renders in both desktop and mobile layouts

### Funnel Verification
- verify all analytics events fire with expected timing
- verify no duplicate event firing on refresh or repeated renders

## 11. Immediate Next Build Slice

If implementation begins now, the highest-leverage first slice is:
- add transit types and schemas
- implement lunar-stage computation
- implement major-sky-shift computation
- define filtered event payload

This creates the foundation for a trustworthy month-ahead reading before any UI or model work is layered on top.
