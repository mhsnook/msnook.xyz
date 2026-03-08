import { Calendar } from '@/components/icons'

export const JobHeader = ({ title, subtitle, timeframe }) => {
	return (
		<div className="my-1 text-lilac-content font-display">
			<h3 className="text-lg font-bold ">{title}</h3>
			<h3 className="text-lg">{subtitle}</h3>
			<PWithIcon>
				<Calendar color="text-lilac" />
				<span>{timeframe}</span>
			</PWithIcon>
		</div>
	)
}

const PWithIcon = ({ children }) => {
	return (
		<p className="text-sm flex flex-row place-items-center gap-2">{children}</p>
	)
}
