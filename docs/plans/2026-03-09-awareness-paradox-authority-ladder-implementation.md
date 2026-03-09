# Awareness Paradox Authority Ladder Implementation Plan

Date: 2026-03-09
Source Design: `docs/plans/2026-03-09-awareness-paradox-authority-ladder-design.md`
Status: Ready for execution

## 1. Implementation Goal

Translate the approved authority-ladder strategy into a phased delivery plan that improves:
- audience clarity
- authority signaling
- traffic capture
- email conversion
- repeat engagement
- social distribution efficiency

## 2. Constraints

- Preserve the existing visual language and scrollytelling architecture
- Avoid broad unrelated refactors
- Keep beginner entry points clear without diluting practitioner depth
- Build with reusable content systems, not one-off page copy
- Respect current in-progress code changes in the worktree

## 3. Phase 1: Core Ladder and Funnel Clarity

### 3.1 Homepage
Goals:
- reduce ambiguity in the hero
- add visible audience-level entry paths
- create more actionable next steps

Tasks:
- add a short audience line beneath the hero
- replace the current two-button hero CTA cluster with a three-door ladder
- map each homepage section to one explicit next step
- add a compact “choose your path” module near the top

Deliverable:
- homepage routes users into beginner, tool-first, and depth-first flows

### 3.2 Start Here
Goals:
- make `/start-here` the true initiation hub
- convert guide readers into ongoing participants

Tasks:
- rewrite page structure around a first-week path
- replace placeholder “coming soon” language with live next steps where possible
- add beginner tarot and astrology bridges
- add recommended reading order and best next page list

Deliverable:
- a usable first-week orientation hub

### 3.3 Email Entry Points
Goals:
- shift from one generic subscription promise to intent-matched invitations

Tasks:
- refactor CTA copy and variants in shared email components
- create page-specific email promise variants
- define beginner, tarot, astrology, and advanced-study entry language
- ensure all major public pages have one primary and one secondary email action

Deliverable:
- segmented conversion language across the site

## 4. Phase 2: Public Authority Surfaces

### 4.1 Astrology Bridge Page
Goals:
- make astrology public-facing before the full tool rollout
- capture demand and establish tone

Tasks:
- rewrite `/astrology` around usefulness and positioning
- add “what this is / what this is not”
- add natal-chart beginner section
- add big-three explainer or preview
- add sample output or preview card
- add waitlist/beta CTA

Deliverable:
- public-ready astrology bridge page

### 4.2 Authority Page Template System
Goals:
- normalize authority signaling across the corpus

Tasks:
- create a repeatable editorial block pattern
- add source notes and related explorations modules
- define direct summary + historical context + modern application structure
- apply to `/great-work`, `/principles`, `/gallery`, and future essays

Deliverable:
- consistent authority page framework

### 4.3 Study Map
Goals:
- show visible progression across domains

Tasks:
- create a dedicated `study map` or `path` page
- define beginner, intermediate, and advanced routes
- interlink tools and essays into one progression map

Deliverable:
- public curriculum map for the brand

## 5. Phase 3: Engagement and Habit Loops

### 5.1 Tarot Product Upgrades
Goals:
- increase repeat visits and session depth

Tasks:
- add beginner mode / practitioner mode
- add card of the day
- add spread of the week
- add saved readings if storage model allows
- generate journal prompts from readings
- create shareable insight-card export flow

Deliverable:
- tarot becomes the primary engagement engine

### 5.2 Related Exploration Loop
Goals:
- improve internal linking and session continuation

Tasks:
- add related content modules across authority pages
- connect tools to essays and essays to tools
- define canonical “next best step” blocks by audience level

Deliverable:
- stronger movement through the site

## 6. Phase 4: Content System and Automation

### 6.1 Content Registry
Goals:
- make every core asset reusable across channels

Tasks:
- define a data model for source assets
- store thesis, quotes, audience, CTA, and derivative status
- determine whether the registry lives in code, markdown frontmatter, or CMS

Deliverable:
- structured source-of-truth content inventory

### 6.2 Social Draft Generation
Goals:
- turn one source asset into channel-ready drafts

Tasks:
- define output templates for:
  - X thread
  - Instagram carousel
  - TikTok/Shorts script
  - newsletter intro
  - short caption post
- implement draft generation workflow with approval status
- tag content by claim type and audience level

Deliverable:
- repeatable multi-channel content drafting workflow

### 6.3 Scheduling Integration
Goals:
- reduce manual scheduling burden

Tasks:
- integrate approved draft export with Buffer or Metricool workflow
- define evergreen queues by content family
- add monthly performance review loop

Deliverable:
- lean but scalable social publishing pipeline

## 7. Verification Plan

For each phase:
- verify page copy in context on desktop and mobile
- verify CTA clarity and route behavior
- verify no broken internal links
- run lint, tests, and build before claiming completion
- where analytics are present, confirm event instrumentation or conversion path integrity

## 8. Recommended Execution Order

1. Homepage ladder
2. Start Here upgrade
3. Email CTA segmentation
4. Astrology bridge page
5. Authority page templates
6. Study map
7. Tarot habit loops
8. Content registry
9. Social draft workflow
10. Scheduler integration

## 9. Open Decisions for Later

- whether advanced study should be framed as membership, cohort, or service
- whether astrology launches as beta gate, waitlist, or fully public tool
- whether content registry should remain file-based or move into a CMS
- whether social scheduling should start with Buffer or go directly to Metricool

## 10. Immediate Next Build Slice

If implementation starts now, the highest-leverage first slice is:
- homepage authority ladder
- start-here expansion
- email CTA segmentation
- astrology bridge page

This slice improves brand clarity, traffic conversion, and email growth without waiting on the deeper automation stack.
