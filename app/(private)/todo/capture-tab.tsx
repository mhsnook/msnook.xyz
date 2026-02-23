'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/lib'
import { useAddTask } from './use-todoist'
import toast from 'react-hot-toast'

// Extend Window for SpeechRecognition
type SpeechRecognitionEvent = Event & {
	results: { [index: number]: { [index: number]: { transcript: string } } }
	resultIndex: number
}

function getSpeechRecognition(): (new () => SpeechRecognition) | null {
	if (typeof window === 'undefined') return null
	return (
		(window as any).SpeechRecognition ||
		(window as any).webkitSpeechRecognition ||
		null
	)
}

type SpeechRecognition = {
	continuous: boolean
	interimResults: boolean
	lang: string
	start: () => void
	stop: () => void
	abort: () => void
	onresult: ((e: SpeechRecognitionEvent) => void) | null
	onerror: ((e: Event & { error: string }) => void) | null
	onend: (() => void) | null
}

export default function CaptureTab({
	sectionId,
	onCaptured,
}: {
	sectionId: string
	onCaptured?: () => void
}) {
	const [text, setText] = useState('')
	const [isRecording, setIsRecording] = useState(false)
	const [transcript, setTranscript] = useState('')
	const recognitionRef = useRef<SpeechRecognition | null>(null)
	const addTask = useAddTask()

	const supportsVoice = typeof window !== 'undefined' && !!getSpeechRecognition()

	const startRecording = useCallback(() => {
		const SpeechRecognitionClass = getSpeechRecognition()
		if (!SpeechRecognitionClass) return

		const recognition = new SpeechRecognitionClass() as unknown as SpeechRecognition
		recognition.continuous = true
		recognition.interimResults = true
		recognition.lang = 'en-US'

		recognition.onresult = (e: SpeechRecognitionEvent) => {
			let finalTranscript = ''
			let interimTranscript = ''
			for (let i = e.resultIndex; i < e.results.length; i++) {
				const result = e.results[i]
				if (result[0]) {
					if ((result as any).isFinal) {
						finalTranscript += result[0].transcript
					} else {
						interimTranscript += result[0].transcript
					}
				}
			}
			setTranscript(finalTranscript || interimTranscript)
		}

		recognition.onerror = (e) => {
			console.error('Speech recognition error:', e.error)
			setIsRecording(false)
		}

		recognition.onend = () => {
			setIsRecording(false)
		}

		recognitionRef.current = recognition
		recognition.start()
		setIsRecording(true)
		setTranscript('')
	}, [])

	const stopRecording = useCallback(() => {
		if (recognitionRef.current) {
			recognitionRef.current.stop()
			recognitionRef.current = null
		}
	}, [])

	// When recording stops and we have a transcript, put it in the text field
	useEffect(() => {
		if (!isRecording && transcript) {
			setText((prev) => (prev ? `${prev} ${transcript}` : transcript))
			setTranscript('')
		}
	}, [isRecording, transcript])

	const handleSubmit = () => {
		const content = text.trim()
		if (!content) return

		addTask.mutate(
			{
				content,
				sectionId,
				labels: ['inbox'],
			},
			{
				onSuccess: () => {
					setText('')
					toast.success('Captured!')
					onCaptured?.()
				},
				onError: (err) => {
					toast.error(err.message)
				},
			},
		)
	}

	return (
		<div className="flex flex-col items-center gap-6">
			<p className="text-gray-500 text-sm text-center">
				Capture what&rsquo;s on your mind. We&rsquo;ll sort it out later.
			</p>

			{/* Voice recording button */}
			{supportsVoice && (
				<button
					onClick={isRecording ? stopRecording : startRecording}
					className={`w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl transition-all cursor-pointer ${
						isRecording
							? 'bg-red-500 animate-pulse shadow-lg shadow-red-300'
							: 'bg-cyan-bright hover:bg-cyan shadow-md hover:shadow-lg'
					}`}
					aria-label={isRecording ? 'Stop recording' : 'Start recording'}
				>
					{isRecording ? (
						<svg
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<rect x="6" y="6" width="12" height="12" rx="2" />
						</svg>
					) : (
						<svg
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
							<path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
						</svg>
					)}
				</button>
			)}

			{/* Live transcript preview */}
			{isRecording && transcript && (
				<p className="text-gray-600 italic text-center max-w-sm">
					&ldquo;{transcript}&rdquo;
				</p>
			)}

			{/* Text input */}
			<div className="w-full max-w-md">
				<textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault()
							handleSubmit()
						}
					}}
					placeholder="Or type something here..."
					rows={3}
					className="appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-hidden resize-none"
				/>
				<div className="flex justify-end mt-2">
					<Button
						variant="solid"
						onClick={handleSubmit}
						disabled={!text.trim() || addTask.isPending}
					>
						{addTask.isPending ? 'Saving...' : 'Capture'}
					</Button>
				</div>
			</div>

			{!supportsVoice && (
				<p className="text-xs text-gray-400 text-center">
					Voice capture is not supported in this browser. Try Chrome or Edge.
				</p>
			)}
		</div>
	)
}
