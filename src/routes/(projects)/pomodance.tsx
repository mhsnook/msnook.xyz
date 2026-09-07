import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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

type Status = 'idle' | 'running' | 'paused'

function PomodancePage() {
	const [settings, setSettings] = useState<Settings>(loadSettings)
	const [phase, setPhase] = useState<Phase>('work')
	const [status, setStatus] = useState<Status>('idle')
	const [remaining, setRemaining] = useState(settings.workMinutes * 60_000)
	const [intention, setIntention] = useState(loadIntention)
	const [log, setLog] = useState<Log>(loadLog)
	const [askWhatHappened, setAskWhatHappened] = useState(false)

	// endsAt is the wall-clock deadline while running; remaining is the paused snapshot.
	const endsAt = useRef<number | null>(null)
	const players = useRef<Record<Phase, YTPlayer | null>>({ work: null, break: null })
	const phaseRef = useRef(phase)
	phaseRef.current = phase
	const statusRef = useRef(status)
	statusRef.current = status

	const durationFor = useCallback(
		(p: Phase) => (p === 'work' ? settings.workMinutes : settings.breakMinutes) * 60_000,
		[settings.workMinutes, settings.breakMinutes],
	)

	const videoOf = (p: Phase) => players.current[p]

	const registerPlayer = (p: Phase, player: YTPlayer | null) => {
		players.current[p] = player
		if (player && phaseRef.current === p && statusRef.current === 'running') player.playVideo()
	}

	const start = useCallback(
		(withSound = true) => {
			if (statusRef.current === 'running') return
			endsAt.current = Date.now() + remaining
			setStatus('running')
			videoOf(phaseRef.current)?.playVideo()
			if (withSound) sounds.beep()
		},
		[remaining],
	)

	const pause = useCallback((withSound = true) => {
		if (statusRef.current !== 'running') return
		setRemaining(Math.max(0, (endsAt.current ?? Date.now()) - Date.now()))
		endsAt.current = null
		setStatus('paused')
		videoOf(phaseRef.current)?.pauseVideo()
		if (withSound) sounds.click()
	}, [])

	const switchTo = useCallback(
		(next: Phase, autostart: boolean) => {
			const prev = phaseRef.current
			videoOf(prev)?.pauseVideo()
			setPhase(next)
			phaseRef.current = next
			const ms = durationFor(next)
			setRemaining(ms)
			if (autostart) {
				endsAt.current = Date.now() + ms
				setStatus('running')
				statusRef.current = 'running'
				videoOf(next)?.playVideo()
			} else {
				endsAt.current = null
				setStatus('idle')
				statusRef.current = 'idle'
			}
		},
		[durationFor],
	)

	const complete = useCallback(() => {
		sounds.ring()
		if (phaseRef.current === 'work') {
			setAskWhatHappened(true)
			switchTo('break', true)
		} else {
			switchTo('work', false)
		}
	}, [switchTo])

	// tick from wall clock so a backgrounded tab still finishes on time
	useEffect(() => {
		if (status !== 'running') return
		const id = setInterval(() => {
			const left = (endsAt.current ?? Date.now()) - Date.now()
			if (left <= 0) {
				setRemaining(0)
				complete()
			} else {
				setRemaining(left)
			}
		}, 250)
		return () => clearInterval(id)
	}, [status, complete])

	// the video is the other half of the play/pause switch: clicking play or
	// pause inside the iframe of the current phase drives the timer too
	const onPlayerState = useCallback(
		(p: Phase, state: number) => {
			if (p !== phaseRef.current) return
			const YT = window.YT!
			if (state === YT.PlayerState.PLAYING) start()
			else if (state === YT.PlayerState.PAUSED) pause()
		},
		[start, pause],
	)
	const onPlayerStateRef = useRef(onPlayerState)
	onPlayerStateRef.current = onPlayerState

	const toggle = () => (status === 'running' ? pause() : start())

	const reset = () => {
		videoOf(phase)?.pauseVideo()
		endsAt.current = null
		setStatus('idle')
		setRemaining(durationFor(phase))
	}

	const skip = () => switchTo(phase === 'work' ? 'break' : 'work', false)

	const updateSettings = (patch: Partial<Settings>) => {
		const next = { ...settings, ...patch }
		setSettings(next)
		saveSettings(next)
		if (status === 'idle') {
			setRemaining((phase === 'work' ? next.workMinutes : next.breakMinutes) * 60_000)
		}
	}

	const updateIntention = (value: string) => {
		setIntention(value)
		saveIntention(value)
	}

	const recordPomo = (text: string, disposition: Disposition) => {
		setLog(appendLog({ at: new Date().toISOString(), intention, text, disposition }))
		updateIntention(disposition === 'continue' ? intention : '')
		setAskWhatHappened(false)
	}

	useEffect(() => {
		document.title = `${formatClock(remaining)} ${phase === 'work' ? '🍅' : '💃'} ${TITLE}`
	}, [remaining, phase])

	const isBreak = phase === 'break'

	return (
		<div className={cn('pomo min-h-screen flex flex-col', isBreak && 'is-break')}>
			<main className="container max-w-5xl py-6 flex flex-col gap-6 flex-1">
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
						{formatClock(remaining)}
					</div>
					<div className="flex gap-3 flex-wrap justify-center">
						<button
							onClick={toggle}
							className="rounded-full px-8 py-3 text-lg font-bold bg-[var(--pomo-accent)] text-black hover:scale-105 transition-transform cursor-pointer"
						>
							{status === 'running' ? 'Pause' : status === 'paused' ? 'Resume' : 'Start'}
						</button>
						<button onClick={reset} className="rounded-full px-5 py-3 border border-current/40 hover:border-current cursor-pointer">
							Reset
						</button>
						<button onClick={skip} className="rounded-full px-5 py-3 border border-current/40 hover:border-current cursor-pointer">
							{isBreak ? 'Back to work' : 'Skip to break'}
						</button>
					</div>
					<label className="w-full max-w-xl flex flex-col gap-1 text-sm">
						<span className="opacity-70">Intention for this pomo</span>
						<input
							value={intention}
							onChange={(e) => updateIntention(e.target.value)}
							placeholder="what are you going to do?"
							className="rounded-md px-3 py-2 bg-white/10 border border-white/20 text-inherit placeholder:opacity-50 focus:outline-hidden focus:border-[var(--pomo-accent)]"
						/>
					</label>
				</section>

				<section className="grid gap-4 md:grid-cols-3">
					<VideoSlot
						phase="work"
						videoId={parseVideoId(settings.workVideo)}
						active={!isBreak}
						label="work & chill"
						onReady={(p) => registerPlayer('work', p)}
						onState={(s) => onPlayerStateRef.current('work', s)}
					/>
					<VideoSlot
						phase="break"
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
							onChange={(v) => updateSettings({ workMinutes: clampMinutes(v, DEFAULT_SETTINGS.workMinutes) })}
						/>
						<SettingInput
							label="Break minutes"
							type="number"
							value={String(settings.breakMinutes)}
							onChange={(v) => updateSettings({ breakMinutes: clampMinutes(v, DEFAULT_SETTINGS.breakMinutes) })}
						/>
					</div>
				</details>

				<WorkLog log={log} />
			</main>

			{askWhatHappened && (
				<WhatHappenedDialog intention={intention} onSubmit={recordPomo} />
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
}: {
	label: string
	value: string
	onChange: (v: string) => void
	type?: 'text' | 'number'
}) {
	return (
		<label className="flex flex-col gap-1">
			<span className="opacity-70">{label}</span>
			<input
				type={type}
				min={type === 'number' ? 1 : undefined}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="rounded-md px-3 py-2 bg-white/10 border border-white/20 text-inherit focus:outline-hidden focus:border-[var(--pomo-accent)]"
			/>
		</label>
	)
}

function VideoSlot({
	phase,
	videoId,
	active,
	label,
	onReady,
	onState,
}: {
	phase: Phase
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
			<div className="aspect-video w-full rounded-lg overflow-hidden bg-black/40 [&>iframe]:w-full [&>iframe]:h-full">
				{videoId ? (
					<div ref={mount} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
				) : (
					<p className="p-4 text-sm opacity-70">
						Paste a youtube link for the {phase} video in settings.
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
				className="bg-white text-gray-800 rounded-xl p-6 w-full max-w-lg flex flex-col gap-4 shadow-2xl"
			>
				<h2 className="h3 my-0">Pomo done. What did you work on?</h2>
				<textarea
					autoFocus
					value={text}
					onChange={(e) => setText(e.target.value)}
					rows={4}
					placeholder={'- a bullet or two of markdown'}
					className="border rounded-md p-3 font-mono text-sm focus:outline-hidden focus:border-cyan-bright"
				/>
				<div className="flex gap-3 justify-end flex-wrap">
					{intention && (
						<button
							type="button"
							onClick={() => onSubmit(text, 'continue')}
							className="rounded-md px-4 py-2 border border-cyan-bright text-cyan-bright hover:underline cursor-pointer"
						>
							Keep working on it next
						</button>
					)}
					<button
						type="submit"
						className="rounded-md px-4 py-2 bg-cyan-bright text-white hover:bg-cyan cursor-pointer"
					>
						{intention ? 'Yeah, finished it' : 'Save'}
					</button>
				</div>
			</form>
		</div>
	)
}

function WorkLog({ log }: { log: Log }) {
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
									{new Date(entry.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
								</span>
								<div className="prose prose-sm prose-invert max-w-none">
									<ReactMarkdown remarkPlugins={[remarkGfm]}>
										{entry.text || entry.intention || '_(nothing noted)_'}
									</ReactMarkdown>
								</div>
								<span className="shrink-0">{entry.disposition === 'finished' ? '✅' : '↪️'}</span>
							</li>
						))}
					</ol>
				</details>
			))}
		</section>
	)
}
