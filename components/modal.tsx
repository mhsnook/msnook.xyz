import { useEffect, useCallback } from 'react'
import { CloseButton, Overlay } from '../components/lib'

interface ModalProps {
	showing: boolean
	close?: () => void
	children: React.ReactNode
}

export default function Modal({ showing, close, children }: ModalProps) {
	const closeFn = close || (() => {})
	const escFunction = useCallback((event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closeFn()
		}
	}, [])

	useEffect(() => {
		if (showing) document.addEventListener('keydown', escFunction, false)
		else document.removeEventListener('keydown', escFunction, false)
	}, [showing, escFunction])

	return showing ? (
		<Overlay close={closeFn}>
			<div
				role="dialog"
				className="bg-white rounded-sm max-w-xl mx-auto px-6 py-4 relative"
			>
				{children}
				{close && <CloseButton close={close} />}
			</div>
		</Overlay>
	) : null
}
