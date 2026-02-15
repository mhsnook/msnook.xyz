import { create } from 'zustand'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'break'

type TimerState = {
	status: TimerStatus
	secondsRemaining: number
	durationSeconds: number
	intention: string
	sessionId: number | null
	// actions
	startTimer: (duration: number, intention: string, sessionId: number) => void
	pauseTimer: () => void
	resumeTimer: () => void
	tick: () => void
	stopTimer: () => void
	startBreak: (duration?: number) => void
	reset: () => void
}

export const useTimerStore = create<TimerState>((set) => ({
	status: 'idle',
	secondsRemaining: 0,
	durationSeconds: 1500,
	intention: '',
	sessionId: null,

	startTimer: (duration, intention, sessionId) =>
		set({
			status: 'running',
			secondsRemaining: duration,
			durationSeconds: duration,
			intention,
			sessionId,
		}),

	pauseTimer: () => set({ status: 'paused' }),

	resumeTimer: () => set({ status: 'running' }),

	tick: () =>
		set((state) => {
			if (state.secondsRemaining <= 1) {
				return { secondsRemaining: 0 }
			}
			return { secondsRemaining: state.secondsRemaining - 1 }
		}),

	stopTimer: () =>
		set({
			status: 'idle',
			secondsRemaining: 0,
			intention: '',
			sessionId: null,
		}),

	startBreak: (duration = 300) =>
		set({
			status: 'break',
			secondsRemaining: duration,
			durationSeconds: duration,
			intention: 'Break',
			sessionId: null,
		}),

	reset: () =>
		set({
			status: 'idle',
			secondsRemaining: 0,
			durationSeconds: 1500,
			intention: '',
			sessionId: null,
		}),
}))
