import { memo, useEffect, useReducer, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Button from '@/components/ui/button'
import PrintMarkdown from '@/components/ui/print-markdown'
import { cn } from '@/lib/utils'
import pomodanceCss from '@/styles/pomodance.css?url'
import {
	DEFAULT_SETTINGS,
	appendLog,
	formatClock,
	loadIntention,
	loadLog,
	loadSettings,
	loadYouTubeApi,
	msFor,
	parseVideoId,
	saveIntention,
	saveSettings,
	sounds,
	type Disposition,
	type Log,
	type Phase,
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

function PomodancePage() {
	const [settings, setSettings] = useState<Settings>(loadSettings)
	const [timer, dispatch] = useReducer(timerReducer, {
		phase: 'work',
		endsAt: null,
		remainingMs: msFor(settings, 'work'),
	} satisfies Timer)
	const [secondsLeft, setSecondsLeft] = useState(0)
	const [intention, setIntention] = useState(loadIntention)
	const [log, setLog] = useState<Log>(loadLog)
	const [askWhatHappened, setAskWhatHappened] = useState(false)

	const players = useRef<Record<Phase, YTPlayer | null>>({ work: null, break: null })
	const [playersReady, setPlayersReady] = useState(0)

	const { phase } = timer
	const running = timer.endsAt !== null
	const isBreak = phase === 'break'
	const idle = !running && timer.remainingMs === msFor(settings, phase)

	const start = () => {
		if (running) return
		sounds.beep()
		dispatch({ type: 'start', now: Date.now() })
	}
	const pause = () => {
		if (!running) return
		sounds.click()
		dispatch({ type: 'pause', now: Date.now() })
	}
	const switchTo = (next: Phase, autostart: boolean, s = settings) =>
		dispatch({
			type: 'switch',
			phase: next,
			durationMs: msFor(s, next),
			running: autostart,
			now: Date.now(),
		})

	// tick from the wall clock so a backgrounded tab still finishes on time
	useEffect(() => {
		const endsAt = timer.endsAt
		if (endsAt === null) return
		const tick = () => {
			const left = endsAt - Date.now()
			if (left > 0) {
				setSecondsLeft(Math.ceil(left / 1000))
				return
			}
			sounds.ring()
			if (phase === 'work') {
				setAskWhatHappened(true)
				switchTo('break', true)
			} else {
				switchTo('work', false)
			}
		}
		tick()
		const id = setInterval(tick, 250)
		return () => clearInterval(id)
	}, [timer.endsAt, phase, settings])

	// the players follow the timer; only the active phase's player may drive it back
	useEffect(() => {
		for (const p of PHASES) {
			const player = players.current[p]
			if (!player) continue
			if (p === phase && running) player.playVideo()
			else player.pauseVideo()
		}
	}, [phase, running, playersReady])

	const onPlayerState = (p: Phase, state: number) => {
		if (p !== phase) return
		const YT = window.YT!
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
	}

	const recordPomo = (text: string, disposition: Disposition) => {
		setLog(appendLog(log, { at: new Date().toISOString(), intention, text, disposition }))
		updateIntention(disposition === 'continue' ? intention : '')
		setAskWhatHappened(false)
	}

	const clock = formatClock(running ? secondsLeft : Math.ceil(timer.remainingMs / 1000))

	useEffect(() => {
		document.title = `${clock} ${isBreak ? '💃' : '🍅'} ${TITLE}`
	}, [clock, isBreak])

	return (
		<div className={cn('pomo min-h-screen flex flex-col', isBreak && 'is-break')}>
			<main className="container max-w-5xl py-6 flex flex-col gap-6 flex-1">
				<header className="flex items-baseline justify-between gap-4 flex-wrap">
					<h1 className="h2 my-0 font-display">{isBreak ? '💃 break time 🕺' : '🍅 pomodance'}</h1>
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
						<button onClick={() => switchTo(isBreak ? 'work' : 'break', false)} className={PILL_CLASS}>
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

				<details className="text-sm opacity-80 open:opacity-100">
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

				<WorkLog log={log} />
			</main>

			{askWhatHappened && <WhatHappenedDialog intention={intention} onSubmit={recordPomo} />}
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

function WhatHappenedDialog({
	intention,
	onSubmit,
}: {
	intention: string
	onSubmit: (text: string, disposition: Disposition) => void
}) {
	const [text, setText] = useState(intention ? `- ${intention}` : '')
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
			<form
				onSubmit={(e) => {
					e.preventDefault()
					onSubmit(text, 'finished')
				}}
				className="form bg-white text-gray-800 rounded-xl p-6 w-full max-w-lg flex flex-col gap-4 shadow-2xl"
			>
				<h2 className="h3 my-0">Pomo done. What did you work on?</h2>
				<textarea
					autoFocus
					value={text}
					onChange={(e) => setText(e.target.value)}
					rows={4}
					placeholder="- a bullet or two of markdown"
					className="font-mono text-sm"
				/>
				<div className="flex gap-3 justify-end flex-wrap">
					{intention && (
						<Button
							type="button"
							variant="outlines"
							size="small"
							onClick={() => onSubmit(text, 'continue')}
						>
							Keep working on it next
						</Button>
					)}
					<Button type="submit" size="small">
						{intention ? 'Yeah, finished it' : 'Save'}
					</Button>
				</div>
			</form>
		</div>
	)
}

const timeFormat = new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' })

const WorkLog = memo(function WorkLog({ log }: { log: Log }) {
	const days = Object.keys(log).sort().reverse()
	if (days.length === 0) return null
	const today = new Date().toISOString().slice(0, 10)
	return (
		<section className="flex flex-col gap-3 text-sm">
			<h2 className="h4 my-0">Work log</h2>
			{days.map((day) => (
				<details key={day} open={day === today} className="rounded-lg bg-white/10 px-4 py-2">
					<summary className="cursor-pointer font-bold">
						{day} · {log[day].length} pomo{log[day].length === 1 ? '' : 's'}
					</summary>
					<ol className="mt-2 flex flex-col gap-2">
						{log[day].map((entry) => (
							<li key={entry.at} className="flex gap-3">
								<span className="tabular-nums opacity-60 shrink-0">
									{timeFormat.format(new Date(entry.at))}
								</span>
								<div className="prose prose-sm prose-invert max-w-none">
									<PrintMarkdown markdown={entry.text || entry.intention || '_(nothing noted)_'} />
								</div>
								<span className="shrink-0">{entry.disposition === 'finished' ? '✅' : '↪️'}</span>
							</li>
						))}
					</ol>
				</details>
			))}
		</section>
	)
})
