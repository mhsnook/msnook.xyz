'use client'

import { useState, useMemo } from 'react'
import type {
	Cause,
	SuperRegion,
	Region,
	Rate,
	Baseline,
	ViewMode,
} from '@/types/mortality'

type MortalityData = {
	causes: Cause[]
	superRegions: SuperRegion[]
	regions: Region[]
	rates: Rate[]
	baselines: Baseline[]
}

// Focused causes: the ones with enough regional variation and mortality to matter
const FOCUS_CAUSE_IDS = [
	101, 102, 103, 104, 106, 107, 201, 202, 203, 204, 208, 301, 302, 303,
]

function rateColor(
	value: number | null,
	baseline: number,
	columnMax: number,
	mode: ViewMode,
): string {
	if (value === null) return 'bg-gray-100'

	if (mode === 'rates') {
		// Green near baseline, yellow at midpoint, red at max
		const ratio = Math.min((value - baseline) / (columnMax - baseline), 1)
		if (ratio <= 0) return 'bg-emerald-100 text-emerald-900'
		if (ratio < 0.25) return 'bg-emerald-200 text-emerald-900'
		if (ratio < 0.5) return 'bg-yellow-100 text-yellow-900'
		if (ratio < 0.75) return 'bg-orange-200 text-orange-900'
		return 'bg-red-200 text-red-900'
	}

	if (mode === 'excess_rate') {
		const excess = value - baseline
		if (excess <= 0) return 'bg-emerald-100 text-emerald-900'
		const ratio = Math.min(excess / (columnMax - baseline), 1)
		if (ratio < 0.25) return 'bg-yellow-100 text-yellow-900'
		if (ratio < 0.5) return 'bg-orange-200 text-orange-900'
		return 'bg-red-200 text-red-900'
	}

	// excess_deaths mode
	if (value <= 0) return 'bg-emerald-100 text-emerald-900'
	if (value < 10000) return 'bg-yellow-100 text-yellow-900'
	if (value < 100000) return 'bg-orange-200 text-orange-900'
	return 'bg-red-200 text-red-900'
}

function formatNumber(n: number | null, mode: ViewMode): string {
	if (n === null) return '—'
	if (mode === 'excess_deaths') {
		if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
		if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(0)}K`
		return n.toFixed(0)
	}
	if (n >= 100) return n.toFixed(0)
	if (n >= 10) return n.toFixed(1)
	if (n >= 1) return n.toFixed(1)
	return n.toFixed(2)
}

function shortCauseName(name: string): string {
	const map: Record<string, string> = {
		'HIV/AIDS and sexually transmitted infections': 'HIV/STIs',
		'Respiratory infections and tuberculosis': 'Resp/TB',
		'Enteric infections': 'Enteric',
		'Neglected tropical diseases and malaria': 'NTDs/Malaria',
		'Other infectious diseases': 'Other Inf.',
		'Maternal and neonatal disorders': 'Mat./Neonatal',
		'Nutritional deficiencies': 'Nutrition',
		Neoplasms: 'Cancer',
		'Cardiovascular diseases': 'CVD',
		'Chronic respiratory diseases': 'Chronic Resp.',
		'Digestive diseases': 'Digestive',
		'Neurological disorders': 'Neuro',
		'Mental disorders': 'Mental',
		'Substance use disorders': 'Substance',
		'Diabetes and kidney diseases': 'Diabetes/CKD',
		'Transport injuries': 'Transport',
		'Unintentional injuries': 'Accidents',
		'Self-harm and interpersonal violence': 'Violence/SH',
		'Skin and subcutaneous diseases': 'Skin',
		'Sense organ diseases': 'Sense Organ',
		'Musculoskeletal disorders': 'MSK',
		'Other non-communicable diseases': 'Other NCD',
	}
	return map[name] || name
}

type SortConfig = {
	key: 'region' | number // 'region' for region name, or cause_id for a column
	direction: 'asc' | 'desc'
}

export default function MortalityExplorer({ data }: { data: MortalityData }) {
	const { causes, superRegions, regions, rates, baselines } = data

	const [viewMode, setViewMode] = useState<ViewMode>('rates')
	const [showAllCauses, setShowAllCauses] = useState(false)
	const [sort, setSort] = useState<SortConfig>({
		key: 'region',
		direction: 'asc',
	})
	const [collapsedSuperRegions, setCollapsedSuperRegions] = useState<
		Set<number>
	>(new Set())

	// Build a lookup: { `${causeId}-${regionId}` => Rate }
	const rateMap = useMemo(() => {
		const m = new Map<string, Rate>()
		for (const r of rates) {
			if (r.region_id && !r.country_id) {
				m.set(`${r.cause_id}-${r.region_id}`, r)
			}
		}
		return m
	}, [rates])

	// Build baseline lookup: { causeId => Baseline }
	const baselineMap = useMemo(() => {
		const m = new Map<number, Baseline>()
		for (const b of baselines) {
			if (b.is_default) m.set(b.cause_id, b)
		}
		return m
	}, [baselines])

	// Filter causes based on toggle
	const visibleCauses = useMemo(() => {
		const level2 = causes
			.filter((c) => c.gbd_level === 2)
			.sort((a, b) => {
				// Sort by parent, then sort_order
				const pa = a.parent_id ?? 0
				const pb = b.parent_id ?? 0
				if (pa !== pb) return pa - pb
				return a.sort_order - b.sort_order
			})
		if (showAllCauses) return level2
		return level2.filter((c) => FOCUS_CAUSE_IDS.includes(c.id))
	}, [causes, showAllCauses])

	// Compute column max rates for color scaling
	const columnMaxes = useMemo(() => {
		const maxes = new Map<number, number>()
		for (const cause of visibleCauses) {
			let max = 0
			for (const region of regions) {
				const rate = rateMap.get(`${cause.id}-${region.id}`)
				if (rate?.age_standardized_rate) {
					max = Math.max(max, rate.age_standardized_rate)
				}
			}
			maxes.set(cause.id, max)
		}
		return maxes
	}, [visibleCauses, regions, rateMap])

	// Group regions by super-region
	const regionsBySuperRegion = useMemo(() => {
		const m = new Map<number, Region[]>()
		for (const sr of superRegions) {
			m.set(
				sr.id,
				regions
					.filter((r) => r.super_region_id === sr.id)
					.sort((a, b) => a.sort_order - b.sort_order),
			)
		}
		return m
	}, [superRegions, regions])

	// Compute cell values
	function getCellValue(causeId: number, regionId: number): number | null {
		const rate = rateMap.get(`${causeId}-${regionId}`)
		const baseline = baselineMap.get(causeId)
		if (!rate?.age_standardized_rate) return null

		if (viewMode === 'rates') return rate.age_standardized_rate

		if (viewMode === 'excess_rate') {
			return baseline ? rate.age_standardized_rate - baseline.rate : null
		}

		// excess_deaths
		const region = regions.find((r) => r.id === regionId)
		if (!baseline || !region?.population) return null
		return (
			((rate.age_standardized_rate - baseline.rate) * region.population) /
			100000
		)
	}

	// Sort regions
	const sortedSuperRegions = useMemo(() => {
		if (sort.key === 'region') {
			return [...superRegions].sort((a, b) =>
				sort.direction === 'asc'
					? a.sort_order - b.sort_order
					: b.sort_order - a.sort_order,
			)
		}
		return superRegions
	}, [superRegions, sort])

	function toggleSuperRegion(id: number) {
		setCollapsedSuperRegions((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	function handleSort(key: 'region' | number) {
		setSort((prev) => ({
			key,
			direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
		}))
	}

	// Compute total excess deaths per cause (for summary)
	const totalExcessByCause = useMemo(() => {
		const totals = new Map<number, number>()
		for (const cause of visibleCauses) {
			let total = 0
			const baseline = baselineMap.get(cause.id)
			if (!baseline) continue
			for (const region of regions) {
				const rate = rateMap.get(`${cause.id}-${region.id}`)
				if (rate?.age_standardized_rate && region.population) {
					const excess =
						((rate.age_standardized_rate - baseline.rate) * region.population) /
						100000
					if (excess > 0) total += excess
				}
			}
			totals.set(cause.id, total)
		}
		return totals
	}, [visibleCauses, regions, rateMap, baselineMap])

	// Compute total excess deaths per region (for summary)
	const totalExcessByRegion = useMemo(() => {
		const totals = new Map<number, number>()
		for (const region of regions) {
			let total = 0
			for (const cause of visibleCauses) {
				const baseline = baselineMap.get(cause.id)
				if (!baseline) continue
				const rate = rateMap.get(`${cause.id}-${region.id}`)
				if (rate?.age_standardized_rate && region.population) {
					const excess =
						((rate.age_standardized_rate - baseline.rate) * region.population) /
						100000
					if (excess > 0) total += excess
				}
			}
			totals.set(region.id, total)
		}
		return totals
	}, [visibleCauses, regions, rateMap, baselineMap])

	// Grand total
	const grandTotalExcess = useMemo(() => {
		let total = 0
		for (const [, v] of totalExcessByRegion) total += v
		return total
	}, [totalExcessByRegion])

	// Level 1 cause groups for column headers
	const level1Causes = causes
		.filter((c) => c.gbd_level === 1)
		.sort((a, b) => a.sort_order - b.sort_order)

	function causeCountInGroup(parentId: number): number {
		return visibleCauses.filter((c) => c.parent_id === parentId).length
	}

	return (
		<div>
			{/* Controls */}
			<div className="flex flex-wrap gap-4 items-center mb-4">
				<div className="flex gap-1 rounded border p-0.5">
					{(
						[
							['rates', 'Rates'],
							['excess_rate', 'Excess Rate'],
							['excess_deaths', 'Excess Deaths'],
						] as [ViewMode, string][]
					).map(([mode, label]) => (
						<button
							key={mode}
							onClick={() => setViewMode(mode)}
							className={`px-3 py-1 rounded text-sm transition-colors ${
								viewMode === mode ? 'bg-cyan text-white' : 'hover:bg-gray-100'
							}`}
						>
							{label}
						</button>
					))}
				</div>

				<label className="flex items-center gap-2 text-sm text-gray-600">
					<input
						type="checkbox"
						checked={showAllCauses}
						onChange={(e) => setShowAllCauses(e.target.checked)}
						className="rounded"
					/>
					Show low-mortality causes
				</label>

				<span className="text-sm text-gray-400 ml-auto">
					{viewMode === 'rates'
						? 'Age-standardized rate per 100K'
						: viewMode === 'excess_rate'
							? 'Excess over baseline per 100K'
							: 'Estimated excess deaths'}
				</span>
			</div>

			{/* Summary bar */}
			<div className="mb-4 p-3 bg-gray-50 rounded border text-sm">
				<span className="font-bold">
					Estimated global excess deaths (vs. best-region baselines):{' '}
				</span>
				<span className="text-red-700 font-bold">
					{(grandTotalExcess / 1_000_000).toFixed(1)}M
				</span>
				<span className="text-gray-500 ml-2">
					across {visibleCauses.length} causes and {regions.length} regions
				</span>
			</div>

			{/* Matrix table */}
			<div className="overflow-x-auto border rounded">
				<table className="w-full text-xs border-collapse">
					<thead>
						{/* Level 1 grouping row */}
						<tr className="bg-gray-50">
							<th
								className="sticky left-0 z-10 bg-gray-50 border-b border-r px-2 py-1"
								rowSpan={2}
							>
								<button
									onClick={() => handleSort('region')}
									className="font-bold hover:text-cyan-bright"
								>
									Region
									{sort.key === 'region'
										? sort.direction === 'asc'
											? ' ↑'
											: ' ↓'
										: ''}
								</button>
							</th>
							{level1Causes.map((l1) => {
								const count = causeCountInGroup(l1.id)
								if (count === 0) return null
								return (
									<th
										key={l1.id}
										colSpan={count}
										className="border-b border-r px-2 py-1 text-center font-bold text-gray-500"
									>
										{l1.id === 100
											? 'CMNN'
											: l1.id === 200
												? 'NCD'
												: 'Injuries'}
									</th>
								)
							})}
							<th
								className="border-b border-r px-2 py-1 font-bold text-gray-500"
								rowSpan={2}
							>
								Total
							</th>
						</tr>
						{/* Level 2 cause names */}
						<tr className="bg-gray-50">
							{visibleCauses.map((cause) => (
								<th
									key={cause.id}
									className="border-b border-r px-1 py-1 font-medium text-gray-700 min-w-[60px] max-w-[80px]"
								>
									<button
										onClick={() => handleSort(cause.id)}
										className="hover:text-cyan-bright whitespace-nowrap overflow-hidden text-ellipsis block w-full text-left"
										title={cause.name}
									>
										{shortCauseName(cause.name)}
										{sort.key === cause.id
											? sort.direction === 'asc'
												? ' ↑'
												: ' ↓'
											: ''}
									</button>
								</th>
							))}
						</tr>
						{/* Baseline row */}
						<tr className="bg-emerald-50">
							<td className="sticky left-0 z-10 bg-emerald-50 border-b border-r px-2 py-1 font-medium text-emerald-700 text-xs">
								Baseline
							</td>
							{visibleCauses.map((cause) => {
								const b = baselineMap.get(cause.id)
								return (
									<td
										key={cause.id}
										className="border-b border-r px-1 py-1 text-center text-emerald-700"
										title={b?.name}
									>
										{b ? formatNumber(b.rate, 'rates') : '—'}
									</td>
								)
							})}
							<td className="border-b border-r px-1 py-1 text-center text-emerald-700">
								—
							</td>
						</tr>
					</thead>
					<tbody>
						{sortedSuperRegions.map((sr) => {
							const srRegions = regionsBySuperRegion.get(sr.id) || []
							const isCollapsed = collapsedSuperRegions.has(sr.id)

							// Compute super-region aggregate row
							const srTotalExcess = srRegions.reduce(
								(sum, r) => sum + (totalExcessByRegion.get(r.id) || 0),
								0,
							)

							return (
								<>
									{/* Super-region header row */}
									<tr
										key={`sr-${sr.id}`}
										className="bg-gray-100 cursor-pointer hover:bg-gray-200"
										onClick={() => toggleSuperRegion(sr.id)}
									>
										<td className="sticky left-0 z-10 bg-gray-100 border-b border-r px-2 py-1.5 font-bold text-gray-700">
											<span className="mr-1 text-gray-400 inline-block w-3">
												{isCollapsed ? '▸' : '▾'}
											</span>
											{sr.name}
										</td>
										{visibleCauses.map((cause) => {
											// Super-region average (population-weighted would be better, but simple avg for now)
											const vals = srRegions
												.map((r) => getCellValue(cause.id, r.id))
												.filter((v) => v !== null) as number[]
											const avg =
												vals.length > 0
													? vals.reduce((a, b) => a + b, 0) / vals.length
													: null
											const baseline = baselineMap.get(cause.id)
											const colMax = columnMaxes.get(cause.id) || 1

											return (
												<td
													key={cause.id}
													className={`border-b border-r px-1 py-1 text-center font-medium ${
														avg !== null
															? rateColor(
																	viewMode === 'rates'
																		? avg + (baseline?.rate ?? 0)
																		: avg,
																	baseline?.rate ?? 0,
																	colMax,
																	viewMode,
																)
															: 'bg-gray-100'
													}`}
												>
													{avg !== null ? formatNumber(avg, viewMode) : '—'}
												</td>
											)
										})}
										<td className="border-b border-r px-1 py-1 text-center font-bold text-gray-700">
											{formatNumber(srTotalExcess, 'excess_deaths')}
										</td>
									</tr>
									{/* Region rows (collapsible) */}
									{!isCollapsed &&
										srRegions.map((region) => (
											<tr
												key={`r-${region.id}`}
												className="hover:bg-blue-50/50"
											>
												<td className="sticky left-0 z-10 bg-white border-b border-r px-2 py-1 pl-6 text-gray-600">
													{region.name}
												</td>
												{visibleCauses.map((cause) => {
													const value = getCellValue(cause.id, region.id)
													const baseline = baselineMap.get(cause.id)
													const rawRate =
														rateMap.get(`${cause.id}-${region.id}`)
															?.age_standardized_rate ?? null
													const colMax = columnMaxes.get(cause.id) || 1

													return (
														<td
															key={cause.id}
															className={`border-b border-r px-1 py-1 text-center ${rateColor(rawRate, baseline?.rate ?? 0, colMax, viewMode)}`}
															title={`${cause.name}: ${rawRate ?? '?'}/100K (baseline: ${baseline?.rate ?? '?'})`}
														>
															{formatNumber(value, viewMode)}
														</td>
													)
												})}
												<td className="border-b border-r px-1 py-1 text-center font-medium">
													{formatNumber(
														totalExcessByRegion.get(region.id) ?? null,
														'excess_deaths',
													)}
												</td>
											</tr>
										))}
								</>
							)
						})}
					</tbody>
					<tfoot>
						{/* Total excess deaths by cause */}
						<tr className="bg-gray-50 font-bold">
							<td className="sticky left-0 z-10 bg-gray-50 border-t-2 border-r px-2 py-1.5">
								Total Excess Deaths
							</td>
							{visibleCauses.map((cause) => (
								<td
									key={cause.id}
									className="border-t-2 border-r px-1 py-1 text-center"
								>
									{formatNumber(
										totalExcessByCause.get(cause.id) ?? null,
										'excess_deaths',
									)}
								</td>
							))}
							<td className="border-t-2 border-r px-1 py-1 text-center text-red-700">
								{formatNumber(grandTotalExcess, 'excess_deaths')}
							</td>
						</tr>
					</tfoot>
				</table>
			</div>

			{/* Legend and notes */}
			<div className="mt-4 grid gap-4 md:grid-cols-2">
				<div className="text-xs text-gray-500">
					<p className="font-bold text-gray-700 mb-1">
						Color scale (per column)
					</p>
					<div className="flex gap-2 items-center">
						<span className="inline-block w-4 h-4 rounded bg-emerald-100 border" />
						<span>At or below baseline</span>
						<span className="inline-block w-4 h-4 rounded bg-yellow-100 border" />
						<span>Moderate excess</span>
						<span className="inline-block w-4 h-4 rounded bg-orange-200 border" />
						<span>High excess</span>
						<span className="inline-block w-4 h-4 rounded bg-red-200 border" />
						<span>Very high excess</span>
					</div>
				</div>
				<div className="text-xs text-gray-500">
					<p className="font-bold text-gray-700 mb-1">About baselines</p>
					<p>
						Each cause uses the lowest-rate large GBD region as its baseline.
						Excess = actual rate minus baseline rate. &ldquo;Excess
						deaths&rdquo; multiplies the excess rate by the region&rsquo;s
						population.
					</p>
				</div>
			</div>

			{/* Top causes table */}
			<div className="mt-6">
				<h2 className="h4 mb-2">
					Largest causes of excess mortality (estimated)
				</h2>
				<div className="grid gap-2 md:grid-cols-2">
					{[...totalExcessByCause.entries()]
						.sort((a, b) => b[1] - a[1])
						.slice(0, 10)
						.map(([causeId, total], i) => {
							const cause = causes.find((c) => c.id === causeId)
							return (
								<div key={causeId} className="flex items-center gap-2 text-sm">
									<span className="text-gray-400 w-5 text-right">{i + 1}.</span>
									<span className="font-medium flex-1">
										{cause?.name ?? '?'}
									</span>
									<span className="text-red-700 font-bold">
										{(total / 1_000_000).toFixed(1)}M
									</span>
								</div>
							)
						})}
				</div>
			</div>
		</div>
	)
}
