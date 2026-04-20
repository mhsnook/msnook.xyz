-- Mortality data schema for tracking global premature mortality
-- Phase 0: Approximate data based on GBD 2019 estimates
-- Structured around the GBD cause hierarchy and regional framework
create schema IF not exists mortality;

-- Grant schema usage to Supabase roles
grant USAGE on SCHEMA mortality to anon,
authenticated,
service_role;

-- =============================================================================
-- TABLES
-- =============================================================================
-- GBD cause hierarchy (Levels 1-4, mutually exclusive, collectively exhaustive)
create table mortality.causes (
	id integer primary key,
	name text not null,
	slug text not null unique,
	gbd_level smallint not null check (gbd_level between 1 and 4),
	parent_id integer references mortality.causes (id),
	sort_order integer not null default 0,
	description text
);

-- GBD super-regions (7 groupings)
create table mortality.super_regions (
	id integer primary key,
	name text not null,
	slug text not null unique,
	sort_order integer not null default 0
);

-- GBD regions (21 regions nested within super-regions)
create table mortality.regions (
	id integer primary key,
	name text not null,
	slug text not null unique,
	super_region_id integer not null references mortality.super_regions (id),
	population bigint,
	population_year smallint,
	sort_order integer not null default 0
);

-- Countries (for baseline references and granular data)
create table mortality.countries (
	id integer primary key,
	name text not null,
	iso3 char(3) unique,
	region_id integer not null references mortality.regions (id),
	population bigint,
	population_year smallint
);

-- Core data table: age-standardized mortality rates
create table mortality.rates (
	id serial primary key,
	cause_id integer not null references mortality.causes (id),
	region_id integer references mortality.regions (id),
	country_id integer references mortality.countries (id),
	year smallint not null,
	age_standardized_rate numeric, -- per 100,000 population
	crude_rate numeric, -- per 100,000 population
	deaths_count numeric, -- absolute number of deaths
	data_quality text not null default 'estimated' check (
		data_quality in ('observed', 'modeled', 'estimated', 'borrowed')
	),
	source text,
	notes text,
	check (
		region_id is not null
		or country_id is not null
	),
	unique (cause_id, region_id, country_id, year)
);

-- Baseline definitions: reference rates for computing "excess" mortality
create table mortality.baselines (
	id serial primary key,
	cause_id integer not null references mortality.causes (id),
	name text not null,
	reference_country_id integer references mortality.countries (id),
	reference_region_id integer references mortality.regions (id),
	rate numeric not null, -- per 100,000
	year smallint,
	is_default boolean default false,
	notes text
);

-- =============================================================================
-- INDEXES
-- =============================================================================
create index idx_rates_cause on mortality.rates (cause_id);

create index idx_rates_region on mortality.rates (region_id);

create index idx_rates_country on mortality.rates (country_id);

create index idx_rates_year on mortality.rates (year);

create index idx_rates_cause_region_year on mortality.rates (cause_id, region_id, year);

create index idx_baselines_cause on mortality.baselines (cause_id);

create index idx_baselines_default on mortality.baselines (cause_id)
where
	is_default = true;

create index idx_causes_level on mortality.causes (gbd_level);

create index idx_causes_parent on mortality.causes (parent_id);

-- =============================================================================
-- VIEWS
-- =============================================================================
-- Denormalized view for easy querying of the full rate matrix
create view mortality.rate_matrix as
select
	r.id,
	c.id as cause_id,
	c.name as cause_name,
	c.slug as cause_slug,
	c.gbd_level,
	pc.id as cause_parent_id,
	pc.name as cause_parent_name,
	reg.id as region_id,
	reg.name as region_name,
	reg.slug as region_slug,
	sr.id as super_region_id,
	sr.name as super_region_name,
	sr.slug as super_region_slug,
	ctry.id as country_id,
	ctry.name as country_name,
	ctry.iso3,
	r.year,
	r.age_standardized_rate,
	r.crude_rate,
	r.deaths_count,
	coalesce(ctry.population, reg.population) as population,
	r.data_quality,
	r.source,
	r.notes
from
	mortality.rates r
	join mortality.causes c on c.id = r.cause_id
	left join mortality.causes pc on pc.id = c.parent_id
	left join mortality.regions reg on reg.id = r.region_id
	left join mortality.super_regions sr on sr.id = reg.super_region_id
	left join mortality.countries ctry on ctry.id = r.country_id;

-- Excess mortality view: compares region rates to default baselines
create view mortality.excess_by_region as
select
	r.id as rate_id,
	c.id as cause_id,
	c.name as cause_name,
	c.slug as cause_slug,
	c.gbd_level,
	reg.id as region_id,
	reg.name as region_name,
	reg.slug as region_slug,
	sr.id as super_region_id,
	sr.name as super_region_name,
	r.year,
	r.age_standardized_rate as actual_rate,
	b.rate as baseline_rate,
	b.name as baseline_name,
	(r.age_standardized_rate - b.rate) as excess_rate,
	case
		when b.rate > 0 then round(
			((r.age_standardized_rate - b.rate) / b.rate * 100)::numeric,
			1
		)
		else null
	end as excess_pct,
	reg.population,
	case
		when reg.population is not null
		and r.age_standardized_rate is not null then round(
			(
				(r.age_standardized_rate - b.rate) * reg.population / 100000
			)::numeric,
			0
		)
		else null
	end as excess_deaths_est,
	r.data_quality
from
	mortality.rates r
	join mortality.causes c on c.id = r.cause_id
	join mortality.regions reg on reg.id = r.region_id
	join mortality.super_regions sr on sr.id = reg.super_region_id
	join mortality.baselines b on b.cause_id = r.cause_id
	and b.is_default = true
where
	r.country_id is null;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================
alter table mortality.causes ENABLE row LEVEL SECURITY;

alter table mortality.super_regions ENABLE row LEVEL SECURITY;

alter table mortality.regions ENABLE row LEVEL SECURITY;

alter table mortality.countries ENABLE row LEVEL SECURITY;

alter table mortality.rates ENABLE row LEVEL SECURITY;

alter table mortality.baselines ENABLE row LEVEL SECURITY;

-- Public read access for all tables
create policy "Public read access" on mortality.causes for
select
	using (true);

create policy "Public read access" on mortality.super_regions for
select
	using (true);

create policy "Public read access" on mortality.regions for
select
	using (true);

create policy "Public read access" on mortality.countries for
select
	using (true);

create policy "Public read access" on mortality.rates for
select
	using (true);

create policy "Public read access" on mortality.baselines for
select
	using (true);

-- Authenticated users can manage data
create policy "Authenticated write" on mortality.causes for all to authenticated using (true)
with
	check (true);

create policy "Authenticated write" on mortality.super_regions for all to authenticated using (true)
with
	check (true);

create policy "Authenticated write" on mortality.regions for all to authenticated using (true)
with
	check (true);

create policy "Authenticated write" on mortality.countries for all to authenticated using (true)
with
	check (true);

create policy "Authenticated write" on mortality.rates for all to authenticated using (true)
with
	check (true);

create policy "Authenticated write" on mortality.baselines for all to authenticated using (true)
with
	check (true);

-- =============================================================================
-- GRANTS
-- =============================================================================
grant
select
	on all TABLES in SCHEMA mortality to anon;

grant all on all TABLES in SCHEMA mortality to authenticated;

grant all on all TABLES in SCHEMA mortality to service_role;

grant USAGE,
select
	on all SEQUENCES in SCHEMA mortality to anon,
	authenticated,
	service_role;
