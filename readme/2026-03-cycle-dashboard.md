# Cycle Dashboard — Implementation Plan v1

## Scope: Foundation Build

Build the core cycle tracker as a private route at `/cycle`. This first pass focuses on cycle calculation, phase-aware theming, and the daily awareness dashboard. No external API integrations yet (GitHub, Unsplash) — those come later.

## Files to Create

### 1. `lib/cycle.ts` — Cycle Calculation Engine

Pure functions, no side effects. Core logic:

- `getFirstMonday(year, month)` — first Monday of any month
- `isQuarterlyMonth(month)` — Jan, Apr, Jul, Oct
- `getCyclePhases(year, month)` — returns array of 4 phase date ranges
  - Phase 1: Mon–Sun (2 weeks for quarterly months)
  - Phases 2–3: Mon–Sun each
  - Phase 4: Mon–Thu, then rest Fri–Sun
  - Handle variable month lengths gracefully
- `getCurrentPhase(date?)` — returns current phase number (1–4), or `'rest'` / `'transition'` for gap days
- `getPhaseProgress(date?)` — returns { phase, dayInPhase, totalDaysInPhase, daysRemaining, isTransitioning }
- `getCycleForDate(date?)` — full cycle object with all phase date ranges, current status

### 2. `lib/cycle-theme.ts` — Phase Configuration & Theming

Each phase defined with:

- `name` — seasonal name (Winter, Spring, Summer, Autumn)
- `moonPhase` — New Moon, Waxing, Full Moon, Waning
- `mantra` — one-line for each phase
- `colors` — OKLCH-based palette: background, foreground, accent, muted
- `gradient` — CSS gradient string for background
- `description` — what happens in this phase

Exports a function `getPhaseTheme(phase)` and `getTransitionTheme(fromPhase, toPhase, progress)` for smooth blending between phases during the 2-day transition window.

### 3. `app/(private)/cycle/page.tsx` — Dashboard Page

The main view. Shows:

- Current phase name, moon phase, mantra
- Visual progress through the cycle (arc or timeline)
- Days remaining in current phase
- Transition nudge when within 2 days of phase shift
- Phase-appropriate gradient background that fills the viewport
- Quick view of what this phase is about

### 4. `app/(private)/cycle/phase-indicator.tsx` — Phase Visual

A visual component showing:

- Circular or arc progress through the 4 phases
- Current position highlighted
- Phase names around the circle
- Moon phase icon

### 5. `app/(private)/cycle/ritual-checklist.tsx` — Ritual Checklist

Phase-appropriate ritual items (hardcoded from the spec for now):

- Phase 1: kickoff gate, review board, quarterly plan, team sync, curate links, set intentions, generate report
- Phase 2: deep work items, Tuesday showcase
- Phase 3: Tuesday showcase, shipping focus, convergence checklist
- Phase 4: final showcase, Thursday closeout, retrospective, defer items

Uses localStorage for check state in v1 (Supabase persistence later).

### 6. `app/(private)/cycle/cycle-timeline.tsx` — Month Timeline

A horizontal timeline showing the full month's cycle:

- All 4 phases as segments
- Current day marker
- Phase transition points
- Today indicator with pulse

### 7. CSS additions in `styles/globals.css`

CSS custom properties for phase theming:

- `--cycle-bg`, `--cycle-fg`, `--cycle-accent`, `--cycle-muted`
- `--cycle-gradient` for background
- Smooth CSS transitions (2s ease) so color changes feel organic

## Architecture Decisions

- **No database yet**: Ritual check-offs use localStorage. Cycle calculation is pure math from the current date — no stored state needed for phase awareness.
- **No external APIs yet**: GitHub activity, Unsplash backgrounds, Todoist integration are all future layers. The foundation needs to work first.
- **Client-side rendering**: The dashboard is inherently personal and real-time. `'use client'` for the page, with the cycle calculation running on each render (it's just date math).
- **Phase transitions**: Colors blend over a 2-day window before phase shifts. The `getTransitionTheme()` function interpolates between phase palettes.

## Implementation Order

1. `lib/cycle.ts` — calculation logic (testable in isolation)
2. `lib/cycle-theme.ts` — phase configs and color palettes
3. CSS custom properties in globals.css
4. `app/(private)/cycle/page.tsx` — dashboard shell
5. `phase-indicator.tsx` — visual phase display
6. `cycle-timeline.tsx` — month timeline
7. `ritual-checklist.tsx` — checklists
8. Add "Cycle" link to navigation menu
