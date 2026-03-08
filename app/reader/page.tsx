'use client'

import {
	useState,
	useEffect,
	useRef,
	useCallback,
	type ChangeEvent,
	type DragEvent,
	type KeyboardEvent as ReactKeyboardEvent,
} from 'react'

declare global {
	interface Window {
		pdfjsLib: {
			GlobalWorkerOptions: { workerSrc: string }
			getDocument: (opts: { data: ArrayBuffer }) => {
				promise: Promise<{
					numPages: number
					getPage: (n: number) => Promise<{
						getTextContent: () => Promise<{
							items: Array<{ str: string }>
						}>
					}>
				}>
			}
		}
	}
}

const FONT_URL =
	'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap'

/**
 * Fixed column width (in ch) for the "before ORP" region.
 * The ORP letter sits at exactly this offset from the left of the word container.
 * Since the container is positioned so offset ORP_FIXED_WIDTH+0.5 ch = viewport center,
 * the ORP character is always dead center.
 */
const ORP_FIXED_WIDTH = 10

type Screen = 'input' | 'read'

interface ORPParts {
	before: string
	orp: string
	after: string
}

function getORP(word: string): ORPParts {
	if (!word) return { before: '', orp: '', after: '' }
	const len = word.length
	let pos: number
	if (len <= 1) pos = 0
	else if (len <= 5) pos = 1
	else if (len <= 9) pos = 2
	else if (len <= 13) pos = 3
	else pos = Math.floor(len * 0.28)
	return {
		before: word.slice(0, pos),
		orp: word[pos],
		after: word.slice(pos + 1),
	}
}

function tokenize(text: string): string[] {
	return text.split(/\s+/).filter((w) => w.length > 0)
}

async function loadPdfJs(): Promise<Window['pdfjsLib']> {
	if (window.pdfjsLib) return window.pdfjsLib
	return new Promise((resolve, reject) => {
		const s = document.createElement('script')
		s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
		s.onload = () => {
			window.pdfjsLib.GlobalWorkerOptions.workerSrc =
				'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
			resolve(window.pdfjsLib)
		}
		s.onerror = reject
		document.head.appendChild(s)
	})
}

async function extractPdfText(file: File): Promise<string> {
	const lib = await loadPdfJs()
	const buf = await file.arrayBuffer()
	const pdf = await lib.getDocument({ data: buf }).promise
	let text = ''
	for (let i = 1; i <= pdf.numPages; i++) {
		const page = await pdf.getPage(i)
		const content = await page.getTextContent()
		text += content.items.map((x) => x.str).join(' ') + '\n'
	}
	return text
}

export default function RSVPReader() {
	const [words, setWords] = useState<string[]>([])
	const [idx, setIdx] = useState(0)
	const [wpm, setWpm] = useState(300)
	const [playing, setPlaying] = useState(false)
	const [screen, setScreen] = useState<Screen>('input')
	const [pasteText, setPasteText] = useState('')
	const [loading, setLoading] = useState(false)
	const [dragOver, setDragOver] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = FONT_URL
		document.head.appendChild(link)
	}, [])

	const rewind = useCallback(() => {
		const n = Math.max(1, Math.floor((wpm / 60) * 5))
		setIdx((i) => Math.max(0, i - n))
		setPlaying(false)
	}, [wpm])

	useEffect(() => {
		if (screen !== 'read') return
		const handler = (e: globalThis.KeyboardEvent) => {
			if (e.code === 'Space') {
				e.preventDefault()
				setPlaying((p) => !p)
			}
			if (e.code === 'ArrowLeft') {
				e.preventDefault()
				rewind()
			}
		}
		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [screen, rewind])

	useEffect(() => {
		if (!playing || words.length === 0) return
		const ms = 60000 / wpm
		const id = setInterval(() => {
			setIdx((i) => {
				if (i >= words.length - 1) {
					setPlaying(false)
					return i
				}
				return i + 1
			})
		}, ms)
		return () => clearInterval(id)
	}, [playing, wpm, words.length])

	const startReading = useCallback((text: string) => {
		const w = tokenize(text)
		if (w.length === 0) return
		setWords(w)
		setIdx(0)
		setPlaying(false)
		setScreen('read')
	}, [])

	const handleFile = async (file: File | undefined) => {
		if (!file) return
		setLoading(true)
		try {
			const text =
				file.type === 'application/pdf'
					? await extractPdfText(file)
					: await file.text()
			startReading(text)
		} catch (e) {
			alert('Could not read file: ' + (e as Error).message)
		} finally {
			setLoading(false)
		}
	}

	const progress = words.length > 1 ? idx / (words.length - 1) : 0
	const pct = Math.round(progress * 100)
	const minsLeft = Math.ceil((words.length - idx) / wpm)
	const { before, orp, after } = getORP(words[idx] || '')

	// Context sidebar words
	const ctxStart = Math.max(0, idx - 40)
	const ctxEnd = Math.min(words.length, idx + 80)
	const ctxWords = words.slice(ctxStart, ctxEnd)
	const ctxLocal = idx - ctxStart

	if (screen === 'input') {
		return (
			<div className="min-h-screen bg-sky-50 text-slate-800 font-sans flex items-center justify-center p-8">
				<div className="max-w-lg w-full">
					<div className="mb-10">
						<p className="text-[10px] tracking-[0.35em] text-amber-600 uppercase mb-3">
							RSVP · Rapid Serial Visual Presentation
						</p>
						<h1 className="text-5xl font-extrabold leading-none text-slate-900 font-display">
							Read fast.
							<br />
							Stay grounded.
						</h1>
						<p className="text-slate-500 mt-4 text-sm leading-relaxed">
							The amber letter is your anchor. Your eyes never move — words come
							to you. Upload a PDF or paste any text to begin.
						</p>
					</div>

					<div className="flex flex-col gap-3.5">
						<div
							className={`border rounded-xl px-6 py-5 cursor-pointer flex items-center gap-4 transition-colors ${
								dragOver
									? 'border-amber-500 bg-amber-50'
									: 'border-slate-200 bg-white'
							}`}
							onDragOver={(e: DragEvent) => {
								e.preventDefault()
								setDragOver(true)
							}}
							onDragLeave={() => setDragOver(false)}
							onDrop={(e: DragEvent) => {
								e.preventDefault()
								setDragOver(false)
								handleFile(e.dataTransfer.files[0])
							}}
							onClick={() => fileInputRef.current?.click()}
						>
							<span className="text-xl">📄</span>
							<div>
								<p className="font-semibold text-sm">
									{loading
										? 'Extracting text…'
										: 'Drop file or click to upload'}
								</p>
								<p className="text-slate-400 text-xs mt-0.5">
									.pdf · .txt · .md
								</p>
							</div>
							<input
								ref={fileInputRef}
								type="file"
								accept=".pdf,.txt,.md"
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									handleFile(e.target.files?.[0])
								}
								className="hidden"
							/>
						</div>

						<div className="flex items-center gap-3 text-slate-300 text-xs">
							<div className="flex-1 h-px bg-slate-200" />
							or
							<div className="flex-1 h-px bg-slate-200" />
						</div>

						<textarea
							className="bg-white border border-slate-200 rounded-xl text-slate-800 p-4 text-sm resize-y min-h-28 font-sans outline-none leading-relaxed w-full"
							value={pasteText}
							onChange={(e) => setPasteText(e.target.value)}
							placeholder="Paste any text here…"
						/>

						<button
							className={`rounded-xl py-3.5 text-sm font-bold tracking-wide w-full transition-colors ${
								pasteText.trim()
									? 'bg-amber-500 text-white cursor-pointer hover:bg-amber-600'
									: 'bg-slate-100 text-slate-300 cursor-default'
							}`}
							onClick={() => pasteText.trim() && startReading(pasteText)}
						>
							Start Reading →
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div
			className="bg-sky-50 text-slate-800 font-sans h-screen overflow-hidden"
			style={{
				display: 'grid',
				gridTemplateColumns: '160px 1fr 220px',
				gridTemplateRows: '1fr 64px',
			}}
		>
			{/* Left panel: progress */}
			<div className="border-r border-slate-200 p-5 flex flex-col justify-center">
				<p className="text-[9px] tracking-[0.35em] text-amber-600 uppercase mb-5">
					Progress
				</p>
				<div className="flex-1 flex flex-col max-h-80">
					<div className="flex-1 bg-sky-100 rounded-md relative overflow-hidden">
						<div
							className="absolute bottom-0 left-0 right-0 transition-[height] duration-400 ease-out"
							style={{
								height: `${pct}%`,
								background:
									'linear-gradient(to top, rgba(245,158,11,0.12), transparent)',
								borderTop: '1px solid rgba(245,158,11,0.3)',
							}}
						/>
						<div
							className="absolute left-0 right-0 h-0.5 bg-amber-500 transition-[bottom] duration-400 ease-out"
							style={{
								bottom: `${pct}%`,
								boxShadow: '0 0 8px rgba(245,158,11,0.5)',
							}}
						/>
					</div>
				</div>
				<div className="mt-5 text-xs text-slate-400 leading-loose">
					<p className="text-slate-600 font-semibold">{pct}%</p>
					<p>
						{idx.toLocaleString()} / {words.length.toLocaleString()} words
					</p>
					<p>
						~{minsLeft < 1 ? '<1' : minsLeft}m left @ {wpm}wpm
					</p>
				</div>
			</div>

			{/* Center: reader */}
			<div className="flex flex-col items-center justify-center relative">
				{/* Subtle vertical guide at center */}
				<div
					className="absolute top-0 pointer-events-none"
					style={{
						bottom: '20%',
						left: '50%',
						width: '1px',
						background:
							'linear-gradient(to bottom, transparent, rgba(245,158,11,0.08), transparent)',
					}}
				/>

				{/* Word display — ORP is always at exact center */}
				<div className="relative w-full" style={{ height: '5rem' }}>
					<div
						className="absolute top-1/2 flex items-baseline"
						style={{
							left: '50%',
							/*
							 * Position so the CENTER of the ORP char = viewport center.
							 * The "before" region is ORP_FIXED_WIDTH ch wide.
							 * The ORP char center is at (ORP_FIXED_WIDTH + 0.5) ch from the left of this div.
							 * Translating left by that amount puts the ORP center at left:50% = viewport center.
							 */
							transform: `translate(-${ORP_FIXED_WIDTH + 0.5}ch, -50%)`,
							fontFamily: "'Space Mono', monospace",
							fontSize: 'clamp(2rem, 5vw, 3.5rem)',
							fontWeight: 700,
							lineHeight: 1,
							whiteSpace: 'pre',
							userSelect: 'none',
						}}
					>
						<span
							className="inline-block text-right text-slate-400"
							style={{ width: `${ORP_FIXED_WIDTH}ch` }}
						>
							{before}
						</span>
						<span
							className="text-amber-500"
							style={{ textShadow: '0 0 20px rgba(245,158,11,0.3)' }}
						>
							{orp}
						</span>
						<span className="text-slate-800">{after}</span>
					</div>
				</div>

				{/* Micro context — surrounding sentence fragment */}
				<div className="text-xs text-center leading-loose px-6 max-w-md">
					<span className="text-slate-400">
						{words.slice(Math.max(0, idx - 6), idx).join(' ')}{' '}
					</span>
					<span className="text-slate-600 font-semibold">{words[idx]}</span>
					<span className="text-slate-300">
						{' '}
						{words.slice(idx + 1, idx + 7).join(' ')}
					</span>
				</div>
			</div>

			{/* Right panel: context */}
			<div className="border-l border-slate-200 p-5 flex flex-col overflow-hidden">
				<p className="text-[9px] tracking-[0.35em] text-amber-600 uppercase mb-5">
					Context
				</p>
				<div className="text-xs leading-loose overflow-hidden flex-1">
					{ctxWords.map((w, i) => (
						<span
							key={ctxStart + i}
							className={`mr-1 transition-colors duration-100 ${
								i === ctxLocal
									? 'text-slate-800 font-bold'
									: i < ctxLocal
										? 'text-slate-300'
										: 'text-slate-500'
							}`}
						>
							{w}
						</span>
					))}
				</div>
			</div>

			{/* Controls bar */}
			<div
				className="flex items-center gap-4 px-6 border-t border-slate-200 bg-white"
				style={{ gridColumn: '1 / -1' }}
			>
				<button
					onClick={() => {
						setScreen('input')
						setPlaying(false)
					}}
					className="border border-slate-200 text-slate-400 rounded-md px-3 py-1.5 text-xs cursor-pointer font-sans hover:border-slate-300 hover:text-slate-500"
				>
					← back
				</button>
				<button
					onClick={rewind}
					className="border border-slate-200 text-slate-500 rounded-md px-3 py-1.5 text-xs cursor-pointer font-sans hover:border-slate-300 hover:text-slate-600"
				>
					↩ 5s
				</button>
				<button
					onClick={() => setPlaying((p) => !p)}
					className="bg-amber-500 text-white rounded-md px-5 py-1.5 text-sm font-bold cursor-pointer min-w-[72px] hover:bg-amber-600"
				>
					{playing ? '⏸' : '▶'}
				</button>

				<div className="flex items-center gap-2.5 flex-1 max-w-72">
					<span className="text-xs text-slate-400 whitespace-nowrap">
						{wpm} wpm
					</span>
					<input
						type="range"
						min={80}
						max={1000}
						step={20}
						value={wpm}
						onChange={(e) => setWpm(Number(e.target.value))}
						className="flex-1 accent-amber-500 h-1"
					/>
				</div>

				<p className="ml-auto text-[11px] text-slate-300 tracking-wide">
					space · pause &nbsp;·&nbsp; ← rewind
				</p>
			</div>
		</div>
	)
}
