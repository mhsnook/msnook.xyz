/**
 * Cycle calculation engine.
 *
 * The monthly creative cycle has four phases, each one week:
 *   Phase 1 (Winter / New Moon)  — Planning
 *   Phase 2 (Spring / Waxing)    — Week 1
 *   Phase 3 (Summer / Full Moon) — Week 2
 *   Phase 4 (Autumn / Waning)    — Week 3 (harvest & ship)
 *
 * Phase 1 begins on the first Monday of each month.
 * In quarterly months (Jan, Apr, Jul, Oct), Phase 1 extends to two weeks.
 * Phase 4 runs through until the next cycle starts.
 */

export type PhaseNumber = 1 | 2 | 3 | 4
export type CycleStatus = PhaseNumber

export interface PhaseRange {
	phase: PhaseNumber
	start: Date
	end: Date // inclusive — last day of the phase
	days: number
}

export interface Cycle {
	year: number
	month: number // 0-indexed (JS convention)
	isQuarterly: boolean
	phases: PhaseRange[]
	cycleStart: Date
	cycleEnd: Date
}

export interface PhaseProgress {
	cycle: Cycle
	phase: PhaseNumber
	status: CycleStatus
	dayInPhase: number // 1-indexed
	totalDaysInPhase: number
	daysRemaining: number
	isTransitioning: boolean // within 2 days of next phase
	transitionProgress: number // 0–1, how far into the 2-day transition window
	phaseFraction: number // 0–1, progress through the entire phase
}

// ── Helpers ─────────────────────────────────────────────────────────

function startOfDay(d: Date): Date {
	const r = new Date(d)
	r.setHours(0, 0, 0, 0)
	return r
}

function addDays(d: Date, n: number): Date {
	const r = new Date(d)
	r.setDate(r.getDate() + n)
	return r
}

function daysBetween(a: Date, b: Date): number {
	return Math.round(
		(startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000,
	)
}

// ── Core functions ──────────────────────────────────────────────────

/** First Monday of a given month (0-indexed month). */
export function getFirstMonday(year: number, month: number): Date {
	const d = new Date(year, month, 1)
	const day = d.getDay() // 0=Sun … 6=Sat
	const offset = day === 0 ? 1 : day === 1 ? 0 : 8 - day
	return new Date(year, month, 1 + offset)
}

/** Quarterly months are Jan (0), Apr (3), Jul (6), Oct (9). */
export function isQuarterlyMonth(month: number): boolean {
	return month % 3 === 0
}

/**
 * Build the full cycle for a given month.
 *
 * Layout:
 *   Phase 1: 1 week (2 weeks if quarterly)
 *   Phase 2: 1 week
 *   Phase 3: 1 week
 *   Phase 4: 1 week (extends through to next cycle start)
 */
export function getCycleForMonth(year: number, month: number): Cycle {
	const quarterly = isQuarterlyMonth(month)
	const p1Start = getFirstMonday(year, month)
	const p1Weeks = quarterly ? 2 : 1

	const p1End = addDays(p1Start, p1Weeks * 7 - 1) // Sun
	const p2Start = addDays(p1End, 1)
	const p2End = addDays(p2Start, 6) // Sun
	const p3Start = addDays(p2End, 1)
	const p3End = addDays(p3Start, 6) // Sun
	const p4Start = addDays(p3End, 1)

	// Phase 4 extends through to the day before the next cycle
	const nextMonth = month === 11 ? 0 : month + 1
	const nextYear = month === 11 ? year + 1 : year
	const nextCycleStart = getFirstMonday(nextYear, nextMonth)
	const p4End = addDays(nextCycleStart, -1)

	const phases: PhaseRange[] = [
		{ phase: 1, start: p1Start, end: p1End, days: p1Weeks * 7 },
		{ phase: 2, start: p2Start, end: p2End, days: 7 },
		{ phase: 3, start: p3Start, end: p3End, days: 7 },
		{
			phase: 4,
			start: p4Start,
			end: p4End,
			days: daysBetween(p4Start, p4End) + 1,
		},
	]

	return {
		year,
		month,
		isQuarterly: quarterly,
		phases,
		cycleStart: p1Start,
		cycleEnd: p4End,
	}
}

/**
 * Find the cycle that contains a given date.
 *
 * A date might fall before the current month's cycle start (in the gap
 * between the 1st and the first Monday), in which case it belongs to
 * the previous month's cycle (Phase 4 extends to cover it).
 */
export function getCycleForDate(date: Date = new Date()): Cycle {
	const d = startOfDay(date)
	const year = d.getFullYear()
	const month = d.getMonth()

	// Try current month's cycle first
	const current = getCycleForMonth(year, month)
	if (d >= startOfDay(current.cycleStart)) {
		return current
	}

	// Date falls before this month's cycle — it's in last month's rest period
	const prevMonth = month === 0 ? 11 : month - 1
	const prevYear = month === 0 ? year - 1 : year
	return getCycleForMonth(prevYear, prevMonth)
}

/**
 * Get detailed progress information for a given date.
 */
export function getPhaseProgress(date: Date = new Date()): PhaseProgress {
	const d = startOfDay(date)
	const cycle = getCycleForDate(d)

	// Check each phase
	for (const pr of cycle.phases) {
		const phaseStart = startOfDay(pr.start)
		const phaseEnd = startOfDay(pr.end)

		if (d >= phaseStart && d <= phaseEnd) {
			const dayInPhase = daysBetween(phaseStart, d) + 1
			const daysRemaining = daysBetween(d, phaseEnd)
			const phaseFraction = (dayInPhase - 1) / (pr.days - 1 || 1)

			// Transition window: last 2 days of the phase
			const isTransitioning = daysRemaining <= 1 && pr.phase < 4
			const transitionProgress = isTransitioning ? (2 - daysRemaining) / 2 : 0

			return {
				cycle,
				phase: pr.phase,
				status: pr.phase,
				dayInPhase,
				totalDaysInPhase: pr.days,
				daysRemaining,
				isTransitioning,
				transitionProgress,
				phaseFraction,
			}
		}
	}

	// Fallback — should not happen, but treat as last day of Phase 4
	const p4 = cycle.phases[3]
	return {
		cycle,
		phase: 4 as PhaseNumber,
		status: 4 as PhaseNumber,
		dayInPhase: p4.days,
		totalDaysInPhase: p4.days,
		daysRemaining: 0,
		isTransitioning: false,
		transitionProgress: 0,
		phaseFraction: 1,
	}
}

/**
 * Format a phase start date, e.g. "Feb 2".
 */
export function formatWeekStart(start: Date): string {
	return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Get the month label for a cycle.
 */
export function getCycleLabel(cycle: Cycle): string {
	const d = new Date(cycle.year, cycle.month)
	return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
