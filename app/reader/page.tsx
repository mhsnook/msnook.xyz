'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const FONT_URL =
	'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap'
const ORP_COL = 4

function getORP(word) {
	if (!word) return { before: '', orp: '', after: '' }
	const len = word.length
	let pos
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

function tokenize(text) {
	return text.split(/\s+/).filter((w) => w.length > 0)
}

async function loadPdfJs() {
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

async function extractPdfText(file) {
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
	const [words, setWords] = useState([])
	const [idx, setIdx] = useState(0)
	const [wpm, setWpm] = useState(300)
	const [playing, setPlaying] = useState(false)
	const [screen, setScreen] = useState('input')
	const [pasteText, setPasteText] = useState('')
	const [loading, setLoading] = useState(false)
	const [dragOver, setDragOver] = useState(false)
	const fileInputRef = useRef(null)

	useEffect(() => {
		const link = document.createElement('link')
		link.rel = 'stylesheet'
		link.href = FONT_URL
		document.head.appendChild(link)
	}, [])

	useEffect(() => {
		if (screen !== 'read') return
		const handler = (e) => {
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
	}, [screen, wpm])

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

	const startReading = useCallback((text) => {
		const w = tokenize(text)
		if (w.length === 0) return
		setWords(w)
		setIdx(0)
		setPlaying(false)
		setScreen('read')
	}, [])

	const rewind = useCallback(() => {
		const n = Math.max(1, Math.floor((wpm / 60) * 5))
		setIdx((i) => Math.max(0, i - n))
		setPlaying(false)
	}, [wpm])

	const handleFile = async (file) => {
		if (!file) return
		setLoading(true)
		try {
			const text =
				file.type === 'application/pdf'
					? await extractPdfText(file)
					: await file.text()
			startReading(text)
		} catch (e) {
			alert('Could not read file: ' + e.message)
		} finally {
			setLoading(false)
		}
	}

	const progress = words.length > 1 ? idx / (words.length - 1) : 0
	const pct = Math.round(progress * 100)
	const minsLeft = Math.ceil((words.length - idx) / wpm)
	const { before, orp, after } = getORP(words[idx] || '')
	const padded = '\u00a0'.repeat(Math.max(0, ORP_COL - before.length))

	const ctxStart = Math.max(0, idx - 40)
	const ctxEnd = Math.min(words.length, idx + 80)
	const ctxWords = words.slice(ctxStart, ctxEnd)
	const ctxLocal = idx - ctxStart

	const s = {
		root: {
			fontFamily: 'Syne, sans-serif',
			background: '#07070f',
			minHeight: '100vh',
			color: '#ddd8cc',
		},
		inputWrap: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '100vh',
			padding: '2rem',
		},
		inputInner: { maxWidth: '520px', width: '100%' },
		badge: {
			fontSize: '10px',
			letterSpacing: '0.35em',
			color: '#f59e0b',
			textTransform: 'uppercase',
			marginBottom: '0.75rem',
		},
		h1: { fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.05, margin: 0 },
		sub: {
			color: '#555570',
			marginTop: '0.9rem',
			fontSize: '0.9rem',
			lineHeight: 1.7,
		},
		dropzone: (active) => ({
			border: `1px solid ${active ? '#f59e0b' : '#1e1e30'}`,
			borderRadius: '10px',
			padding: '1.5rem 2rem',
			cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
			gap: '1rem',
			background: active ? '#f59e0b0a' : '#0d0d1c',
			transition: 'all 0.2s',
		}),
		textarea: {
			background: '#0d0d1c',
			border: '1px solid #1e1e30',
			borderRadius: '10px',
			color: '#ddd8cc',
			padding: '1rem',
			fontSize: '0.88rem',
			resize: 'vertical',
			minHeight: '110px',
			fontFamily: 'inherit',
			outline: 'none',
			lineHeight: 1.7,
			width: '100%',
			boxSizing: 'border-box',
		},
		btn: (active) => ({
			background: active ? '#f59e0b' : '#1e1e30',
			color: active ? '#07070f' : '#444460',
			border: 'none',
			borderRadius: '10px',
			padding: '0.85rem',
			fontSize: '0.9rem',
			fontWeight: 700,
			cursor: active ? 'pointer' : 'default',
			fontFamily: 'inherit',
			letterSpacing: '0.06em',
			width: '100%',
			transition: 'all 0.2s',
		}),
		readGrid: {
			display: 'grid',
			gridTemplateColumns: '160px 1fr 200px',
			gridTemplateRows: '1fr 64px',
			height: '100vh',
			overflow: 'hidden',
		},
		panel: {
			padding: '2rem 1.25rem',
			borderRight: '1px solid #111124',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
		},
		panelR: {
			padding: '2rem 1.25rem',
			borderLeft: '1px solid #111124',
			display: 'flex',
			flexDirection: 'column',
			overflow: 'hidden',
		},
		panelLabel: {
			fontSize: '9px',
			letterSpacing: '0.35em',
			color: '#f59e0b',
			textTransform: 'uppercase',
			marginBottom: '1.25rem',
		},
		wordDisplay: {
			fontFamily: 'Space Mono, monospace',
			fontSize: 'clamp(2rem, 5vw, 3.5rem)',
			fontWeight: 700,
			userSelect: 'none',
			lineHeight: 1,
			whiteSpace: 'pre',
			display: 'flex',
			alignItems: 'baseline',
		},
		centerCol: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			position: 'relative',
		},
		controls: {
			gridColumn: '1/-1',
			borderTop: '1px solid #111124',
			background: '#0a0a16',
			display: 'flex',
			alignItems: 'center',
			gap: '1rem',
			padding: '0 1.5rem',
			flexWrap: 'wrap',
		},
	}

	if (screen === 'input')
		return (
			<div style={s.root}>
				<div style={s.inputWrap}>
					<div style={s.inputInner}>
						<div style={{ marginBottom: '2.5rem' }}>
							<div style={s.badge}>RSVP · Rapid Serial Visual Presentation</div>
							<h1 style={s.h1}>
								Read fast.
								<br />
								Stay grounded.
							</h1>
							<p style={s.sub}>
								The amber letter is your anchor. Your eyes never move — words
								come to you. Upload a PDF or paste any text to begin.
							</p>
						</div>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '0.875rem',
							}}
						>
							<div
								style={s.dropzone(dragOver)}
								onDragOver={(e) => {
									e.preventDefault()
									setDragOver(true)
								}}
								onDragLeave={() => setDragOver(false)}
								onDrop={(e) => {
									e.preventDefault()
									setDragOver(false)
									handleFile(e.dataTransfer.files[0])
								}}
								onClick={() => fileInputRef.current?.click()}
							>
								<span style={{ fontSize: '1.4rem' }}>📄</span>
								<div>
									<div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
										{loading
											? 'Extracting text…'
											: 'Drop file or click to upload'}
									</div>
									<div
										style={{
											color: '#444460',
											fontSize: '0.75rem',
											marginTop: '0.15rem',
										}}
									>
										.pdf · .txt · .md
									</div>
								</div>
								<input
									ref={fileInputRef}
									type="file"
									accept=".pdf,.txt,.md"
									onChange={(e) => handleFile(e.target.files[0])}
									style={{ display: 'none' }}
								/>
							</div>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '0.75rem',
									color: '#333350',
									fontSize: '0.75rem',
								}}
							>
								<div
									style={{ flex: 1, height: '1px', background: '#1a1a2a' }}
								/>
								or
								<div
									style={{ flex: 1, height: '1px', background: '#1a1a2a' }}
								/>
							</div>
							<textarea
								style={s.textarea}
								value={pasteText}
								onChange={(e) => setPasteText(e.target.value)}
								placeholder="Paste any text here…"
							/>
							<button
								style={s.btn(!!pasteText.trim())}
								onClick={() => pasteText.trim() && startReading(pasteText)}
							>
								Start Reading →
							</button>
						</div>
					</div>
				</div>
			</div>
		)

	return (
		<div style={{ ...s.root, ...s.readGrid }}>
			<div style={{ ...s.panel, opacity: 0.65 }}>
				<div style={s.panelLabel}>Progress</div>
				<div
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						maxHeight: '320px',
					}}
				>
					<div
						style={{
							flex: 1,
							background: '#111124',
							borderRadius: '6px',
							position: 'relative',
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								background: 'linear-gradient(to top, #f59e0b18, transparent)',
								height: `${pct}%`,
								transition: 'height 0.4s ease',
								borderTop: '1px solid #f59e0b55',
							}}
						/>
						<div
							style={{
								position: 'absolute',
								bottom: `${pct}%`,
								left: 0,
								right: 0,
								height: '2px',
								background: '#f59e0b',
								boxShadow: '0 0 8px #f59e0b88',
								transition: 'bottom 0.4s ease',
							}}
						/>
					</div>
				</div>
				<div
					style={{
						marginTop: '1.25rem',
						fontSize: '0.72rem',
						color: '#444460',
						lineHeight: 2.2,
					}}
				>
					<div style={{ color: '#888898' }}>{pct}%</div>
					<div>
						{idx.toLocaleString()} / {words.length.toLocaleString()}
					</div>
					<div>
						~{minsLeft < 1 ? '<1' : minsLeft}m left @ {wpm}wpm
					</div>
				</div>
			</div>

			<div style={s.centerCol}>
				<div
					style={{
						position: 'absolute',
						top: 0,
						bottom: '20%',
						left: 'calc(50% - 1.5ch)',
						width: '1px',
						background:
							'linear-gradient(to bottom, transparent, #f59e0b18, transparent)',
						pointerEvents: 'none',
					}}
				/>
				<div style={s.wordDisplay}>
					<span style={{ color: '#9090b0' }}>
						{padded}
						{before}
					</span>
					<span style={{ color: '#f59e0b', textShadow: '0 0 24px #f59e0b55' }}>
						{orp}
					</span>
					<span style={{ color: '#ddd8cc' }}>{after}</span>
				</div>
				<div
					style={{
						marginTop: '3.5rem',
						fontSize: '0.75rem',
						color: '#2a2a40',
						maxWidth: '480px',
						textAlign: 'center',
						lineHeight: 2,
						padding: '0 1.5rem',
					}}
				>
					<span style={{ color: '#333350' }}>
						{words.slice(Math.max(0, idx - 6), idx).join(' ')}{' '}
					</span>
					<span style={{ color: '#606080' }}>{words[idx]}</span>
					<span style={{ color: '#222238' }}>
						{' '}
						{words.slice(idx + 1, idx + 7).join(' ')}
					</span>
				</div>
			</div>

			<div style={{ ...s.panelR, opacity: 0.55 }}>
				<div style={s.panelLabel}>Context</div>
				<div
					style={{
						fontSize: '0.68rem',
						lineHeight: 2,
						overflow: 'hidden',
						flex: 1,
					}}
				>
					{ctxWords.map((w, i) => (
						<span
							key={ctxStart + i}
							style={{
								marginRight: '0.25em',
								color:
									i === ctxLocal
										? '#c8c4b8'
										: i < ctxLocal
											? '#222238'
											: '#3a3a55',
								fontWeight: i === ctxLocal ? 700 : 400,
								transition: 'color 0.1s',
							}}
						>
							{w}
						</span>
					))}
				</div>
			</div>

			<div style={s.controls}>
				<button
					onClick={() => {
						setScreen('input')
						setPlaying(false)
					}}
					style={{
						background: 'none',
						border: '1px solid #1e1e30',
						color: '#444460',
						borderRadius: '6px',
						padding: '0.35rem 0.75rem',
						cursor: 'pointer',
						fontFamily: 'inherit',
						fontSize: '0.75rem',
					}}
				>
					← back
				</button>
				<button
					onClick={rewind}
					style={{
						background: 'none',
						border: '1px solid #1e1e30',
						color: '#8888a8',
						borderRadius: '6px',
						padding: '0.35rem 0.75rem',
						cursor: 'pointer',
						fontFamily: 'inherit',
						fontSize: '0.75rem',
					}}
				>
					↩ 5s
				</button>
				<button
					onClick={() => setPlaying((p) => !p)}
					style={{
						background: '#f59e0b',
						border: 'none',
						color: '#07070f',
						borderRadius: '6px',
						padding: '0.4rem 1.25rem',
						cursor: 'pointer',
						fontFamily: 'inherit',
						fontSize: '0.85rem',
						fontWeight: 700,
						minWidth: '72px',
					}}
				>
					{playing ? '⏸' : '▶'}
				</button>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '0.6rem',
						flex: 1,
						maxWidth: '280px',
					}}
				>
					<span
						style={{
							fontSize: '0.7rem',
							color: '#555570',
							whiteSpace: 'nowrap',
						}}
					>
						{wpm} wpm
					</span>
					<input
						type="range"
						min={80}
						max={1000}
						step={20}
						value={wpm}
						onChange={(e) => setWpm(Number(e.target.value))}
						style={{ flex: 1, accentColor: '#f59e0b', height: '3px' }}
					/>
				</div>
				<div
					style={{
						marginLeft: 'auto',
						fontSize: '0.65rem',
						color: '#2a2a40',
						letterSpacing: '0.05em',
					}}
				>
					space · pause &nbsp;·&nbsp; ← rewind
				</div>
			</div>
		</div>
	)
}
