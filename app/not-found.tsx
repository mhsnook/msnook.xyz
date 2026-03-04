import { Footer } from './(public)/layout'

const title = '404 - not found'
const description = 'We absolutely 100% cannot find the thing'

// Hardcoded stars with varied positions, sizes, and animation timing
const stars = [
	{ top: '8%', left: '12%', size: 2, duration: '3s', delay: '0s' },
	{ top: '15%', left: '67%', size: 3, duration: '4s', delay: '1.2s' },
	{ top: '5%', left: '85%', size: 1.5, duration: '3.5s', delay: '0.5s' },
	{ top: '22%', left: '34%', size: 2.5, duration: '5s', delay: '2s' },
	{ top: '35%', left: '8%', size: 1, duration: '3s', delay: '0.8s' },
	{ top: '12%', left: '45%', size: 2, duration: '4.5s', delay: '1.5s' },
	{ top: '40%', left: '78%', size: 3, duration: '3.8s', delay: '0.3s' },
	{ top: '28%', left: '92%', size: 1.5, duration: '4.2s', delay: '2.5s' },
	{ top: '55%', left: '20%', size: 2, duration: '3.2s', delay: '1s' },
	{ top: '18%', left: '55%', size: 1, duration: '5s', delay: '0.7s' },
	{ top: '70%', left: '42%', size: 2.5, duration: '3.6s', delay: '1.8s' },
	{ top: '48%', left: '60%', size: 1.5, duration: '4s', delay: '0.2s' },
	{ top: '65%', left: '15%', size: 2, duration: '4.8s', delay: '2.2s' },
	{ top: '80%', left: '72%', size: 3, duration: '3.4s', delay: '0.6s' },
	{ top: '32%', left: '50%', size: 1, duration: '5s', delay: '1.3s' },
	{ top: '75%', left: '88%', size: 2, duration: '3.7s', delay: '2.8s' },
	{ top: '10%', left: '28%', size: 1.5, duration: '4.3s', delay: '0.9s' },
	{ top: '58%', left: '95%', size: 2.5, duration: '3.1s', delay: '1.6s' },
	{ top: '42%', left: '5%', size: 1, duration: '4.6s', delay: '2.1s' },
	{ top: '88%', left: '35%', size: 2, duration: '3.9s', delay: '0.4s' },
	{ top: '25%', left: '73%', size: 1.5, duration: '4.1s', delay: '1.9s' },
	{ top: '50%', left: '38%', size: 3, duration: '3.3s', delay: '2.6s' },
	{ top: '62%', left: '82%', size: 1, duration: '4.7s', delay: '0.1s' },
	{ top: '85%', left: '52%', size: 2.5, duration: '3.5s', delay: '1.4s' },
	{ top: '38%', left: '25%', size: 2, duration: '4.4s', delay: '2.3s' },
	{ top: '72%', left: '62%', size: 1.5, duration: '3s', delay: '0.8s' },
	{ top: '3%', left: '40%', size: 1, duration: '5s', delay: '1.7s' },
	{ top: '92%', left: '18%', size: 2, duration: '3.8s', delay: '2.9s' },
	{ top: '45%', left: '48%', size: 2.5, duration: '4.2s', delay: '0.5s' },
	{ top: '78%', left: '7%', size: 1.5, duration: '3.6s', delay: '1.1s' },
]

export default function NotFound() {
	return (
		<>
			<header
				className="bg-gray-900 w-full min-h-[45vh] grid relative overflow-hidden"
				style={{ textShadow: '2px 2px 6px black' }}
			>
				{stars.map((s, i) => (
					<span
						key={i}
						className="star"
						style={{
							top: s.top,
							left: s.left,
							width: s.size,
							height: s.size,
							animationDuration: s.duration,
							animationDelay: s.delay,
						}}
					/>
				))}
				<div className="z-10 container p-10 align-middle place-self-center text-white">
					<h1 className="h1">{title}</h1>
					<p className="h1-sub">{description}</p>
				</div>
			</header>
			<main className="container py-8 space-y-4">
				<h1 className="h2">{title}</h1>
				<p>
					We&apos;re very sorry about this, but then again, this website is free
					so 🤷 try not to make a big deal about it.
				</p>
				<p>
					If you think you are receiving this message in error, please take a
					moment to consider that maybe the most painful errors are the ones we
					do to ourselves.
				</p>
			</main>
			<Footer />
		</>
	)
}
