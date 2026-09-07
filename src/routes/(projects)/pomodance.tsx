import { memo, useEffect, useReducer, useRef, useState, type ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Button from '@/components/ui/button'
import PrintMarkdown from '@/components/ui/print-markdown'
import { cn } from '@/lib/utils'
import pomodanceCss from '@/styles/pomodance.css?url'
import {
	DEFAULT_SETTINGS,
	MIN_POMO_MS,
	dayLabel,
	formatClock,
	loadDay,
	loadIntention,
	loadLedgerHidden,
	loadPomos,
	loadSettings,
	loadYouTubeApi,
	msFor,
	parseVideoId,
	saveDay,
	saveIntention,
	saveLedgerHidden,
	savePomos,
	saveSettings,
	sounds,
	straddlesRollover,
	workDayOf,
	type Phase,
	type Pomo,
	type Settings,
	type YTPlayer,
} from '@/lib/pomodance'

const TITLE = 'Pomodance'
const DESCRIPTION =
	'A pomodoro timer where the soundtrack changes when you go on break. Work and chill, then get up and dance.'

export const Route = createFileRoute('/(projects)/pomodance')({
	ssr: false,
	head: () => ({
		meta: [{ title: TITLE }, { name: 'description', content: DESCRIPTION }],
		links: [{ rel: 'stylesheet', href: pomodanceCss }],
	}),
	component: PomodancePage,
})

const PHASES: Phase[] = ['work', 'break']

const INPUT_CLASS =
	'rounded-md px-3 py-2 bg-white/10 border border-white/20 text-inherit placeholder:opacity-50 focus:outline-hidden focus:border-[var(--pomo-accent)]'
const PILL_CLASS = 'rounded-full px-5 py-3 border border-current/40 hover:border-current cursor-pointer'

// endsAt set means running; remainingMs is only meaningful while endsAt is null.
type Timer = { phase: Phase; endsAt: number | null; remainingMs: number }
type TimerAction =
	| { type: 'start'; now: number }
	| { type: 'pause'; now: number }
	| { type: 'switch'; phase: Phase; durationMs: number; running: boolean; now: number }

function timerReducer(t: Timer, a: TimerAction): Timer {
	switch (a.type) {
		case 'start':
			return t.endsAt ? t : { ...t, endsAt: a.now + t.remainingMs }
		case 'pause':
			return t.endsAt ? { ...t, endsAt: null, remainingMs: Math.max(0, t.endsAt - a.now) } : t
		case 'switch':
			return {
				phase: a.phase,
				remainingMs: a.durationMs,
				endsAt: a.running ? a.now + a.durationMs : null,
			}
	}
}

const timeFormat = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' })
const fmtTime = (iso: string) => timeFormat.format(new Date(iso))
const minutesBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 60_000)

function PomodancePage() {
	const [settings, setSettings] = useState<Settings>(loadSettings)
	const [timer, dispatch] = useReducer(timerReducer, {
		phase: 'work',
		endsAt: null,
		remainingMs: msFor(settings, 'work'),
	} satisfies Timer)
	const [secondsLeft, setSecondsLeft] = useState(0)
	const [intention, setIntention] = useState(loadIntention)
	const [pomos, setPomos] = useState(() => loadPomos(settings.workMinutes))
	const [day, setDay] = useState(() => loadDay() ?? workDayOf(new Date()))
	const [ledgerHidden, setLedgerHidden] = useState(loadLedgerHidden)

	const [review, setReview] = useState<Pomo | null>(null)
	const [confirmSwitch, setConfirmSwitch] = useState<Phase | null>(null)
	const [askRollover, setAskRollover] = useState(false)

	const players = useRef<Record<Phase, YTPlayer | null>>({ work: null, break: null })
	const [playersReady, setPlayersReady] = useState(0)

	const { phase } = timer
	const running = timer.endsAt !== null
	const isBreak = phase === 'break'
	const idle = !running && timer.remainingMs === msFor(settings, phase)
	const current = pomos.find((p) => p.end === null) ?? null

	useEffect(() => savePomos(pomos), [pomos])
	useEffect(() => saveDay(day), [day])

	const patchPomo = (id: string, patch: Partial<Pomo>) =>
		setPomos((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)))

	const openPomo = (now: number) => {
		if (current) return
		if (straddlesRollover(day, pomos, now)) setAskRollover(true)
		setPomos((ps) => [
			...ps,
			{
				id: crypto.randomUUID(),
				day,
				start: new Date(now).toISOString(),
				end: null,
				intention,
				note: '',
				confirmed: false,
			},
		])
	}

	const closePomo = (now: number) => {
		if (!current) return
		if (now - Date.parse(current.start) < MIN_POMO_MS) {
			setPomos((ps) => ps.filter((p) => p.id !== current.id))
			return
		}
		const closed = { ...current, end: new Date(now).toISOString() }
		patchPomo(current.id, closed)
		setReview(closed)
	}

	const start = () => {
		if (running) return
		const now = Date.now()
		sounds.beep()
		dispatch({ type: 'start', now })
		if (phase === 'work') openPomo(now)
	}
	const pause = () => {
		if (!running) return
		sounds.click()
		dispatch({ type: 'pause', now: Date.now() })
	}
	const switchTo = (next: Phase, autostart: boolean, s = settings) => {
		const now = Date.now()
		dispatch({ type: 'switch', phase: next, durationMs: msFor(s, next), running: autostart, now })
		if (phase === 'work') closePomo(now)
		if (next === 'work' && autostart) openPomo(now)
	}

	const complete = () => {
		sounds.ring()
		switchTo(phase === 'work' ? 'break' : 'work', true)
	}
	const completeRef = useRef(complete)
	completeRef.current = complete

	// tick from the wall clock so a backgrounded tab still finishes on time
	useEffect(() => {
		const endsAt = timer.endsAt
		if (endsAt === null) return
		const tick = () => {
			const left = endsAt - Date.now()
			if (left > 0) setSecondsLeft(Math.ceil(left / 1000))
			else completeRef.current()
		}
		tick()
		const id = setInterval(tick, 250)
		return () => clearInterval(id)
	}, [timer.endsAt])

	// the players follow the timer; only the active phase's player may drive it back.
	// pressing play on the other one is a request to switch phases, so it gets
	// paused again and routed through the confirm dialog.
	useEffect(() => {
		for (const p of PHASES) {
			const player = players.current[p]
			if (!player) continue
			if (p === phase && running) player.playVideo()
			else player.pauseVideo()
		}
	}, [phase, running, playersReady])

	const onPlayerState = (p: Phase, state: number) => {
		const YT = window.YT!
		if (p !== phase) {
			if (state !== YT.PlayerState.PLAYING) return
			if (running) {
				players.current[p]?.pauseVideo()
				setConfirmSwitch(p)
			} else {
				switchTo(p, true)
			}
			return
		}
		if (state === YT.PlayerState.PLAYING) start()
		else if (state === YT.PlayerState.PAUSED) pause()
	}
	const onPlayerStateRef = useRef(onPlayerState)
	onPlayerStateRef.current = onPlayerState

	const registerPlayer = (p: Phase, player: YTPlayer | null) => {
		players.current[p] = player
		setPlayersReady((n) => n + 1)
	}

	const updateSettings = (patch: Partial<Settings>) => {
		const next = { ...settings, ...patch }
		setSettings(next)
		saveSettings(next)
		if (idle) switchTo(phase, false, next)
	}

	const updateIntention = (value: string) => {
		setIntention(value)
		saveIntention(value)
		if (current) patchPomo(current.id, { intention: value })
	}

	const finishReview = (note: string, confirmed: boolean, clearIntention: boolean) => {
		if (review) patchPomo(review.id, { note, confirmed })
		if (clearIntention) updateIntention('')
		setReview(null)
	}

	const toggleLedger = () => {
		setLedgerHidden(!ledgerHidden)
		saveLedgerHidden(!ledgerHidden)
	}

	const clock = formatClock(running ? secondsLeft : Math.ceil(timer.remainingMs / 1000))

	useEffect(() => {
		document.title = `${clock} ${isBreak ? '💃' : '🍅'} ${TITLE}`
	}, [clock, isBreak])

	return (
		<div className={cn('pomo min-h-screen flex flex-col', isBreak && 'is-break')}>
			<div className={cn('flex-1 grid gap-6 p-6', !ledgerHidden && 'lg:grid-cols-[1fr_20rem]')}>
				<main className="max-w-4xl w-full mx-auto flex flex-col gap-6">
					<header className="flex items-baseline justify-between gap-4 flex-wrap">
						<h1 className="h2 my-0 font-display">
							{isBreak ? '💃 break time 🕺' : '🍅 pomodance'}
						</h1>
						<p className="opacity-70 text-sm">{DESCRIPTION}</p>
					</header>

					{isBreak && (
						<div className="pomo-dancers" aria-hidden>
							{['💃', '🪩', '🕺', '✨', '💃', '🪩', '🕺'].map((d, i) => (
								<span key={i}>{d}</span>
							))}
						</div>
					)}

					<section className="flex flex-col items-center gap-4">
						<div
							className="pomo-clock font-display font-bold tabular-nums leading-none text-[clamp(4rem,20vw,11rem)]"
							aria-live="polite"
						>
							{clock}
						</div>
						<div className="flex gap-3 flex-wrap justify-center">
							<button
								onClick={running ? pause : start}
								className="rounded-full px-8 py-3 text-lg font-bold bg-[var(--pomo-accent)] text-black hover:scale-105 transition-transform cursor-pointer"
							>
								{running ? 'Pause' : idle ? 'Start' : 'Resume'}
							</button>
							<button onClick={() => switchTo(phase, false)} className={PILL_CLASS}>
								Reset
							</button>
							<button
								onClick={() => switchTo(isBreak ? 'work' : 'break', true)}
								className={PILL_CLASS}
							>
								{isBreak ? 'Back to work' : 'Skip to break'}
							</button>
						</div>
						<SettingInput
							className="w-full max-w-xl"
							label="Intention for this pomo"
							value={intention}
							onChange={updateIntention}
							placeholder="what are you going to do?"
						/>
					</section>

					<section className="grid gap-4 md:grid-cols-3">
						<VideoSlot
							videoId={parseVideoId(settings.workVideo)}
							active={!isBreak}
							label="work & chill"
							onReady={(p) => registerPlayer('work', p)}
							onState={(s) => onPlayerStateRef.current('work', s)}
						/>
						<VideoSlot
							videoId={parseVideoId(settings.breakVideo)}
							active={isBreak}
							label="break time"
							onReady={(p) => registerPlayer('break', p)}
							onState={(s) => onPlayerStateRef.current('break', s)}
						/>
					</section>

					<div className="flex justify-between text-sm">
						<details className="opacity-80 open:opacity-100">
							<summary className="cursor-pointer">Settings</summary>
							<div className="grid gap-3 sm:grid-cols-2 mt-3">
								<SettingInput
									label="Work video (youtube url or id)"
									value={settings.workVideo}
									onChange={(v) => updateSettings({ workVideo: v })}
								/>
								<SettingInput
									label="Break video (youtube url or id)"
									value={settings.breakVideo}
									onChange={(v) => updateSettings({ breakVideo: v })}
								/>
								<SettingInput
									label="Work minutes"
									type="number"
									value={String(settings.workMinutes)}
									onChange={(v) =>
										updateSettings({ workMinutes: clampMinutes(v, DEFAULT_SETTINGS.workMinutes) })
									}
								/>
								<SettingInput
									label="Break minutes"
									type="number"
									value={String(settings.breakMinutes)}
									onChange={(v) =>
										updateSettings({ breakMinutes: clampMinutes(v, DEFAULT_SETTINGS.breakMinutes) })
									}
								/>
							</div>
						</details>
						<button onClick={toggleLedger} className="opacity-80 hover:opacity-100 cursor-pointer">
							{ledgerHidden ? 'Show ledger' : 'Hide ledger'}
						</button>
					</div>
				</main>

				{!ledgerHidden && <Ledger pomos={pomos} day={day} />}
			</div>

			{review && (
				<ReviewDialog
					pomo={review}
					onDismiss={() => finishReview(review.intention, false, false)}
					onSave={(note, clearIntention) => finishReview(note, true, clearIntention)}
				/>
			)}

			{confirmSwitch && (
				<Modal onDismiss={() => setConfirmSwitch(null)}>
					<h2 className="h3 my-0">
						{confirmSwitch === 'break' ? 'End the pomo and start the break?' : 'End the break and get back to work?'}
					</h2>
					<div className="flex gap-3 justify-end">
						<Button type="button" variant="outlines" size="small" onClick={() => setConfirmSwitch(null)}>
							No, stay
						</Button>
						<Button
							type="button"
							size="small"
							onClick={() => {
								switchTo(confirmSwitch, true)
								setConfirmSwitch(null)
							}}
						>
							Yes, switch
						</Button>
					</div>
				</Modal>
			)}

			{askRollover && (
				<Modal onDismiss={() => setAskRollover(false)}>
					<h2 className="h3 my-0">It's past 4am</h2>
					<p>
						Still working late on {dayLabel(day)}, or is this {dayLabel(workDayOf(new Date()))} now?
					</p>
					<div className="flex gap-3 justify-end flex-wrap">
						<Button type="button" variant="outlines" size="small" onClick={() => setAskRollover(false)}>
							Still {dayLabel(day).split(',')[0]}
						</Button>
						<Button
							type="button"
							size="small"
							onClick={() => {
								const today = workDayOf(new Date())
								setDay(today)
								if (current) patchPomo(current.id, { day: today })
								setAskRollover(false)
							}}
						>
							Switch to {dayLabel(workDayOf(new Date())).split(',')[0]}
						</Button>
					</div>
				</Modal>
			)}
		</div>
	)
}

function clampMinutes(v: string, fallback: number) {
	const n = Number.parseInt(v, 10)
	return Number.isFinite(n) && n > 0 ? Math.min(n, 180) : fallback
}

function SettingInput({
	label,
	value,
	onChange,
	type = 'text',
	placeholder,
	className,
}: {
	label: string
	value: string
	onChange: (v: string) => void
	type?: 'text' | 'number'
	placeholder?: string
	className?: string
}) {
	return (
		<label className={cn('flex flex-col gap-1 text-sm', className)}>
			<span className="opacity-70">{label}</span>
			<input
				type={type}
				min={type === 'number' ? 1 : undefined}
				value={value}
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
				className={INPUT_CLASS}
			/>
		</label>
	)
}

function VideoSlot({
	videoId,
	active,
	label,
	onReady,
	onState,
}: {
	videoId: string
	active: boolean
	label: string
	onReady: (p: YTPlayer | null) => void
	onState: (state: number) => void
}) {
	const mount = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!videoId || !mount.current) return
		let player: YTPlayer | null = null
		let cancelled = false
		const host = document.createElement('div')
		mount.current.replaceChildren(host)
		void loadYouTubeApi().then((YT) => {
			if (cancelled) return
			player = new YT.Player(host, {
				videoId,
				playerVars: { loop: 1, playlist: videoId, rel: 0, playsinline: 1 },
				events: {
					onReady: () => onReady(player),
					onStateChange: (e) => onState(e.data),
				},
			})
		})
		return () => {
			cancelled = true
			onReady(null)
			player?.destroy()
		}
	}, [videoId])

	return (
		<div
			className={cn(
				'flex flex-col gap-2 transition-all',
				active ? 'md:col-span-2 pomo-video-main' : 'md:col-span-1 opacity-60 hover:opacity-100',
			)}
		>
			<span className="text-xs uppercase tracking-wide opacity-70">
				{label} {active && '· now playing'}
			</span>
			<div className="aspect-video w-full rounded-lg overflow-hidden bg-black/40">
				{videoId ? (
					<div ref={mount} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
				) : (
					<p className="p-4 text-sm opacity-70">
						Paste a youtube link for the {label} video in settings.
					</p>
				)}
			</div>
		</div>
	)
}

function Modal({ onDismiss, children }: { onDismiss: () => void; children: ReactNode }) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onDismiss()
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [onDismiss])
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
			onClick={onDismiss}
		>
			<div
				role="dialog"
				onClick={(e) => e.stopPropagation()}
				className="relative bg-white text-gray-800 rounded-xl p-6 w-full max-w-lg flex flex-col gap-4 shadow-2xl"
			>
				<button
					type="button"
					onClick={onDismiss}
					aria-label="Dismiss"
					className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 cursor-pointer"
				>
					✕
				</button>
				{children}
			</div>
		</div>
	)
}

function ReviewDialog({
	pomo,
	onDismiss,
	onSave,
}: {
	pomo: Pomo
	onDismiss: () => void
	onSave: (note: string, clearIntention: boolean) => void
}) {
	const [text, setText] = useState(pomo.intention)
	return (
		<Modal onDismiss={onDismiss}>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					onSave(text, false)
				}}
				className="form flex flex-col gap-4"
			>
				<h2 className="h3 my-0">
					Pomo done: {minutesBetween(pomo.start, pomo.end!)}m, started {fmtTime(pomo.start)}
				</h2>
				<p className="text-sm text-gray-600">
					{pomo.intention ?
						'Here was your intention. Is that what you worked on, or do you want to put something else?'
					:	'No intention was set. What did you work on?'}
				</p>
				<textarea
					autoFocus
					value={text}
					onChange={(e) => setText(e.target.value)}
					rows={3}
					placeholder="- a bullet or two of markdown"
					className="font-mono text-sm"
				/>
				<div className="flex gap-3 justify-end flex-wrap">
					<Button type="button" variant="outlines" size="small" onClick={() => onSave(text, true)}>
						Yep, and I'm done with it
					</Button>
					<Button type="submit" size="small">
						Yep, keep it as my intention
					</Button>
				</div>
			</form>
		</Modal>
	)
}

const Ledger = memo(function Ledger({ pomos, day }: { pomos: Pomo[]; day: string }) {
	const today = pomos.filter((p) => p.day === day)
	const earlier = pomos.filter((p) => p.day !== day)
	const earlierDays = [...new Set(earlier.map((p) => p.day))].sort().reverse()
	return (
		<aside className="flex flex-col gap-3 text-sm lg:border-l lg:border-current/20 lg:pl-6">
			<h2 className="h4 my-0">{dayLabel(day)}</h2>
			{today.length === 0 && <p className="opacity-60">No pomos yet today.</p>}
			<PomoList pomos={today} />
			{earlierDays.length > 0 && (
				<details className="opacity-70 open:opacity-100">
					<summary className="cursor-pointer">Earlier days</summary>
					{earlierDays.map((d) => (
						<div key={d} className="mt-3">
							<h3 className="font-bold">{dayLabel(d)}</h3>
							<PomoList pomos={earlier.filter((p) => p.day === d)} />
						</div>
					))}
				</details>
			)}
		</aside>
	)
})

function PomoList({ pomos }: { pomos: Pomo[] }) {
	return (
		<ol className="flex flex-col gap-2">
			{pomos.map((p) => (
				<li
					key={p.id}
					className={cn('rounded-lg bg-white/10 px-3 py-2 flex flex-col gap-1', !p.end && 'ring-1 ring-[var(--pomo-accent)]')}
				>
					<div className="flex justify-between gap-2 tabular-nums opacity-70 text-xs">
						<span>
							{fmtTime(p.start)} – {p.end ? fmtTime(p.end) : 'now'}
							{p.end && ` · ${minutesBetween(p.start, p.end)}m`}
						</span>
						<span title={p.confirmed ? 'confirmed' : p.end ? 'unconfirmed' : 'in progress'}>
							{p.confirmed ? '✅' : p.end ? '◌' : '⏳'}
						</span>
					</div>
					<div className={cn('prose prose-sm prose-invert max-w-none', !p.confirmed && 'italic')}>
						<PrintMarkdown markdown={(p.end ? p.note || p.intention : p.intention) || '_(no intention)_'} />
					</div>
				</li>
			))}
		</ol>
	)
}
