import type { Metadata } from 'next'
import { fetchMortalityData } from '@/lib/mortality'
import MortalityExplorer from './mortality-explorer'

export const revalidate = 3600

export const metadata: Metadata = {
	title: 'Global Excess Mortality Explorer',
	description:
		'Interactive tool for exploring premature mortality data across GBD regions and causes',
}

export default async function MortalityPage() {
	let data = null
	let error = null

	try {
		data = await fetchMortalityData(2019)
	} catch (e) {
		const msg =
			e instanceof Error
				? e.message
				: typeof e === 'object' && e !== null && 'message' in e
					? String((e as { message: unknown }).message)
					: 'Unknown error'
		error = msg
	}

	return (
		<main className="py-6">
			<div className="mb-6 max-w-prose mx-auto px-4">
				<h1 className="h2">Global Excess Mortality Explorer</h1>
				<p className="text-gray-600 mt-2">
					Approximate age-standardized death rates per 100,000 by GBD region and
					cause (2019). Rates are compared against a &ldquo;baseline&rdquo; —
					the best-performing region for each cause — to show excess preventable
					mortality.
				</p>
				<p className="text-sm text-gray-400 mt-1">
					Phase 0: All data is approximate, sourced from published GBD 2019
					summaries. For exploration and prioritization only.
				</p>
			</div>

			{error ? (
				<div className="max-w-prose mx-auto px-4">
					<div className="rounded border border-red-300 bg-red-50 p-4 text-red-800">
						<p className="font-bold">Error loading data</p>
						<p className="text-sm mt-1">{error}</p>
						<p className="text-sm mt-2 text-gray-600">
							Make sure the <code>mortality</code> schema is added to the
							exposed schemas in your Supabase project&rsquo;s API settings
							(Project Settings &rarr; API &rarr; Exposed schemas).
						</p>
					</div>
				</div>
			) : data ? (
				<div className="px-4">
					<MortalityExplorer data={data} />
				</div>
			) : null}
		</main>
	)
}
