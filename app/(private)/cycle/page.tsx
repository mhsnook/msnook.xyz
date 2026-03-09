import dynamic from 'next/dynamic'

const CyclePageClient = dynamic(() => import('./cycle-page-client'), {
	ssr: false,
})

export default function CyclePage() {
	return <CyclePageClient />
}
