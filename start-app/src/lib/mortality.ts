import { createClient } from './supabase-client'
import type { Cause, SuperRegion, Region, Rate, Baseline } from '~shared/types/mortality'

// Supabase's typed client narrows table names by schema, and the generated
// Database type doesn't include the `mortality` schema — so `.schema('mortality')`
// returns a builder where table names are typed `never`. Until we regenerate
// types with the mortality schema included, loosen this one call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mortality = () => (createClient() as any).schema('mortality')

export async function fetchCauses(level?: number): Promise<Cause[]> {
	let query = mortality().from('causes').select('*').order('sort_order')
	if (level) query = query.eq('gbd_level', level)
	const { data, error } = await query
	if (error) throw error
	return data as Cause[]
}

export async function fetchSuperRegions(): Promise<SuperRegion[]> {
	const { data, error } = await mortality().from('super_regions').select('*').order('sort_order')
	if (error) throw error
	return data as SuperRegion[]
}

export async function fetchRegions(): Promise<Region[]> {
	const { data, error } = await mortality().from('regions').select('*').order('sort_order')
	if (error) throw error
	return data as Region[]
}

export async function fetchRates(year?: number): Promise<Rate[]> {
	let query = mortality().from('rates').select('*')
	if (year) query = query.eq('year', year)
	const { data, error } = await query
	if (error) throw error
	return data as Rate[]
}

export async function fetchBaselines(defaultOnly = true): Promise<Baseline[]> {
	let query = mortality().from('baselines').select('*')
	if (defaultOnly) query = query.eq('is_default', true)
	const { data, error } = await query
	if (error) throw error
	return data as Baseline[]
}

export async function fetchMortalityData(year = 2019) {
	const [causes, superRegions, regions, rates, baselines] = await Promise.all([
		fetchCauses(),
		fetchSuperRegions(),
		fetchRegions(),
		fetchRates(year),
		fetchBaselines(true),
	])

	return { causes, superRegions, regions, rates, baselines }
}

export type MortalityData = Awaited<ReturnType<typeof fetchMortalityData>>
