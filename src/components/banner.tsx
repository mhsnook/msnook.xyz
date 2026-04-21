interface BannerProps {
	title: string
	description: string
	small?: boolean
	medium?: boolean
}

const stars = [
	{ top: '62%', left: '3%', size: 2, duration: '3.5s', delay: '0.4s' },
	{ top: '11%', left: '72%', size: 1, duration: '4.2s', delay: '0.1s' },
	{ top: '10%', left: '23%', size: 1, duration: '4.1s', delay: '2.1s' },
	{ top: '68%', left: '41%', size: 3, duration: '4.2s', delay: '2.4s' },
	{ top: '2%', left: '78%', size: 2.5, duration: '3.7s', delay: '0.5s' },
	{ top: '93%', left: '33%', size: 1, duration: '3.8s', delay: '1.1s' },
	{ top: '34%', left: '26%', size: 1, duration: '4.5s', delay: '1.6s' },
	{ top: '94%', left: '37%', size: 2, duration: '4.7s', delay: '1.9s' },
	{ top: '84%', left: '56%', size: 1, duration: '3.1s', delay: '0.7s' },
	{ top: '29%', left: '9%', size: 1.5, duration: '4.7s', delay: '1.1s' },
	{ top: '45%', left: '81%', size: 1.5, duration: '3.7s', delay: '0.6s' },
	{ top: '27%', left: '91%', size: 1, duration: '4.2s', delay: '0.5s' },
	{ top: '71%', left: '17%', size: 2.5, duration: '3.5s', delay: '2.8s' },
	{ top: '67%', left: '22%', size: 2, duration: '4.7s', delay: '2.3s' },
	{ top: '23%', left: '4%', size: 2, duration: '3.8s', delay: '0.2s' },
	{ top: '89%', left: '55%', size: 2, duration: '3.4s', delay: '1.5s' },
	{ top: '86%', left: '63%', size: 1.5, duration: '3.5s', delay: '0.7s' },
	{ top: '55%', left: '26%', size: 2.5, duration: '4.8s', delay: '1.2s' },
	{ top: '22%', left: '97%', size: 3, duration: '3.2s', delay: '0.1s' },
	{ top: '12%', left: '61%', size: 2.5, duration: '4.2s', delay: '1.2s' },
	{ top: '58%', left: '46%', size: 2, duration: '4.9s', delay: '2.6s' },
	{ top: '2%', left: '70%', size: 2, duration: '4.5s', delay: '1.0s' },
	{ top: '29%', left: '16%', size: 1, duration: '4.9s', delay: '2.6s' },
	{ top: '26%', left: '49%', size: 1.5, duration: '4.0s', delay: '0.3s' },
	{ top: '61%', left: '82%', size: 1.5, duration: '3.3s', delay: '2.3s' },
	{ top: '53%', left: '76%', size: 1, duration: '4.2s', delay: '1.5s' },
	{ top: '12%', left: '36%', size: 2, duration: '3.5s', delay: '0.7s' },
	{ top: '55%', left: '9%', size: 3, duration: '4.6s', delay: '2.9s' },
	{ top: '52%', left: '13%', size: 3, duration: '4.9s', delay: '0.5s' },
	{ top: '52%', left: '59%', size: 1.5, duration: '4.9s', delay: '2.3s' },
	{ top: '67%', left: '69%', size: 2.5, duration: '5.0s', delay: '1.9s' },
	{ top: '43%', left: '51%', size: 1, duration: '3.5s', delay: '0.2s' },
	{ top: '3%', left: '54%', size: 1.5, duration: '3.0s', delay: '2.1s' },
	{ top: '7%', left: '7%', size: 1, duration: '4.7s', delay: '0.2s' },
	{ top: '24%', left: '65%', size: 1.5, duration: '4.1s', delay: '2.2s' },
	{ top: '86%', left: '56%', size: 1.5, duration: '4.6s', delay: '2.4s' },
	{ top: '19%', left: '10%', size: 2.5, duration: '3.7s', delay: '1.2s' },
	{ top: '84%', left: '6%', size: 1, duration: '3.1s', delay: '2.2s' },
	{ top: '78%', left: '11%', size: 1.5, duration: '3.4s', delay: '1.3s' },
	{ top: '42%', left: '28%', size: 1.5, duration: '4.7s', delay: '0.2s' },
	{ top: '79%', left: '83%', size: 1, duration: '3.1s', delay: '3.0s' },
	{ top: '81%', left: '94%', size: 1.5, duration: '3.3s', delay: '1.5s' },
	{ top: '22%', left: '39%', size: 1, duration: '3.3s', delay: '0.0s' },
	{ top: '38%', left: '90%', size: 3, duration: '3.6s', delay: '2.1s' },
	{ top: '71%', left: '76%', size: 3, duration: '3.3s', delay: '0.9s' },
	{ top: '94%', left: '57%', size: 1, duration: '4.5s', delay: '0.2s' },
	{ top: '57%', left: '49%', size: 1.5, duration: '3.1s', delay: '1.5s' },
	{ top: '83%', left: '8%', size: 1, duration: '4.4s', delay: '0.7s' },
	{ top: '13%', left: '86%', size: 1.5, duration: '4.2s', delay: '0.1s' },
	{ top: '9%', left: '64%', size: 2, duration: '4.9s', delay: '0.6s' },
	{ top: '70%', left: '24%', size: 2.5, duration: '3.3s', delay: '1.9s' },
	{ top: '45%', left: '90%', size: 1, duration: '3.0s', delay: '1.9s' },
	{ top: '55%', left: '11%', size: 1.5, duration: '4.0s', delay: '0.4s' },
	{ top: '35%', left: '8%', size: 1.5, duration: '3.7s', delay: '0.5s' },
	{ top: '81%', left: '69%', size: 1, duration: '4.3s', delay: '1.7s' },
	{ top: '90%', left: '11%', size: 1.5, duration: '3.5s', delay: '2.7s' },
	{ top: '72%', left: '16%', size: 2, duration: '4.2s', delay: '2.2s' },
	{ top: '21%', left: '62%', size: 2, duration: '4.0s', delay: '0.8s' },
	{ top: '88%', left: '6%', size: 2.5, duration: '4.7s', delay: '0.1s' },
	{ top: '33%', left: '14%', size: 2, duration: '3.3s', delay: '1.3s' },
	{ top: '69%', left: '55%', size: 1, duration: '3.2s', delay: '2.6s' },
	{ top: '88%', left: '53%', size: 2, duration: '4.2s', delay: '0.4s' },
	{ top: '13%', left: '31%', size: 1, duration: '4.8s', delay: '0.6s' },
	{ top: '25%', left: '11%', size: 2.5, duration: '4.9s', delay: '2.2s' },
	{ top: '90%', left: '24%', size: 1.5, duration: '5.0s', delay: '2.4s' },
	{ top: '86%', left: '3%', size: 2, duration: '4.6s', delay: '1.2s' },
	{ top: '65%', left: '72%', size: 1.5, duration: '3.5s', delay: '2.4s' },
	{ top: '11%', left: '85%', size: 3, duration: '3.4s', delay: '2.4s' },
	{ top: '45%', left: '30%', size: 1.5, duration: '3.4s', delay: '2.0s' },
	{ top: '39%', left: '28%', size: 1, duration: '4.9s', delay: '0.8s' },
	{ top: '63%', left: '39%', size: 2, duration: '4.9s', delay: '0.3s' },
	{ top: '94%', left: '18%', size: 2, duration: '3.1s', delay: '1.8s' },
	{ top: '34%', left: '76%', size: 2.5, duration: '4.2s', delay: '1.5s' },
	{ top: '38%', left: '56%', size: 2, duration: '3.1s', delay: '1.3s' },
	{ top: '51%', left: '78%', size: 1.5, duration: '3.7s', delay: '0.2s' },
	{ top: '65%', left: '33%', size: 2, duration: '4.3s', delay: '0.4s' },
	{ top: '87%', left: '50%', size: 2.5, duration: '3.7s', delay: '2.1s' },
	{ top: '54%', left: '19%', size: 2.5, duration: '4.4s', delay: '2.7s' },
	{ top: '60%', left: '30%', size: 1, duration: '3.6s', delay: '0.6s' },
	{ top: '76%', left: '59%', size: 2, duration: '3.9s', delay: '1.3s' },
	{ top: '22%', left: '46%', size: 1.5, duration: '4.3s', delay: '0.9s' },
	{ top: '65%', left: '60%', size: 1, duration: '4.6s', delay: '2.3s' },
	{ top: '66%', left: '23%', size: 1.5, duration: '3.3s', delay: '0.1s' },
	{ top: '95%', left: '60%', size: 1, duration: '3.9s', delay: '2.7s' },
	{ top: '56%', left: '70%', size: 2.5, duration: '4.0s', delay: '0.7s' },
	{ top: '64%', left: '2%', size: 1, duration: '4.6s', delay: '0.7s' },
	{ top: '78%', left: '68%', size: 3, duration: '3.1s', delay: '0.7s' },
	{ top: '82%', left: '45%', size: 3, duration: '4.3s', delay: '3.0s' },
	{ top: '58%', left: '92%', size: 3, duration: '4.2s', delay: '2.2s' },
	{ top: '49%', left: '81%', size: 3, duration: '4.8s', delay: '2.2s' },
	{ top: '47%', left: '26%', size: 1.5, duration: '4.7s', delay: '0.8s' },
	{ top: '76%', left: '48%', size: 1.5, duration: '3.5s', delay: '0.2s' },
	{ top: '28%', left: '27%', size: 2, duration: '4.8s', delay: '0.2s' },
	{ top: '15%', left: '38%', size: 1.5, duration: '4.4s', delay: '0.2s' },
	{ top: '40%', left: '53%', size: 2.5, duration: '3.1s', delay: '2.5s' },
	{ top: '38%', left: '75%', size: 1, duration: '4.7s', delay: '2.3s' },
	{ top: '38%', left: '2%', size: 2, duration: '3.6s', delay: '1.2s' },
	{ top: '87%', left: '81%', size: 1.5, duration: '4.0s', delay: '0.8s' },
	{ top: '48%', left: '38%', size: 2.5, duration: '4.4s', delay: '2.5s' },
	{ top: '89%', left: '95%', size: 1, duration: '4.8s', delay: '1.8s' },
	{ top: '65%', left: '9%', size: 2.5, duration: '3.3s', delay: '1.4s' },
	{ top: '6%', left: '37%', size: 1.5, duration: '3.9s', delay: '1.0s' },
	{ top: '85%', left: '28%', size: 2.5, duration: '3.5s', delay: '0.2s' },
	{ top: '3%', left: '53%', size: 2, duration: '3.4s', delay: '0.2s' },
	{ top: '93%', left: '5%', size: 1, duration: '4.9s', delay: '0.6s' },
	{ top: '3%', left: '16%', size: 1.5, duration: '3.9s', delay: '0.3s' },
	{ top: '92%', left: '46%', size: 2, duration: '4.5s', delay: '0.5s' },
	{ top: '59%', left: '73%', size: 1, duration: '4.6s', delay: '0.5s' },
	{ top: '31%', left: '57%', size: 2, duration: '4.2s', delay: '2.7s' },
	{ top: '37%', left: '91%', size: 1.5, duration: '3.2s', delay: '2.1s' },
	{ top: '60%', left: '14%', size: 2, duration: '4.7s', delay: '1.8s' },
	{ top: '59%', left: '15%', size: 1.5, duration: '4.7s', delay: '1.8s' },
	{ top: '37%', left: '49%', size: 2, duration: '3.0s', delay: '1.3s' },
	{ top: '37%', left: '50%', size: 1.5, duration: '3.0s', delay: '1.2s' },
	{ top: '83%', left: '45%', size: 1.5, duration: '3.9s', delay: '2.2s' },
	{ top: '84%', left: '47%', size: 1.3, duration: '3.9s', delay: '2.5s' },
	{ top: '72%', left: '45%', size: 2.5, duration: '4.2s', delay: '1.0s' },
	{ top: '71%', left: '46%', size: 1.8, duration: '4.2s', delay: '1.0s' },
	{ top: '70%', left: '55%', size: 2.5, duration: '3.8s', delay: '0.1s' },
	{ top: '70%', left: '56%', size: 2.0, duration: '3.8s', delay: '0.0s' },
	{ top: '27%', left: '29%', size: 2.5, duration: '4.4s', delay: '0.8s' },
	{ top: '26%', left: '30%', size: 1.6, duration: '4.4s', delay: '0.9s' },
	{ top: '48%', left: '71%', size: 2.5, duration: '4.0s', delay: '2.1s' },
	{ top: '48%', left: '72%', size: 1.6, duration: '4.0s', delay: '1.9s' },
	{ top: '65%', left: '32%', size: 2.5, duration: '3.7s', delay: '1.7s' },
	{ top: '65%', left: '34%', size: 2.5, duration: '3.7s', delay: '1.7s' },
	{ top: '36%', left: '44%', size: 2, duration: '3.5s', delay: '0.4s' },
	{ top: '35%', left: '46%', size: 1.3, duration: '3.5s', delay: '0.4s' },
	{ top: '71%', left: '21%', size: 1.5, duration: '4.5s', delay: '0.8s' },
	{ top: '72%', left: '23%', size: 1.5, duration: '4.5s', delay: '1.0s' },
	{ top: '31%', left: '36%', size: 2, duration: '3.0s', delay: '1.6s' },
	{ top: '31%', left: '37%', size: 2.0, duration: '3.0s', delay: '1.6s' },
	{ top: '66%', left: '16%', size: 2, duration: '3.2s', delay: '0.0s' },
	{ top: '66%', left: '18%', size: 1.6, duration: '3.2s', delay: '-0.1s' },
]

export default function Banner({ title, description, small, medium }: BannerProps) {
	return (
		<header
			className={`bg-gray-900 w-full ${
				small ? 'min-h-[30vh]' : medium ? 'min-h-[45vh]' : 'h-[50vh]'
			} grid relative overflow-hidden`}
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
			<div className="z-10 w-full p-6 md:p-10 lg:px-16 place-self-center text-white flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
				{small ? null : (
					<div className="relative shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[440px] aspect-[1.775]">
						<img
							src="/images/my-face-288.png"
							alt="A cartoon face of the author, Michael"
							className="absolute object-cover rounded-2xl"
							width={120}
							height={120}
							style={{
								left: '47.3%',
								top: '11.3%',
								width: '27.3%',
								height: 'auto',
							}}
						/>
						<img src="/images/rocket.svg" alt="" className="absolute left-0 top-0 w-full h-full" />
					</div>
				)}
				<div>
					<h1 className="h1">{title}</h1>
					<p className="h1-sub">{description}</p>
				</div>
			</div>
		</header>
	)
}
