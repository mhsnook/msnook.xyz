// Types for the mortality schema
// These are manually defined since the schema is separate from the auto-generated public types

export type DataQuality = 'observed' | 'modeled' | 'estimated' | 'borrowed'

export type Cause = {
	id: number
	name: string
	slug: string
	gbd_level: number
	parent_id: number | null
	sort_order: number
	description: string | null
}

export type SuperRegion = {
	id: number
	name: string
	slug: string
	sort_order: number
}

export type Region = {
	id: number
	name: string
	slug: string
	super_region_id: number
	population: number | null
	population_year: number | null
	sort_order: number
}

export type Country = {
	id: number
	name: string
	iso3: string
	region_id: number
	population: number | null
	population_year: number | null
}

export type Rate = {
	id: number
	cause_id: number
	region_id: number | null
	country_id: number | null
	year: number
	age_standardized_rate: number | null
	crude_rate: number | null
	deaths_count: number | null
	data_quality: DataQuality
	source: string | null
	notes: string | null
}

export type Baseline = {
	id: number
	cause_id: number
	name: string
	reference_country_id: number | null
	reference_region_id: number | null
	rate: number
	year: number | null
	is_default: boolean
	notes: string | null
}

// View types
export type RateMatrixRow = {
	id: number
	cause_id: number
	cause_name: string
	cause_slug: string
	gbd_level: number
	cause_parent_id: number | null
	cause_parent_name: string | null
	region_id: number | null
	region_name: string | null
	region_slug: string | null
	super_region_id: number | null
	super_region_name: string | null
	super_region_slug: string | null
	country_id: number | null
	country_name: string | null
	iso3: string | null
	year: number
	age_standardized_rate: number | null
	crude_rate: number | null
	deaths_count: number | null
	population: number | null
	data_quality: DataQuality
	source: string | null
	notes: string | null
}

export type ExcessByRegionRow = {
	rate_id: number
	cause_id: number
	cause_name: string
	cause_slug: string
	gbd_level: number
	region_id: number
	region_name: string
	region_slug: string
	super_region_id: number
	super_region_name: string
	year: number
	actual_rate: number | null
	baseline_rate: number
	baseline_name: string
	excess_rate: number | null
	excess_pct: number | null
	population: number | null
	excess_deaths_est: number | null
	data_quality: DataQuality
}

// Client-side computed types
export type ViewMode = 'rates' | 'excess_rate' | 'excess_deaths'

export type MatrixCell = {
	causeId: number
	regionId: number
	rate: number | null
	baselineRate: number
	excessRate: number | null
	excessDeaths: number | null
	dataQuality: DataQuality
}
