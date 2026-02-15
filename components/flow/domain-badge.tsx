import type { LifeDomain } from '@/types/flow'

const DOMAIN_COLORS: Record<string, string> = {
	'Work/Creative': 'bg-blue-100 text-blue-700',
	Health: 'bg-green-100 text-green-700',
	Social: 'bg-purple-100 text-purple-700',
	Chores: 'bg-amber-100 text-amber-700',
	'Play/Rest': 'bg-pink-100 text-pink-700',
}

export default function DomainBadge({ domain }: { domain: LifeDomain }) {
	const colors = DOMAIN_COLORS[domain.name] || 'bg-gray-100 text-gray-700'
	return (
		<span
			className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${colors}`}
		>
			{domain.icon && <span>{domain.icon}</span>}
			{domain.name}
		</span>
	)
}
