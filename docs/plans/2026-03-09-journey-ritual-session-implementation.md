# Journey Ritual Session Implementation Plan

Date: 2026-03-09
Source Design: `docs/plans/2026-03-09-journey-ritual-session-design.md`
Status: Ready for execution

## 1. Goal

Transform `/journey` from a geometry viewer with principle cards into a guided meditative session with:
- better hierarchy
- clearer pacing
- stronger contemplative value
- improved desktop/mobile experience

## 2. Constraints

- Preserve the broader Awareness Paradox visual language
- Avoid turning the page into another essay or study index
- Keep the control surface minimal
- Maintain usable performance on desktop and mobile

## 3. Phase 1: Structural Overhaul

### 3.1 Replace the current layout
Tasks:
- remove the gallery-dominant composition
- introduce explicit ritual stages: arrival, breath, principle, reflection, integration
- make the geometry stage contained rather than oversized

Deliverable:
- a page whose structure clearly communicates “guided session”

### 3.2 Rework desktop and mobile hierarchy
Tasks:
- reduce geometry frame height and visual dominance
- prioritize text and pacing on mobile
- simplify chapter navigation
- keep previous/next controls accessible without crowding

Deliverable:
- clear visual balance across breakpoints

## 4. Phase 2: Meditation Content Model

### 4.1 Extend principle data
Tasks:
- add meditation-specific fields for each principle
- preserve existing study-oriented fields for other routes

Suggested fields:
- `meditationTitle`
- `breathCue`
- `focusLine`
- `meditationBody`
- `reflectionPrompt`
- `integrationLine`

Deliverable:
- reusable ritual-session data model

### 4.2 Rewrite journey copy
Tasks:
- replace explanatory copy blocks with guided-practice copy
- reduce list-heavy presentation
- write one strong reflection prompt per principle

Deliverable:
- contemplative copy aligned to ritual pacing

## 5. Phase 3: Geometry Behavior Rework

### 5.1 Tune geometry as focal object
Tasks:
- reduce default scale and camera dominance
- adjust frame sizing and viewer padding
- make the geometry behave like a ritual anchor instead of a feature demo

Deliverable:
- geometry supports attention instead of competing with it

### 5.2 Add principle-specific motion behaviors
Tasks:
- map one clear motion language to each principle
- reduce unnecessary motion intensity
- favor meditative rhythm over spectacle

Deliverable:
- distinct but coherent chapter moods

## 6. Phase 4: Session Controls and Variants

### 6.1 Core controls
Tasks:
- implement begin/pause/next/previous/stillness interactions cleanly
- ensure session progress is legible without being noisy

Deliverable:
- stable guided control flow

### 6.2 Optional later variants
Tasks:
- add shorter session modes
- consider resume state or remembered progress

Deliverable:
- repeat-use flexibility without bloating the first release

## 7. Verification Plan

For each build phase:
- review mobile and desktop visual balance
- confirm the geometry no longer dominates the practice text
- confirm keyboard and touch usability
- verify reduced-motion behavior
- run lint and build before claiming completion

## 8. Recommended Execution Order

1. Layout overhaul
2. Meditation data model
3. Copy rewrite
4. Geometry resizing and containment
5. Principle-specific motion behaviors
6. Session control polish
7. Optional duration variants

## 9. Immediate First Slice

If implementation starts now, the highest-leverage first slice is:
- rebuild layout around ritual stages
- shrink and contain the geometry stage
- replace principle cards with guided meditation copy

This alone should solve the current “too much geometry, too little practice” problem before any advanced animation work.
