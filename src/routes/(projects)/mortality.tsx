import { createFileRoute } from '@tanstack/react-router'
import MortalityExplorer from '@/components/mortality-explorer'
import { fetchMortalityData } from '@/lib/mortality'

export const Route = createFileRoute('/(projects)/mortality')({
	loader: () => fetchMortalityData(2019),
	// Matches the Next page's `export const revalidate = 3600`.
	staleTime: 3_600_000,
	head: () => ({
		meta: [
			{ title: 'Global Excess Mortality Explorer' },
			{
				name: 'description',
				content:
					'Interactive tool for exploring premature mortality data across GBD regions and causes',
			},
		],
	}),
	errorComponent: ({ error }) => <MortalityError error={error} />,
	component: MortalityPage,
})

function MortalityPage() {
	const data = Route.useLoaderData()

	return (
		<main className="container py-6">
			<div className="mb-6">
				<h1 className="h2">Global Excess Mortality Explorer</h1>
				<p className="text-gray-600 mt-2 max-w-prose">
					Approximate age-standardized death rates per 100,000 by GBD region and cause (2019). Rates
					are compared against a &ldquo;baseline&rdquo; — the best-performing region for each cause
					— to show excess preventable mortality.
				</p>
				<p className="text-sm text-gray-400 mt-1">
					Phase 0: All data is approximate, sourced from published GBD 2019 summaries. For
					exploration and prioritization only.
				</p>
			</div>

			<MortalityExplorer data={data} />
		</main>
	)
}

function MortalityError({ error }: { error: Error }) {
	return (
		<main className="container py-6">
			<div className="mb-6">
				<h1 className="h2">Global Excess Mortality Explorer</h1>
			</div>
			<div className="rounded border border-red-300 bg-red-50 p-4 text-red-800">
				<p className="font-bold">Error loading data</p>
				<p className="text-sm mt-1">
					{error instanceof Error ? error.message : 'Failed to load mortality data'}
				</p>
				<p className="text-sm mt-2 text-gray-600">
					The mortality schema may not be set up yet. Run the Supabase migration first:
				</p>
				<code className="block mt-1 text-xs bg-gray-100 p-2 rounded">supabase db push</code>
			</div>
		</main>
	)
}
