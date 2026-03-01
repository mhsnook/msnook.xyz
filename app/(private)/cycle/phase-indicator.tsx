'use client'

import type { PhaseProgress } from './lib/cycle'
import type { PhaseTheme } from './lib/cycle-theme'

interface Props {
	progress: PhaseProgress
	theme: PhaseTheme
}

/**
 * Draw a moon at a given illumination using the terminator technique.
 * All coordinates are in the parent SVG's coordinate system.
 */
function Moon({
	cx,
	cy,
	r,
	illumination,
	waxing,
	litColor,
	darkColor,
}: {
	cx: number
	cy: number
	r: number
	illumination: number
	waxing: boolean
	litColor: string
	darkColor: string
}) {
	const f = Math.max(0, Math.min(1, illumination))

	// Fully dark
	if (f < 0.01) {
		return (
			<g>
				<circle cx={cx} cy={cy} r={r} fill={darkColor} />
				<circle
					cx={cx}
					cy={cy}
					r={r}
					fill="none"
					stroke={litColor}
					strokeWidth={0.5}
					opacity={0.25}
				/>
			</g>
		)
	}

	// Fully lit
	if (f > 0.99) {
		return <circle cx={cx} cy={cy} r={r} fill={litColor} />
	}

	const top = cy - r
	const bot = cy + r
	const rx = r * Math.abs(1 - 2 * f)

	let shadowPath: string
	if (waxing) {
		const leftArc = `A ${r} ${r} 0 0 0 ${cx} ${bot}`
		const termSweep = f < 0.5 ? 0 : 1
		const terminator = `A ${rx} ${r} 0 0 ${termSweep} ${cx} ${top}`
		shadowPath = `M ${cx} ${top} ${leftArc} ${terminator} Z`
	} else {
		const rightArc = `A ${r} ${r} 0 0 1 ${cx} ${bot}`
		const termSweep = f < 0.5 ? 1 : 0
		const terminator = `A ${rx} ${r} 0 0 ${termSweep} ${cx} ${top}`
		shadowPath = `M ${cx} ${top} ${rightArc} ${terminator} Z`
	}

	return (
		<g>
			<circle cx={cx} cy={cy} r={r} fill={litColor} />
			<path d={shadowPath} fill={darkColor} />
			<circle
				cx={cx}
				cy={cy}
				r={r}
				fill="none"
				stroke={litColor}
				strokeWidth={0.5}
				opacity={0.25}
			/>
		</g>
	)
}

/**
 * A dramatic arc of 7 moons sweeping across the sky,
 * with today's moon rendered large and glowing, overlaid.
 */
export default function MoonArc({ progress, theme }: Props) {
	const { cycle, status } = progress

	// Total active days across all phases
	const totalActiveDays = cycle.phases.reduce((sum, p) => sum + p.days, 0)

	// Today's position as fraction through cycle (0–1)
	let todayIndex = 0
	let offset = 0
	for (const p of cycle.phases) {
		if (p.phase === status) {
			todayIndex = offset + progress.dayInPhase - 1
			break
		}
		offset += p.days
	}
	const todayT = totalActiveDays > 1 ? todayIndex / (totalActiveDays - 1) : 0.5

	// Today's illumination
	const todayIllumination = Math.sin(Math.PI * todayT)
	const todayWaxing = todayT <= 0.5

	// 7 reference moons: sliver → crescent → quarter → full → quarter → crescent → sliver
	const refMoons = [
		{ t: 0, illumination: 0.08, waxing: true },
		{ t: 1 / 6, illumination: Math.sin(Math.PI / 6), waxing: true },
		{
			t: 2 / 6,
			illumination: Math.sin((2 * Math.PI) / 6),
			waxing: true,
		},
		{ t: 0.5, illumination: 1, waxing: true },
		{
			t: 4 / 6,
			illumination: Math.sin((2 * Math.PI) / 6),
			waxing: false,
		},
		{ t: 5 / 6, illumination: Math.sin(Math.PI / 6), waxing: false },
		{ t: 1, illumination: 0.08, waxing: false },
	]

	// ── Layout ──────────────────────────────────────────────────────
	const W = 640
	const H = 380

	// Arc: 7 small moons on an upward-bowing arc
	const arcCenterY = H + 160
	const arcRadius = 340
	const arcStartAngle = -55
	const arcEndAngle = 55

	function arcPosition(t: number) {
		const angleDeg = arcStartAngle + t * (arcEndAngle - arcStartAngle)
		const angleRad = ((angleDeg - 90) * Math.PI) / 180
		return {
			x: W / 2 + arcRadius * Math.cos(angleRad),
			y: arcCenterY + arcRadius * Math.sin(angleRad),
		}
	}

	const smallR = 18
	const bigR = 64

	// Today's big moon floats above its arc position
	const todayPos = arcPosition(todayT)
	const bigMoonX = todayPos.x
	const bigMoonY = Math.min(todayPos.y - bigR - 20, H * 0.32)

	const litColor = theme.colors.fg
	const darkColor = theme.colors.bgSoft
	const glowColor = theme.colors.accent

	return (
		<div className="w-full h-full flex items-center justify-center">
			<svg
				viewBox={`0 0 ${W} ${H}`}
				className="w-full h-full"
				preserveAspectRatio="xMidYMid meet"
			>
				<defs>
					<radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor={glowColor} stopOpacity="0.3" />
						<stop offset="40%" stopColor={glowColor} stopOpacity="0.12" />
						<stop offset="70%" stopColor={glowColor} stopOpacity="0.04" />
						<stop offset="100%" stopColor={glowColor} stopOpacity="0" />
					</radialGradient>
					<radialGradient id="moon-atmo" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor={litColor} stopOpacity="0.06" />
						<stop offset="100%" stopColor={litColor} stopOpacity="0" />
					</radialGradient>
				</defs>

				{/* Atmospheric glow */}
				<circle
					cx={bigMoonX}
					cy={bigMoonY}
					r={bigR * 3.5}
					fill="url(#moon-atmo)"
				/>

				{/* Inner glow */}
				<circle
					cx={bigMoonX}
					cy={bigMoonY}
					r={bigR * 2}
					fill="url(#moon-glow)"
				/>

				{/* 7 reference moons along the arc */}
				{refMoons.map((m, i) => {
					const pos = arcPosition(m.t)
					return (
						<g key={i} opacity={0.4}>
							<Moon
								cx={pos.x}
								cy={pos.y}
								r={smallR}
								illumination={m.illumination}
								waxing={m.waxing}
								litColor={litColor}
								darkColor={darkColor}
							/>
						</g>
					)
				})}

				{/* Dashed line from big moon to arc position */}
				<line
					x1={bigMoonX}
					y1={bigMoonY + bigR + 4}
					x2={todayPos.x}
					y2={todayPos.y - smallR - 4}
					stroke={glowColor}
					strokeWidth={1}
					strokeDasharray="2 4"
					opacity={0.25}
				/>

				{/* Today's position on the arc — full opacity */}
				<Moon
					cx={todayPos.x}
					cy={todayPos.y}
					r={smallR}
					illumination={todayIllumination}
					waxing={todayWaxing}
					litColor={litColor}
					darkColor={darkColor}
				/>

				{/* Today's big moon */}
				<Moon
					cx={bigMoonX}
					cy={bigMoonY}
					r={bigR}
					illumination={todayIllumination}
					waxing={todayWaxing}
					litColor={litColor}
					darkColor={darkColor}
				/>

				{/* Thin ring */}
				<circle
					cx={bigMoonX}
					cy={bigMoonY}
					r={bigR + 2}
					fill="none"
					stroke={glowColor}
					strokeWidth={0.5}
					opacity={0.35}
				/>
			</svg>
		</div>
	)
}
