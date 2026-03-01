import type { PhaseNumber } from './cycle'

export interface PhaseTheme {
	phase: PhaseNumber
	season: string
	moonPhase: string
	label: string // practical name for "This Cycle" cards
	mantra: { quote: string; author: string }
	description: string
	colors: {
		bg: string // deep background
		bgSoft: string // softer background for cards
		fg: string // primary text
		fgMuted: string // secondary text
		accent: string // interactive / highlight
		border: string // subtle borders
		band: string // vivid aurora band color
	}
	gradient: string // full-viewport CSS gradient
}

const themes: Record<PhaseNumber, PhaseTheme> = {
	1: {
		phase: 1,
		season: 'Winter',
		moonPhase: 'New Moon',
		label: 'Planning week',
		mantra: {
			quote: 'In seed time learn, in harvest teach, in winter enjoy.',
			author: 'William Blake',
		},
		description:
			'Stillness, scrying, gathering warmth around the fire. The seeds are beneath the snow. Tend to them with questions, not answers.',
		colors: {
			bg: 'oklch(0.22 0.08 270)',
			bgSoft: 'oklch(0.28 0.07 265)',
			fg: 'oklch(0.90 0.01 250)',
			fgMuted: 'oklch(0.65 0.02 260)',
			accent: 'oklch(0.72 0.10 70)', // warm amber
			border: 'oklch(0.32 0.05 265)',
			band: 'oklch(0.45 0.18 270)', // vivid indigo
		},
		gradient:
			'linear-gradient(170deg, oklch(0.18 0.08 275) 0%, oklch(0.24 0.07 260) 40%, oklch(0.20 0.06 250) 100%)',
	},
	2: {
		phase: 2,
		season: 'Spring',
		moonPhase: 'Waxing Moon',
		label: 'Week 1: opening up, experimenting',
		mantra: {
			quote: 'The earth laughs in flowers.',
			author: 'Ralph Waldo Emerson',
		},
		description:
			'Emergence. The sap rises. Dig your hands into the work and let the tangents take you where they want to go.',
		colors: {
			bg: 'oklch(0.28 0.10 350)',
			bgSoft: 'oklch(0.33 0.09 345)',
			fg: 'oklch(0.92 0.02 340)',
			fgMuted: 'oklch(0.70 0.04 345)',
			accent: 'oklch(0.75 0.14 350)', // cherry blossom
			border: 'oklch(0.38 0.06 345)',
			band: 'oklch(0.55 0.20 350)', // vivid pink
		},
		gradient:
			'linear-gradient(170deg, oklch(0.24 0.10 355) 0%, oklch(0.30 0.10 345) 40%, oklch(0.26 0.08 340) 100%)',
	},
	3: {
		phase: 3,
		season: 'Summer',
		moonPhase: 'Full Moon',
		label: 'Week 2: full speed ahead',
		mantra: {
			quote:
				'Summer afternoon\u2014summer afternoon; to me those have always been the two most beautiful words in the English language.',
			author: 'Henry James',
		},
		description:
			'Peak intensity. Full power. Everything that isn\u2019t shipping gets pruned. You are the wolf tonight.',
		colors: {
			bg: 'oklch(0.26 0.08 145)',
			bgSoft: 'oklch(0.32 0.07 140)',
			fg: 'oklch(0.92 0.02 130)',
			fgMuted: 'oklch(0.68 0.03 140)',
			accent: 'oklch(0.72 0.14 145)', // bright green
			border: 'oklch(0.36 0.05 140)',
			band: 'oklch(0.50 0.18 145)', // vivid green
		},
		gradient:
			'linear-gradient(170deg, oklch(0.22 0.08 150) 0%, oklch(0.28 0.08 140) 40%, oklch(0.25 0.07 135) 100%)',
	},
	4: {
		phase: 4,
		season: 'Autumn',
		moonPhase: 'Waning Moon',
		label: 'Week 3: harvest and ship',
		mantra: {
			quote:
				'Season of mists and mellow fruitfulness, close bosom-friend of the maturing sun.',
			author: 'John Keats',
		},
		description:
			'Gratitude, closeout, letting go. Not everything ripens in every cycle. That\u2019s not failure \u2014 that\u2019s seasons.',
		colors: {
			bg: 'oklch(0.28 0.08 50)',
			bgSoft: 'oklch(0.33 0.07 45)',
			fg: 'oklch(0.92 0.02 70)',
			fgMuted: 'oklch(0.68 0.03 55)',
			accent: 'oklch(0.75 0.14 55)', // burnt orange
			border: 'oklch(0.38 0.05 50)',
			band: 'oklch(0.55 0.18 50)', // vivid orange
		},
		gradient:
			'linear-gradient(170deg, oklch(0.25 0.08 55) 0%, oklch(0.30 0.08 45) 40%, oklch(0.27 0.07 35) 100%)',
	},
}

export function getPhaseTheme(phase: PhaseNumber): PhaseTheme {
	return themes[phase]
}

/**
 * Interpolate between two OKLCH color strings.
 * Input format: "oklch(L C H)" — returns same format.
 */
function lerpOklch(a: string, b: string, t: number): string {
	const parse = (s: string) => {
		const m = s.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/)
		if (!m) return [0.5, 0.02, 0]
		return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])]
	}
	const [lA, cA, hA] = parse(a)
	const [lB, cB, hB] = parse(b)
	const lerp = (x: number, y: number) => x + (y - x) * t
	return `oklch(${lerp(lA, lB).toFixed(3)} ${lerp(cA, cB).toFixed(3)} ${lerp(hA, hB).toFixed(1)})`
}

/**
 * Blend two themes together during a phase transition.
 * `progress` goes from 0 (fully `from`) to 1 (fully `to`).
 */
export function getTransitionTheme(
	from: PhaseNumber,
	to: PhaseNumber,
	progress: number,
): PhaseTheme {
	const a = getPhaseTheme(from)
	const b = getPhaseTheme(to)
	const t = Math.max(0, Math.min(1, progress))

	return {
		...b,
		colors: {
			bg: lerpOklch(a.colors.bg, b.colors.bg, t),
			bgSoft: lerpOklch(a.colors.bgSoft, b.colors.bgSoft, t),
			fg: lerpOklch(a.colors.fg, b.colors.fg, t),
			fgMuted: lerpOklch(a.colors.fgMuted, b.colors.fgMuted, t),
			accent: lerpOklch(a.colors.accent, b.colors.accent, t),
			border: lerpOklch(a.colors.border, b.colors.border, t),
			band: lerpOklch(a.colors.band, b.colors.band, t),
		},
		// Keep the destination gradient — gradients don't lerp well
		gradient: t > 0.5 ? b.gradient : a.gradient,
	}
}

/** Moon phase SVG path data for each phase. */
export const moonIcons: Record<PhaseNumber, string> = {
	1: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', // new moon (filled circle)
	2: 'M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20z M12 2a5 10 0 0 0 0 20', // waxing (half)
	3: 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z', // full moon (circle outline)
	4: 'M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20z M12 2a5 10 0 0 1 0 20', // waning (half)
}

/** Daily titles — 7 per phase, indexed by (dayInPhase - 1). */
export const dailyTitles: Record<PhaseNumber, string[]> = {
	1: [
		'First Monday of planning! What are you itching at? Think big.',
		'What are your plans and KPIs? How much space do you really have?',
		'Refine your priorities. What\u2019s the one thing that matters most?',
		'Map it out. Break the big ideas into real, concrete tasks.',
		'Review dependencies. Who do you need? What\u2019s blocking the path?',
		'Planning wind-down. Are your intentions sharp enough to start Monday?',
		'Let the plan settle. Your subconscious is working on it.',
	],
	2: [
		'Sprint begins! Pick the hardest thing and start there.',
		'Dig into the work. Follow the thread wherever it leads.',
		'Mid-week pulse: are you building what you planned, or something better?',
		'Keep the momentum. Small wins compound into big ones.',
		'Exploration day. Try the weird idea you\u2019ve been sitting on.',
		'Wrap loose threads. What surprised you this week?',
		'Breathe. Let the week\u2019s work settle before you push again.',
	],
	3: [
		'Full power. What\u2019s actually going to ship this cycle?',
		'Focus and prune. If it\u2019s not on track, defer it gracefully.',
		'Deep work day. Protect your hours fiercely.',
		'Polish and review. The details matter now.',
		'Ship what\u2019s ready. Done is better than perfect.',
		'Final push before harvest. Tie up what you can.',
		'Pause. You\u2019re almost there. Recharge for the home stretch.',
	],
	4: [
		'Harvest week. What ripened? Bring it in.',
		'Ship everything that\u2019s ready. No more polishing.',
		'Retrospective. What worked? What didn\u2019t? Be honest.',
		'Defer what\u2019s left. \u201CNot this cycle\u201D is a complete sentence.',
		'Close out. Update your boards, your notes, your docs.',
		'Amend your rituals if needed. Small tweaks, not overhauls.',
		'Rest, and start again tomorrow.',
	],
}

/**
 * Get the daily title for a given phase and day-in-phase.
 * Wraps around if the phase is longer than the titles array.
 */
export function getDailyTitle(phase: PhaseNumber, dayInPhase: number): string {
	const titles = dailyTitles[phase]
	return titles[(dayInPhase - 1) % titles.length]
}

/** Ritual checklists per phase. */
export const phaseRituals: Record<PhaseNumber, string[]> = {
	1: [
		'Kickoff gate: Are all loose ends from last cycle tied up?',
		'Review primary GitHub project board',
		'Review quarterly plan document',
		'Team sync / planning meeting',
		'Curate monthly link board',
		'Set monthly repo/project intentions',
		'Generate planning report by end of phase',
	],
	2: [
		'Deep work: primary initiative underway',
		'Tuesday showcase: present one thing',
		'Exploration and tangents welcome',
		'Activity aligns with stated monthly intentions',
	],
	3: [
		'Tuesday showcase',
		'Identify what is shipping this month',
		'Defer or cancel items not on track',
		'Code review and QA',
		'Testing and polish',
	],
	4: [
		'Final Tuesday showcase',
		'Thursday closeout: wrap everything',
		'Retrospective: what worked, what didn\u2019t',
		'Defer remaining items explicitly',
		'Amend rituals if needed (takes effect next month)',
		'After Thursday: rest',
	],
}
