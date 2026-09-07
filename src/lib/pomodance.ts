export type Phase = 'work' | 'break'
export type Disposition = 'finished' | 'continue'

export type Settings = {
	workVideo: string
	breakVideo: string
	workMinutes: number
	breakMinutes: number
}

export type LogEntry = {
	at: string
	intention: string
	text: string
	disposition: Disposition
}

export type Log = Record<string, LogEntry[]>

const SETTINGS_KEY = 'pomodance:settings'
const LOG_KEY = 'pomodance:log'
const INTENTION_KEY = 'pomodance:intention'

export const DEFAULT_SETTINGS: Settings = {
	workVideo: 'jfKfPfyJRdk',
	breakVideo: 'FGBhQbmPwH8',
	workMinutes: 25,
	breakMinutes: 5,
}

function read<T>(key: string, fallback: T): T {
	if (typeof localStorage === 'undefined') return fallback
	try {
		const raw = localStorage.getItem(key)
		return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
	} catch {
		return fallback
	}
}

export function loadSettings(): Settings {
	return read(SETTINGS_KEY, DEFAULT_SETTINGS)
}

export function saveSettings(settings: Settings) {
	localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadLog(): Log {
	return read<Log>(LOG_KEY, {})
}

export function appendLog(log: Log, entry: LogEntry): Log {
	const day = entry.at.slice(0, 10)
	const next = { ...log, [day]: [...(log[day] ?? []), entry] }
	localStorage.setItem(LOG_KEY, JSON.stringify(next))
	return next
}

export function loadIntention(): string {
	if (typeof localStorage === 'undefined') return ''
	return localStorage.getItem(INTENTION_KEY) ?? ''
}

export function saveIntention(intention: string) {
	localStorage.setItem(INTENTION_KEY, intention)
}

/** Accepts a bare video id or any of the usual youtube URL shapes. */
export function parseVideoId(input: string): string {
	const s = input.trim()
	if (/^[\w-]{11}$/.test(s)) return s
	try {
		const url = new URL(s)
		if (url.hostname === 'youtu.be') return url.pathname.slice(1, 12)
		const v = url.searchParams.get('v')
		if (v) return v.slice(0, 11)
		const m = url.pathname.match(/\/(?:embed|shorts|live)\/([\w-]{11})/)
		if (m) return m[1]
	} catch {
		/* not a url */
	}
	return ''
}

export function msFor(settings: Settings, phase: Phase) {
	return (phase === 'work' ? settings.workMinutes : settings.breakMinutes) * 60_000
}

export function formatClock(seconds: number) {
	const total = Math.max(0, seconds)
	const m = Math.floor(total / 60)
	const s = total % 60
	return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// ---- sounds ----

let ctx: AudioContext | null = null
function audio() {
	if (typeof window === 'undefined') return null
	ctx ??= new AudioContext()
	if (ctx.state === 'suspended') void ctx.resume()
	return ctx
}

function tone(freq: number, start: number, duration: number, gain = 0.15, type: OscillatorType = 'sine') {
	const ac = audio()
	if (!ac) return
	const osc = ac.createOscillator()
	const g = ac.createGain()
	osc.type = type
	osc.frequency.value = freq
	const t0 = ac.currentTime + start
	g.gain.setValueAtTime(0, t0)
	g.gain.linearRampToValueAtTime(gain, t0 + 0.01)
	g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
	osc.connect(g).connect(ac.destination)
	osc.start(t0)
	osc.stop(t0 + duration + 0.05)
}

export const sounds = {
	beep: () => tone(880, 0, 0.12),
	click: () => tone(220, 0, 0.05, 0.1, 'square'),
	ring: () => {
		tone(1046, 0, 0.5)
		tone(1318, 0.15, 0.5)
		tone(1568, 0.3, 0.8)
	},
}

// ---- youtube iframe api ----

export type YTPlayer = {
	playVideo(): void
	pauseVideo(): void
	destroy(): void
}

type YTNamespace = {
	Player: new (
		el: HTMLElement,
		opts: {
			videoId: string
			playerVars?: Record<string, string | number>
			events?: {
				onReady?: () => void
				onStateChange?: (e: { data: number }) => void
			}
		},
	) => YTPlayer
	PlayerState: { PLAYING: number; PAUSED: number }
}

declare global {
	interface Window {
		YT?: YTNamespace
		onYouTubeIframeAPIReady?: () => void
	}
}

let ytReady: Promise<YTNamespace> | null = null

export function loadYouTubeApi(): Promise<YTNamespace> {
	ytReady ??= new Promise((resolve) => {
		if (window.YT?.Player) return resolve(window.YT)
		const prev = window.onYouTubeIframeAPIReady
		window.onYouTubeIframeAPIReady = () => {
			prev?.()
			resolve(window.YT!)
		}
		const script = document.createElement('script')
		script.src = 'https://www.youtube.com/iframe_api'
		document.head.appendChild(script)
	})
	return ytReady
}
