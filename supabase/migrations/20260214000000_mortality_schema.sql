-- Mortality data schema for tracking global premature mortality
-- Phase 0: Approximate data based on GBD 2019 estimates
-- Structured around the GBD cause hierarchy and regional framework

CREATE SCHEMA IF NOT EXISTS mortality;

-- Grant schema usage to Supabase roles
GRANT USAGE ON SCHEMA mortality TO anon, authenticated, service_role;

-- =============================================================================
-- TABLES
-- =============================================================================

-- GBD cause hierarchy (Levels 1-4, mutually exclusive, collectively exhaustive)
CREATE TABLE mortality.causes (
  id integer PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  gbd_level smallint NOT NULL CHECK (gbd_level BETWEEN 1 AND 4),
  parent_id integer REFERENCES mortality.causes(id),
  sort_order integer NOT NULL DEFAULT 0,
  description text
);

-- GBD super-regions (7 groupings)
CREATE TABLE mortality.super_regions (
  id integer PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0
);

-- GBD regions (21 regions nested within super-regions)
CREATE TABLE mortality.regions (
  id integer PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  super_region_id integer NOT NULL REFERENCES mortality.super_regions(id),
  population bigint,
  population_year smallint,
  sort_order integer NOT NULL DEFAULT 0
);

-- Countries (for baseline references and granular data)
CREATE TABLE mortality.countries (
  id integer PRIMARY KEY,
  name text NOT NULL,
  iso3 char(3) UNIQUE,
  region_id integer NOT NULL REFERENCES mortality.regions(id),
  population bigint,
  population_year smallint
);

-- Core data table: age-standardized mortality rates
CREATE TABLE mortality.rates (
  id serial PRIMARY KEY,
  cause_id integer NOT NULL REFERENCES mortality.causes(id),
  region_id integer REFERENCES mortality.regions(id),
  country_id integer REFERENCES mortality.countries(id),
  year smallint NOT NULL,
  age_standardized_rate numeric,  -- per 100,000 population
  crude_rate numeric,             -- per 100,000 population
  deaths_count numeric,           -- absolute number of deaths
  data_quality text NOT NULL DEFAULT 'estimated'
    CHECK (data_quality IN ('observed', 'modeled', 'estimated', 'borrowed')),
  source text,
  notes text,
  CHECK (region_id IS NOT NULL OR country_id IS NOT NULL),
  UNIQUE (cause_id, region_id, country_id, year)
);

-- Baseline definitions: reference rates for computing "excess" mortality
CREATE TABLE mortality.baselines (
  id serial PRIMARY KEY,
  cause_id integer NOT NULL REFERENCES mortality.causes(id),
  name text NOT NULL,
  reference_country_id integer REFERENCES mortality.countries(id),
  reference_region_id integer REFERENCES mortality.regions(id),
  rate numeric NOT NULL,  -- per 100,000
  year smallint,
  is_default boolean DEFAULT false,
  notes text
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_rates_cause ON mortality.rates(cause_id);
CREATE INDEX idx_rates_region ON mortality.rates(region_id);
CREATE INDEX idx_rates_country ON mortality.rates(country_id);
CREATE INDEX idx_rates_year ON mortality.rates(year);
CREATE INDEX idx_rates_cause_region_year ON mortality.rates(cause_id, region_id, year);
CREATE INDEX idx_baselines_cause ON mortality.baselines(cause_id);
CREATE INDEX idx_baselines_default ON mortality.baselines(cause_id) WHERE is_default = true;
CREATE INDEX idx_causes_level ON mortality.causes(gbd_level);
CREATE INDEX idx_causes_parent ON mortality.causes(parent_id);

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Denormalized view for easy querying of the full rate matrix
CREATE VIEW mortality.rate_matrix AS
SELECT
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
  COALESCE(ctry.population, reg.population) as population,
  r.data_quality,
  r.source,
  r.notes
FROM mortality.rates r
JOIN mortality.causes c ON c.id = r.cause_id
LEFT JOIN mortality.causes pc ON pc.id = c.parent_id
LEFT JOIN mortality.regions reg ON reg.id = r.region_id
LEFT JOIN mortality.super_regions sr ON sr.id = reg.super_region_id
LEFT JOIN mortality.countries ctry ON ctry.id = r.country_id;

-- Excess mortality view: compares region rates to default baselines
CREATE VIEW mortality.excess_by_region AS
SELECT
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
  CASE WHEN b.rate > 0
    THEN round(((r.age_standardized_rate - b.rate) / b.rate * 100)::numeric, 1)
    ELSE NULL
  END as excess_pct,
  reg.population,
  CASE WHEN reg.population IS NOT NULL AND r.age_standardized_rate IS NOT NULL
    THEN round(((r.age_standardized_rate - b.rate) * reg.population / 100000)::numeric, 0)
    ELSE NULL
  END as excess_deaths_est,
  r.data_quality
FROM mortality.rates r
JOIN mortality.causes c ON c.id = r.cause_id
JOIN mortality.regions reg ON reg.id = r.region_id
JOIN mortality.super_regions sr ON sr.id = reg.super_region_id
JOIN mortality.baselines b ON b.cause_id = r.cause_id AND b.is_default = true
WHERE r.country_id IS NULL;

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE mortality.causes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortality.super_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortality.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortality.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortality.rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortality.baselines ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access" ON mortality.causes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON mortality.super_regions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON mortality.regions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON mortality.countries FOR SELECT USING (true);
CREATE POLICY "Public read access" ON mortality.rates FOR SELECT USING (true);
CREATE POLICY "Public read access" ON mortality.baselines FOR SELECT USING (true);

-- Authenticated users can manage data
CREATE POLICY "Authenticated write" ON mortality.causes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON mortality.super_regions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON mortality.regions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON mortality.countries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON mortality.rates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON mortality.baselines FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================================================
-- GRANTS
-- =============================================================================

GRANT SELECT ON ALL TABLES IN SCHEMA mortality TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA mortality TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA mortality TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA mortality TO anon, authenticated, service_role;
