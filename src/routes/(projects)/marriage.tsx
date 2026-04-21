import { useCallback, useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Button from '@/components/ui/button'

export const Route = createFileRoute('/(projects)/marriage')({
	head: () => ({
		meta: [{ title: 'Certificate of Marriage' }],
	}),
	component: MarriagePage,
})

function MarriagePage() {
	const [step, setStep] = useState<0 | 1 | 2>(0)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const launchConfetti = useCallback(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		canvas.width = window.innerWidth
		canvas.height = window.innerHeight

		const colors = [
			'#ff6b6b',
			'#ffd93d',
			'#6bcb77',
			'#4d96ff',
			'#ff6eb4',
			'#c084fc',
			'#fbbf24',
			'#f472b6',
			'#34d399',
			'#60a5fa',
		]

		const pieces: {
			x: number
			y: number
			w: number
			h: number
			color: string
			vx: number
			vy: number
			rotation: number
			rotationSpeed: number
			gravity: number
		}[] = []

		for (let i = 0; i < 200; i++) {
			pieces.push({
				x: canvas.width / 2 + (Math.random() - 0.5) * 200,
				y: canvas.height / 2,
				w: Math.random() * 10 + 5,
				h: Math.random() * 6 + 3,
				color: colors[Math.floor(Math.random() * colors.length)],
				vx: (Math.random() - 0.5) * 20,
				vy: Math.random() * -18 - 4,
				rotation: Math.random() * Math.PI * 2,
				rotationSpeed: (Math.random() - 0.5) * 0.3,
				gravity: 0.25 + Math.random() * 0.1,
			})
		}

		let frame = 0
		const maxFrames = 180

		function animate() {
			if (frame >= maxFrames) {
				ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
				return
			}
			ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
			for (const p of pieces) {
				p.x += p.vx
				p.vy += p.gravity
				p.y += p.vy
				p.vx *= 0.99
				p.rotation += p.rotationSpeed
				ctx!.save()
				ctx!.translate(p.x, p.y)
				ctx!.rotate(p.rotation)
				ctx!.fillStyle = p.color
				ctx!.globalAlpha = Math.max(0, 1 - frame / maxFrames)
				ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
				ctx!.restore()
			}
			frame++
			requestAnimationFrame(animate)
		}
		animate()
	}, [])

	useEffect(() => {
		if (step === 2) {
			launchConfetti()
		}
	}, [step, launchConfetti])

	return (
		<>
			<canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
			<main className="container py-10 flex flex-col items-center min-h-[80vh] justify-center">
				<div className="max-w-lg w-full text-center space-y-8">
					{/* Header */}
					<div className="space-y-2">
						<p className="text-sm uppercase tracking-[0.3em] text-gray-400">The Internet</p>
						<h1
							className="text-4xl md:text-5xl font-light tracking-tight"
							style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
						>
							Certificate of Marriage
						</h1>
						<div className="flex items-center justify-center gap-3 pt-1">
							<span className="block h-px w-16 bg-gray-300" />
							<span className="text-gray-300 text-xs">&#10045;</span>
							<span className="block h-px w-16 bg-gray-300" />
						</div>
					</div>

					{/* Body */}
					<div
						className="border border-gray-200 rounded-lg p-8 md:p-12 space-y-8 bg-white shadow-sm"
						style={{
							backgroundImage:
								'radial-gradient(circle at 50% 0%, rgba(200,200,255,0.08), transparent 70%)',
						}}
					>
						<p
							className="text-gray-500 text-sm leading-relaxed"
							style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
						>
							Let it be known that on this day, by the power vested in this website by absolutely no
							one, the following parties have entered into the sacred bond of marriage by clicking
							buttons on the internet.
						</p>

						<div className="space-y-3">
							<p className="text-xs uppercase tracking-widest text-gray-400">
								Party of the First Part
							</p>
							{step >= 1 ? (
								<p className="text-green-600 font-medium text-lg">&#10003; &ldquo;I do&rdquo;</p>
							) : (
								<Button variant="solid" onClick={() => setStep(1)} className="text-lg px-10">
									I do
								</Button>
							)}
						</div>

						<div className="space-y-3">
							<p className="text-xs uppercase tracking-widest text-gray-400">
								Party of the Second Part
							</p>
							{step >= 2 ? (
								<p className="text-green-600 font-medium text-lg">&#10003; &ldquo;I do&rdquo;</p>
							) : step === 1 ? (
								<Button variant="solid" onClick={() => setStep(2)} className="text-lg px-10">
									I do
								</Button>
							) : (
								<p className="text-gray-300 italic text-sm">
									Waiting for Party of the First Part&hellip;
								</p>
							)}
						</div>

						{step === 2 && (
							<div className="pt-4 space-y-4 animate-in fade-in duration-500">
								<div className="flex items-center justify-center gap-3">
									<span className="block h-px w-12 bg-gray-300" />
									<span className="text-gray-300 text-xs">&#10045;</span>
									<span className="block h-px w-12 bg-gray-300" />
								</div>

								<div className="flex justify-center">
									<div
										className="w-24 h-24 rounded-full border-4 border-double border-cyan-bright flex items-center justify-center relative"
										style={{
											boxShadow: '0 0 0 2px white, 0 0 0 4px var(--color-cyan-bright)',
										}}
									>
										<span className="text-cyan-bright text-4xl font-bold">&#10003;</span>
										<span
											className="absolute -bottom-1 text-[8px] uppercase tracking-widest text-cyan-bright font-bold bg-white px-2"
											style={{ letterSpacing: '0.15em' }}
										>
											Official
										</span>
									</div>
								</div>

								<h2
									className="text-2xl md:text-3xl font-light text-gray-800"
									style={{
										fontFamily: 'Georgia, "Times New Roman", serif',
									}}
								>
									Congratulations!
								</h2>
								<p
									className="text-gray-600"
									style={{
										fontFamily: 'Georgia, "Times New Roman", serif',
									}}
								>
									You&rsquo;re married!
								</p>

								<p className="text-gray-300 text-xs pt-4">
									This certificate is not legally binding in any jurisdiction, dimension, or
									timeline. But it&rsquo;s still nice.
								</p>
							</div>
						)}
					</div>
				</div>
			</main>
		</>
	)
}
