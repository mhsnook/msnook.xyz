-- =============================================================================
-- MORTALITY SEED DATA
-- Phase 0: Approximate data based on GBD 2019 published estimates
-- All age-standardized rates are per 100,000 population
-- Data quality is marked as 'estimated' throughout — these are rough approximations
-- for building the interactive explorer. Real GBD data should be imported later.
-- =============================================================================

-- =============================================================================
-- CAUSES: GBD Level 1 and Level 2 hierarchy
-- =============================================================================

INSERT INTO mortality.causes (id, name, slug, gbd_level, parent_id, sort_order, description) VALUES
-- Level 1
(100, 'Communicable, maternal, neonatal, and nutritional diseases', 'cmnn', 1, NULL, 1, 'Infectious diseases, conditions related to pregnancy/birth, and malnutrition'),
(200, 'Non-communicable diseases', 'ncd', 1, NULL, 2, 'Chronic and degenerative conditions'),
(300, 'Injuries', 'injuries', 1, NULL, 3, 'Deaths from external causes including violence, accidents, and self-harm'),

-- Level 2 under CMNN (100)
(101, 'HIV/AIDS and sexually transmitted infections', 'hiv-stis', 2, 100, 1, 'Includes HIV/AIDS, syphilis, chlamydia, gonorrhea, and other STIs'),
(102, 'Respiratory infections and tuberculosis', 'resp-infections-tb', 2, 100, 2, 'Lower respiratory infections, upper respiratory infections, tuberculosis'),
(103, 'Enteric infections', 'enteric-infections', 2, 100, 3, 'Diarrheal diseases, typhoid, paratyphoid, and other intestinal infections'),
(104, 'Neglected tropical diseases and malaria', 'ntds-malaria', 2, 100, 4, 'Malaria, dengue, Chagas, leishmaniasis, schistosomiasis, and others'),
(105, 'Other infectious diseases', 'other-infectious', 2, 100, 5, 'Meningitis, encephalitis, hepatitis, and other infections not elsewhere classified'),
(106, 'Maternal and neonatal disorders', 'maternal-neonatal', 2, 100, 6, 'Maternal hemorrhage, sepsis, hypertensive disorders; neonatal preterm, encephalopathy, sepsis'),
(107, 'Nutritional deficiencies', 'nutritional-deficiencies', 2, 100, 7, 'Protein-energy malnutrition, iron deficiency, vitamin A deficiency, iodine deficiency'),

-- Level 2 under NCD (200)
(201, 'Neoplasms', 'neoplasms', 2, 200, 1, 'All cancers: lung, breast, colorectal, stomach, liver, cervical, etc.'),
(202, 'Cardiovascular diseases', 'cardiovascular', 2, 200, 2, 'Ischemic heart disease, stroke, hypertensive heart disease, cardiomyopathy'),
(203, 'Chronic respiratory diseases', 'chronic-respiratory', 2, 200, 3, 'COPD, asthma, pneumoconiosis, interstitial lung disease'),
(204, 'Digestive diseases', 'digestive', 2, 200, 4, 'Cirrhosis, peptic ulcer, inflammatory bowel disease, pancreatitis, gallbladder disease'),
(205, 'Neurological disorders', 'neurological', 2, 200, 5, 'Alzheimer, Parkinson, epilepsy, multiple sclerosis, motor neuron disease'),
(206, 'Mental disorders', 'mental-disorders', 2, 200, 6, 'Eating disorders and some direct mortality; most mental health burden is disability not death'),
(207, 'Substance use disorders', 'substance-use', 2, 200, 7, 'Alcohol use disorders, drug use disorders (opioid, cocaine, amphetamine, etc.)'),
(208, 'Diabetes and kidney diseases', 'diabetes-kidney', 2, 200, 8, 'Diabetes mellitus types 1 and 2, chronic kidney disease'),
(209, 'Skin and subcutaneous diseases', 'skin', 2, 200, 9, 'Dermatitis, psoriasis, cellulitis, scabies — very low direct mortality'),
(210, 'Sense organ diseases', 'sense-organ', 2, 200, 10, 'Hearing loss, vision loss — negligible direct mortality, major disability burden'),
(211, 'Musculoskeletal disorders', 'musculoskeletal', 2, 200, 11, 'Low back pain, osteoarthritis, rheumatoid arthritis — negligible direct mortality'),
(212, 'Other non-communicable diseases', 'other-ncd', 2, 200, 12, 'Congenital anomalies, hemoglobinopathies, endocrine disorders, oral conditions')
ON CONFLICT (id) DO NOTHING;

-- Level 2 under Injuries (300)
INSERT INTO mortality.causes (id, name, slug, gbd_level, parent_id, sort_order, description) VALUES
(301, 'Transport injuries', 'transport-injuries', 2, 300, 1, 'Road injuries, pedestrian, cyclist, motorcyclist, and other transport deaths'),
(302, 'Unintentional injuries', 'unintentional-injuries', 2, 300, 2, 'Falls, drowning, fire/heat, poisoning, exposure to mechanical forces, natural disasters'),
(303, 'Self-harm and interpersonal violence', 'self-harm-violence', 2, 300, 3, 'Suicide, homicide by firearm/sharp object/other means, sexual violence, conflict/terrorism')
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- SUPER-REGIONS (7 GBD super-regions)
-- =============================================================================

INSERT INTO mortality.super_regions (id, name, slug, sort_order) VALUES
(1, 'Southeast Asia, East Asia, and Oceania', 'se-e-asia-oceania', 1),
(2, 'Central Europe, Eastern Europe, and Central Asia', 'ce-ee-central-asia', 2),
(3, 'High-income', 'high-income', 3),
(4, 'Latin America and Caribbean', 'lac', 4),
(5, 'North Africa and Middle East', 'name', 5),
(6, 'South Asia', 'south-asia', 6),
(7, 'Sub-Saharan Africa', 'ssa', 7)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- REGIONS (21 GBD regions)
-- Population figures are approximate 2019 values
-- =============================================================================

INSERT INTO mortality.regions (id, name, slug, super_region_id, population, population_year, sort_order) VALUES
-- Super-region 1: SE Asia, E Asia, Oceania
(1, 'East Asia', 'east-asia', 1, 1460000000, 2019, 1),
(2, 'Southeast Asia', 'southeast-asia', 1, 670000000, 2019, 2),
(3, 'Oceania', 'oceania', 1, 12000000, 2019, 3),

-- Super-region 2: Central Europe, Eastern Europe, Central Asia
(4, 'Central Europe', 'central-europe', 2, 115000000, 2019, 4),
(5, 'Eastern Europe', 'eastern-europe', 2, 210000000, 2019, 5),
(6, 'Central Asia', 'central-asia', 2, 95000000, 2019, 6),

-- Super-region 3: High-income
(7, 'High-income Asia Pacific', 'hi-asia-pacific', 3, 185000000, 2019, 7),
(8, 'Australasia', 'australasia', 3, 30000000, 2019, 8),
(9, 'Western Europe', 'western-europe', 3, 410000000, 2019, 9),
(10, 'High-income North America', 'hi-north-america', 3, 370000000, 2019, 10),
(11, 'Southern Latin America', 'southern-latin-america', 3, 70000000, 2019, 11),

-- Super-region 4: Latin America and Caribbean
(12, 'Caribbean', 'caribbean', 4, 44000000, 2019, 12),
(13, 'Central Latin America', 'central-latin-america', 4, 260000000, 2019, 13),
(14, 'Tropical Latin America', 'tropical-latin-america', 4, 220000000, 2019, 14),
(15, 'Andean Latin America', 'andean-latin-america', 4, 60000000, 2019, 15),

-- Super-region 5: North Africa and Middle East
(16, 'North Africa and Middle East', 'north-africa-middle-east', 5, 600000000, 2019, 16),

-- Super-region 6: South Asia
(17, 'South Asia', 'south-asia-region', 6, 1850000000, 2019, 17),

-- Super-region 7: Sub-Saharan Africa
(18, 'Western Sub-Saharan Africa', 'western-ssa', 7, 420000000, 2019, 18),
(19, 'Eastern Sub-Saharan Africa', 'eastern-ssa', 7, 450000000, 2019, 19),
(20, 'Central Sub-Saharan Africa', 'central-ssa', 7, 130000000, 2019, 20),
(21, 'Southern Sub-Saharan Africa', 'southern-ssa', 7, 80000000, 2019, 21)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- REFERENCE COUNTRIES (for baseline comparisons)
-- =============================================================================

INSERT INTO mortality.countries (id, name, iso3, region_id, population, population_year) VALUES
(1, 'Japan', 'JPN', 7, 126000000, 2019),
(2, 'South Korea', 'KOR', 7, 52000000, 2019),
(3, 'Sweden', 'SWE', 9, 10000000, 2019),
(4, 'Netherlands', 'NLD', 9, 17000000, 2019),
(5, 'Norway', 'NOR', 9, 5000000, 2019),
(6, 'Singapore', 'SGP', 7, 6000000, 2019),
(7, 'Iceland', 'ISL', 9, 370000, 2019)
ON CONFLICT (id) DO NOTHING;


-- =============================================================================
-- REGION-LEVEL RATES
-- All rates are age-standardized per 100,000, year 2019
-- Data quality = 'estimated' (Phase 0 approximations from published GBD summaries)
-- Source references GBD 2019 as the basis for these approximations
-- =============================================================================

-- Helper: insert rates for all 21 regions for a given cause
-- Format: (cause_id, region_id, year, rate, quality, source)

-- -----------------------------------------------------------------------------
-- 101: HIV/AIDS and STIs
-- The dominant global pattern: Southern Sub-Saharan Africa dramatically elevated
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(101, 1, 2019, 1.0, 'estimated', 'GBD 2019 approx'),
(101, 2, 2019, 8.0, 'estimated', 'GBD 2019 approx'),
(101, 3, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(101, 4, 2019, 0.5, 'estimated', 'GBD 2019 approx'),
(101, 5, 2019, 8.0, 'estimated', 'GBD 2019 approx'),
(101, 6, 2019, 1.0, 'estimated', 'GBD 2019 approx'),
(101, 7, 2019, 0.5, 'estimated', 'GBD 2019 approx'),
(101, 8, 2019, 1.0, 'estimated', 'GBD 2019 approx'),
(101, 9, 2019, 1.5, 'estimated', 'GBD 2019 approx'),
(101, 10, 2019, 3.0, 'estimated', 'GBD 2019 approx'),
(101, 11, 2019, 3.0, 'estimated', 'GBD 2019 approx'),
(101, 12, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(101, 13, 2019, 3.0, 'estimated', 'GBD 2019 approx'),
(101, 14, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(101, 15, 2019, 3.0, 'estimated', 'GBD 2019 approx'),
(101, 16, 2019, 1.0, 'estimated', 'GBD 2019 approx'),
(101, 17, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(101, 18, 2019, 35.0, 'estimated', 'GBD 2019 approx'),
(101, 19, 2019, 70.0, 'estimated', 'GBD 2019 approx'),
(101, 20, 2019, 30.0, 'estimated', 'GBD 2019 approx'),
(101, 21, 2019, 200.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 102: Respiratory infections and tuberculosis
-- High burden in Sub-Saharan Africa and South Asia
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(102, 1, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(102, 2, 2019, 45.0, 'estimated', 'GBD 2019 approx'),
(102, 3, 2019, 60.0, 'estimated', 'GBD 2019 approx'),
(102, 4, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(102, 5, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(102, 6, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(102, 7, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(102, 8, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(102, 9, 2019, 7.0, 'estimated', 'GBD 2019 approx'),
(102, 10, 2019, 8.0, 'estimated', 'GBD 2019 approx'),
(102, 11, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(102, 12, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(102, 13, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(102, 14, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(102, 15, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(102, 16, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(102, 17, 2019, 55.0, 'estimated', 'GBD 2019 approx'),
(102, 18, 2019, 100.0, 'estimated', 'GBD 2019 approx'),
(102, 19, 2019, 90.0, 'estimated', 'GBD 2019 approx'),
(102, 20, 2019, 110.0, 'estimated', 'GBD 2019 approx'),
(102, 21, 2019, 80.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 103: Enteric infections
-- Massive inequality: 100x difference between best and worst regions
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(103, 1, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(103, 2, 2019, 8.0, 'estimated', 'GBD 2019 approx'),
(103, 3, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(103, 4, 2019, 0.5, 'estimated', 'GBD 2019 approx'),
(103, 5, 2019, 1.0, 'estimated', 'GBD 2019 approx'),
(103, 6, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(103, 7, 2019, 0.5, 'estimated', 'GBD 2019 approx'),
(103, 8, 2019, 0.3, 'estimated', 'GBD 2019 approx'),
(103, 9, 2019, 0.3, 'estimated', 'GBD 2019 approx'),
(103, 10, 2019, 0.5, 'estimated', 'GBD 2019 approx'),
(103, 11, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(103, 12, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(103, 13, 2019, 4.0, 'estimated', 'GBD 2019 approx'),
(103, 14, 2019, 3.0, 'estimated', 'GBD 2019 approx'),
(103, 15, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(103, 16, 2019, 8.0, 'estimated', 'GBD 2019 approx'),
(103, 17, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(103, 18, 2019, 50.0, 'estimated', 'GBD 2019 approx'),
(103, 19, 2019, 40.0, 'estimated', 'GBD 2019 approx'),
(103, 20, 2019, 45.0, 'estimated', 'GBD 2019 approx'),
(103, 21, 2019, 15.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 104: Neglected tropical diseases and malaria
-- Almost entirely concentrated in Sub-Saharan Africa
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(104, 1, 2019, 0.5, 'estimated', 'GBD 2019 approx'),
(104, 2, 2019, 3.0, 'estimated', 'GBD 2019 approx'),
(104, 3, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(104, 4, 2019, 0.1, 'estimated', 'GBD 2019 approx'),
(104, 5, 2019, 0.1, 'estimated', 'GBD 2019 approx'),
(104, 6, 2019, 0.5, 'estimated', 'GBD 2019 approx'),
(104, 7, 2019, 0.1, 'estimated', 'GBD 2019 approx'),
(104, 8, 2019, 0.1, 'estimated', 'GBD 2019 approx'),
(104, 9, 2019, 0.1, 'estimated', 'GBD 2019 approx'),
(104, 10, 2019, 0.1, 'estimated', 'GBD 2019 approx'),
(104, 11, 2019, 0.5, 'estimated', 'GBD 2019 approx'),
(104, 12, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(104, 13, 2019, 1.0, 'estimated', 'GBD 2019 approx'),
(104, 14, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(104, 15, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(104, 16, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(104, 17, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(104, 18, 2019, 55.0, 'estimated', 'GBD 2019 approx'),
(104, 19, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(104, 20, 2019, 40.0, 'estimated', 'GBD 2019 approx'),
(104, 21, 2019, 8.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 106: Maternal and neonatal disorders
-- Enormous gap between high-income and low-income regions
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(106, 1, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(106, 2, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(106, 3, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(106, 4, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(106, 5, 2019, 3.0, 'estimated', 'GBD 2019 approx'),
(106, 6, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(106, 7, 2019, 1.5, 'estimated', 'GBD 2019 approx'),
(106, 8, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(106, 9, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(106, 10, 2019, 3.0, 'estimated', 'GBD 2019 approx'),
(106, 11, 2019, 4.0, 'estimated', 'GBD 2019 approx'),
(106, 12, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(106, 13, 2019, 8.0, 'estimated', 'GBD 2019 approx'),
(106, 14, 2019, 8.0, 'estimated', 'GBD 2019 approx'),
(106, 15, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(106, 16, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(106, 17, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(106, 18, 2019, 55.0, 'estimated', 'GBD 2019 approx'),
(106, 19, 2019, 40.0, 'estimated', 'GBD 2019 approx'),
(106, 20, 2019, 50.0, 'estimated', 'GBD 2019 approx'),
(106, 21, 2019, 20.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 107: Nutritional deficiencies
-- Concentrated in Sub-Saharan Africa and South Asia
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(107, 1, 2019, 1.0, 'estimated', 'GBD 2019 approx'),
(107, 2, 2019, 3.0, 'estimated', 'GBD 2019 approx'),
(107, 3, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(107, 4, 2019, 0.3, 'estimated', 'GBD 2019 approx'),
(107, 5, 2019, 0.5, 'estimated', 'GBD 2019 approx'),
(107, 6, 2019, 1.5, 'estimated', 'GBD 2019 approx'),
(107, 7, 2019, 0.2, 'estimated', 'GBD 2019 approx'),
(107, 8, 2019, 0.3, 'estimated', 'GBD 2019 approx'),
(107, 9, 2019, 0.3, 'estimated', 'GBD 2019 approx'),
(107, 10, 2019, 0.3, 'estimated', 'GBD 2019 approx'),
(107, 11, 2019, 0.5, 'estimated', 'GBD 2019 approx'),
(107, 12, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(107, 13, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(107, 14, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(107, 15, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(107, 16, 2019, 2.0, 'estimated', 'GBD 2019 approx'),
(107, 17, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(107, 18, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(107, 19, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(107, 20, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(107, 21, 2019, 4.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 201: Neoplasms (cancers)
-- Higher in high-income and aging populations; lower rates in young populations
-- don't necessarily mean better health systems
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(201, 1, 2019, 130.0, 'estimated', 'GBD 2019 approx'),
(201, 2, 2019, 90.0, 'estimated', 'GBD 2019 approx'),
(201, 3, 2019, 100.0, 'estimated', 'GBD 2019 approx'),
(201, 4, 2019, 150.0, 'estimated', 'GBD 2019 approx'),
(201, 5, 2019, 160.0, 'estimated', 'GBD 2019 approx'),
(201, 6, 2019, 100.0, 'estimated', 'GBD 2019 approx'),
(201, 7, 2019, 100.0, 'estimated', 'GBD 2019 approx'),
(201, 8, 2019, 100.0, 'estimated', 'GBD 2019 approx'),
(201, 9, 2019, 120.0, 'estimated', 'GBD 2019 approx'),
(201, 10, 2019, 110.0, 'estimated', 'GBD 2019 approx'),
(201, 11, 2019, 110.0, 'estimated', 'GBD 2019 approx'),
(201, 12, 2019, 90.0, 'estimated', 'GBD 2019 approx'),
(201, 13, 2019, 70.0, 'estimated', 'GBD 2019 approx'),
(201, 14, 2019, 95.0, 'estimated', 'GBD 2019 approx'),
(201, 15, 2019, 80.0, 'estimated', 'GBD 2019 approx'),
(201, 16, 2019, 85.0, 'estimated', 'GBD 2019 approx'),
(201, 17, 2019, 75.0, 'estimated', 'GBD 2019 approx'),
(201, 18, 2019, 80.0, 'estimated', 'GBD 2019 approx'),
(201, 19, 2019, 90.0, 'estimated', 'GBD 2019 approx'),
(201, 20, 2019, 80.0, 'estimated', 'GBD 2019 approx'),
(201, 21, 2019, 100.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 202: Cardiovascular diseases
-- The world's leading killer; Eastern Europe and Central Asia extremely elevated
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(202, 1, 2019, 200.0, 'estimated', 'GBD 2019 approx'),
(202, 2, 2019, 210.0, 'estimated', 'GBD 2019 approx'),
(202, 3, 2019, 300.0, 'estimated', 'GBD 2019 approx'),
(202, 4, 2019, 250.0, 'estimated', 'GBD 2019 approx'),
(202, 5, 2019, 450.0, 'estimated', 'GBD 2019 approx'),
(202, 6, 2019, 400.0, 'estimated', 'GBD 2019 approx'),
(202, 7, 2019, 80.0, 'estimated', 'GBD 2019 approx'),
(202, 8, 2019, 90.0, 'estimated', 'GBD 2019 approx'),
(202, 9, 2019, 100.0, 'estimated', 'GBD 2019 approx'),
(202, 10, 2019, 120.0, 'estimated', 'GBD 2019 approx'),
(202, 11, 2019, 120.0, 'estimated', 'GBD 2019 approx'),
(202, 12, 2019, 180.0, 'estimated', 'GBD 2019 approx'),
(202, 13, 2019, 130.0, 'estimated', 'GBD 2019 approx'),
(202, 14, 2019, 150.0, 'estimated', 'GBD 2019 approx'),
(202, 15, 2019, 110.0, 'estimated', 'GBD 2019 approx'),
(202, 16, 2019, 250.0, 'estimated', 'GBD 2019 approx'),
(202, 17, 2019, 280.0, 'estimated', 'GBD 2019 approx'),
(202, 18, 2019, 200.0, 'estimated', 'GBD 2019 approx'),
(202, 19, 2019, 200.0, 'estimated', 'GBD 2019 approx'),
(202, 20, 2019, 220.0, 'estimated', 'GBD 2019 approx'),
(202, 21, 2019, 250.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 203: Chronic respiratory diseases
-- Very high in South Asia (indoor air pollution, biomass fuels)
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(203, 1, 2019, 50.0, 'estimated', 'GBD 2019 approx'),
(203, 2, 2019, 35.0, 'estimated', 'GBD 2019 approx'),
(203, 3, 2019, 45.0, 'estimated', 'GBD 2019 approx'),
(203, 4, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(203, 5, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(203, 6, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(203, 7, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(203, 8, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(203, 9, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(203, 10, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(203, 11, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(203, 12, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(203, 13, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(203, 14, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(203, 15, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(203, 16, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(203, 17, 2019, 70.0, 'estimated', 'GBD 2019 approx'),
(203, 18, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(203, 19, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(203, 20, 2019, 30.0, 'estimated', 'GBD 2019 approx'),
(203, 21, 2019, 35.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 204: Digestive diseases
-- Central Asia and Eastern Europe elevated (alcohol-related liver disease)
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(204, 1, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(204, 2, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(204, 3, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(204, 4, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(204, 5, 2019, 30.0, 'estimated', 'GBD 2019 approx'),
(204, 6, 2019, 40.0, 'estimated', 'GBD 2019 approx'),
(204, 7, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(204, 8, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(204, 9, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(204, 10, 2019, 14.0, 'estimated', 'GBD 2019 approx'),
(204, 11, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(204, 12, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(204, 13, 2019, 30.0, 'estimated', 'GBD 2019 approx'),
(204, 14, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(204, 15, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(204, 16, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(204, 17, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(204, 18, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(204, 19, 2019, 22.0, 'estimated', 'GBD 2019 approx'),
(204, 20, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(204, 21, 2019, 25.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 208: Diabetes and kidney diseases
-- Oceania, Caribbean, Central Latin America dramatically elevated
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(208, 1, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(208, 2, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(208, 3, 2019, 50.0, 'estimated', 'GBD 2019 approx'),
(208, 4, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(208, 5, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(208, 6, 2019, 22.0, 'estimated', 'GBD 2019 approx'),
(208, 7, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(208, 8, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(208, 9, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(208, 10, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(208, 11, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(208, 12, 2019, 35.0, 'estimated', 'GBD 2019 approx'),
(208, 13, 2019, 35.0, 'estimated', 'GBD 2019 approx'),
(208, 14, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(208, 15, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(208, 16, 2019, 30.0, 'estimated', 'GBD 2019 approx'),
(208, 17, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(208, 18, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(208, 19, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(208, 20, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(208, 21, 2019, 25.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 301: Transport injuries
-- Sub-Saharan Africa, South Asia, and MENA highest; high-income lowest
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(301, 1, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(301, 2, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(301, 3, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(301, 4, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(301, 5, 2019, 14.0, 'estimated', 'GBD 2019 approx'),
(301, 6, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(301, 7, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(301, 8, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(301, 9, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(301, 10, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(301, 11, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(301, 12, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(301, 13, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(301, 14, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(301, 15, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(301, 16, 2019, 20.0, 'estimated', 'GBD 2019 approx'),
(301, 17, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(301, 18, 2019, 28.0, 'estimated', 'GBD 2019 approx'),
(301, 19, 2019, 30.0, 'estimated', 'GBD 2019 approx'),
(301, 20, 2019, 32.0, 'estimated', 'GBD 2019 approx'),
(301, 21, 2019, 30.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 302: Unintentional injuries
-- Falls, drowning, fire, poisoning, natural disasters
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(302, 1, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(302, 2, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(302, 3, 2019, 30.0, 'estimated', 'GBD 2019 approx'),
(302, 4, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(302, 5, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(302, 6, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(302, 7, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(302, 8, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(302, 9, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(302, 10, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(302, 11, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(302, 12, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(302, 13, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(302, 14, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(302, 15, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(302, 16, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(302, 17, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(302, 18, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(302, 19, 2019, 25.0, 'estimated', 'GBD 2019 approx'),
(302, 20, 2019, 28.0, 'estimated', 'GBD 2019 approx'),
(302, 21, 2019, 22.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- 303: Self-harm and interpersonal violence
-- Latin America (homicide), Eastern Europe (suicide), Southern SSA (both)
-- Note: this GBD category combines self-harm (suicide) and violence (homicide)
-- which obscures very different policy interventions needed
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source) VALUES
(303, 1, 2019, 8.0, 'estimated', 'GBD 2019 approx'),
(303, 2, 2019, 8.0, 'estimated', 'GBD 2019 approx'),
(303, 3, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(303, 4, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(303, 5, 2019, 22.0, 'estimated', 'GBD 2019 approx'),
(303, 6, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(303, 7, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(303, 8, 2019, 9.0, 'estimated', 'GBD 2019 approx'),
(303, 9, 2019, 7.0, 'estimated', 'GBD 2019 approx'),
(303, 10, 2019, 14.0, 'estimated', 'GBD 2019 approx'),
(303, 11, 2019, 10.0, 'estimated', 'GBD 2019 approx'),
(303, 12, 2019, 18.0, 'estimated', 'GBD 2019 approx'),
(303, 13, 2019, 22.0, 'estimated', 'GBD 2019 approx'),
(303, 14, 2019, 30.0, 'estimated', 'GBD 2019 approx'),
(303, 15, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(303, 16, 2019, 5.0, 'estimated', 'GBD 2019 approx'),
(303, 17, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(303, 18, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(303, 19, 2019, 15.0, 'estimated', 'GBD 2019 approx'),
(303, 20, 2019, 12.0, 'estimated', 'GBD 2019 approx'),
(303, 21, 2019, 25.0, 'estimated', 'GBD 2019 approx');

-- -----------------------------------------------------------------------------
-- Lower-mortality causes: global aggregate only for Phase 0
-- These cause very few direct deaths but may have large disability burden
-- -----------------------------------------------------------------------------
INSERT INTO mortality.rates (cause_id, region_id, year, age_standardized_rate, data_quality, source, notes) VALUES
-- 105: Other infectious diseases (meningitis, hepatitis, etc.)
(105, 1, 2019, 3.0, 'estimated', 'GBD 2019 approx', 'Global-level estimate applied to region'),
(105, 2, 2019, 5.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 3, 2019, 8.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 4, 2019, 2.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 5, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 6, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 7, 2019, 2.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 8, 2019, 1.5, 'estimated', 'GBD 2019 approx', NULL),
(105, 9, 2019, 2.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 10, 2019, 2.5, 'estimated', 'GBD 2019 approx', NULL),
(105, 11, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 12, 2019, 5.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 13, 2019, 4.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 14, 2019, 4.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 15, 2019, 4.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 16, 2019, 4.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 17, 2019, 6.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 18, 2019, 15.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 19, 2019, 12.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 20, 2019, 14.0, 'estimated', 'GBD 2019 approx', NULL),
(105, 21, 2019, 8.0, 'estimated', 'GBD 2019 approx', NULL),

-- 205: Neurological disorders
(205, 1, 2019, 10.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 2, 2019, 10.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 3, 2019, 8.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 4, 2019, 18.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 5, 2019, 12.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 6, 2019, 8.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 7, 2019, 12.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 8, 2019, 18.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 9, 2019, 22.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 10, 2019, 20.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 11, 2019, 14.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 12, 2019, 10.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 13, 2019, 8.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 14, 2019, 10.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 15, 2019, 8.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 16, 2019, 10.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 17, 2019, 10.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 18, 2019, 8.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 19, 2019, 8.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 20, 2019, 7.0, 'estimated', 'GBD 2019 approx', NULL),
(205, 21, 2019, 10.0, 'estimated', 'GBD 2019 approx', NULL),

-- 206: Mental disorders (very low direct mortality)
(206, 1, 2019, 0.2, 'estimated', 'GBD 2019 approx', 'Direct mortality only; disability burden much higher'),
(206, 2, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(206, 3, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(206, 4, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(206, 5, 2019, 0.5, 'estimated', 'GBD 2019 approx', NULL),
(206, 6, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(206, 7, 2019, 0.2, 'estimated', 'GBD 2019 approx', NULL),
(206, 8, 2019, 0.5, 'estimated', 'GBD 2019 approx', NULL),
(206, 9, 2019, 0.4, 'estimated', 'GBD 2019 approx', NULL),
(206, 10, 2019, 0.8, 'estimated', 'GBD 2019 approx', NULL),
(206, 11, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(206, 12, 2019, 0.4, 'estimated', 'GBD 2019 approx', NULL),
(206, 13, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(206, 14, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(206, 15, 2019, 0.2, 'estimated', 'GBD 2019 approx', NULL),
(206, 16, 2019, 0.2, 'estimated', 'GBD 2019 approx', NULL),
(206, 17, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(206, 18, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(206, 19, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(206, 20, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(206, 21, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),

-- 207: Substance use disorders
(207, 1, 2019, 1.5, 'estimated', 'GBD 2019 approx', NULL),
(207, 2, 2019, 2.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 3, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 4, 2019, 2.5, 'estimated', 'GBD 2019 approx', NULL),
(207, 5, 2019, 5.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 6, 2019, 2.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 7, 2019, 0.5, 'estimated', 'GBD 2019 approx', NULL),
(207, 8, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 9, 2019, 2.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 10, 2019, 6.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 11, 2019, 2.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 12, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 13, 2019, 2.5, 'estimated', 'GBD 2019 approx', NULL),
(207, 14, 2019, 2.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 15, 2019, 1.5, 'estimated', 'GBD 2019 approx', NULL),
(207, 16, 2019, 1.5, 'estimated', 'GBD 2019 approx', NULL),
(207, 17, 2019, 2.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 18, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 19, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 20, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(207, 21, 2019, 4.0, 'estimated', 'GBD 2019 approx', NULL),

-- 209: Skin diseases (negligible direct mortality)
(209, 1, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(209, 2, 2019, 0.5, 'estimated', 'GBD 2019 approx', NULL),
(209, 3, 2019, 0.5, 'estimated', 'GBD 2019 approx', NULL),
(209, 4, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(209, 5, 2019, 0.4, 'estimated', 'GBD 2019 approx', NULL),
(209, 6, 2019, 0.4, 'estimated', 'GBD 2019 approx', NULL),
(209, 7, 2019, 0.2, 'estimated', 'GBD 2019 approx', NULL),
(209, 8, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(209, 9, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(209, 10, 2019, 0.4, 'estimated', 'GBD 2019 approx', NULL),
(209, 11, 2019, 0.3, 'estimated', 'GBD 2019 approx', NULL),
(209, 12, 2019, 0.5, 'estimated', 'GBD 2019 approx', NULL),
(209, 13, 2019, 0.4, 'estimated', 'GBD 2019 approx', NULL),
(209, 14, 2019, 0.4, 'estimated', 'GBD 2019 approx', NULL),
(209, 15, 2019, 0.4, 'estimated', 'GBD 2019 approx', NULL),
(209, 16, 2019, 0.5, 'estimated', 'GBD 2019 approx', NULL),
(209, 17, 2019, 0.8, 'estimated', 'GBD 2019 approx', NULL),
(209, 18, 2019, 1.0, 'estimated', 'GBD 2019 approx', NULL),
(209, 19, 2019, 0.8, 'estimated', 'GBD 2019 approx', NULL),
(209, 20, 2019, 0.8, 'estimated', 'GBD 2019 approx', NULL),
(209, 21, 2019, 0.6, 'estimated', 'GBD 2019 approx', NULL),

-- 212: Other NCDs (congenital anomalies, hemoglobinopathies, etc.)
(212, 1, 2019, 5.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 2, 2019, 7.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 3, 2019, 10.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 4, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 5, 2019, 4.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 6, 2019, 6.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 7, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 8, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 9, 2019, 3.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 10, 2019, 4.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 11, 2019, 4.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 12, 2019, 8.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 13, 2019, 6.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 14, 2019, 6.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 15, 2019, 7.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 16, 2019, 10.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 17, 2019, 10.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 18, 2019, 15.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 19, 2019, 12.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 20, 2019, 14.0, 'estimated', 'GBD 2019 approx', NULL),
(212, 21, 2019, 8.0, 'estimated', 'GBD 2019 approx', NULL);

-- Sense organ (210) and musculoskeletal (211) have negligible direct mortality
-- Omitting from Phase 0 rates — their burden is in disability, not death


-- =============================================================================
-- DEFAULT BASELINES
-- Using the lowest-rate large region for each cause as the "achievable" baseline
-- =============================================================================

INSERT INTO mortality.baselines (cause_id, name, reference_region_id, rate, year, is_default, notes) VALUES
-- CMNN causes: high-income regions as baseline
(101, 'High-income Asia Pacific', 7, 0.5, 2019, true, 'Near-zero HIV in Japan/Korea/Singapore'),
(102, 'Australasia', 8, 5.0, 2019, true, 'Low TB burden, good respiratory care'),
(103, 'Australasia/Western Europe', 8, 0.3, 2019, true, 'Clean water, sanitation, healthcare access'),
(104, 'High-income (multiple)', 7, 0.1, 2019, true, 'No endemic malaria or NTDs'),
(105, 'Australasia', 8, 1.5, 2019, true, 'Good infectious disease control'),
(106, 'High-income Asia Pacific', 7, 1.5, 2019, true, 'Excellent maternal/neonatal care in Japan'),
(107, 'High-income Asia Pacific', 7, 0.2, 2019, true, 'No significant malnutrition'),

-- NCD causes: best-performing regions as baseline
(201, 'Central Latin America', 13, 70.0, 2019, true, 'Younger population caveat; not necessarily best care'),
(202, 'High-income Asia Pacific', 7, 80.0, 2019, true, 'Japan: diet, healthcare, low smoking (declining)'),
(203, 'Central/Southern Latin America', 4, 15.0, 2019, true, 'Low COPD, less indoor air pollution'),
(204, 'Australasia', 8, 10.0, 2019, true, 'Lower alcohol-related liver disease'),
(205, 'Central Sub-Saharan Africa', 20, 7.0, 2019, true, 'Lower rates partly reflect younger population'),
(206, 'Multiple regions', 7, 0.2, 2019, true, 'Negligible direct mortality everywhere'),
(207, 'High-income Asia Pacific', 7, 0.5, 2019, true, 'Low substance use mortality'),
(208, 'High-income Asia Pacific', 7, 10.0, 2019, true, 'Good diabetes management, lower obesity'),
(209, 'High-income Asia Pacific', 7, 0.2, 2019, true, 'Negligible mortality'),
(212, 'High-income (multiple)', 7, 3.0, 2019, true, 'Good management of congenital conditions'),

-- Injury causes
(301, 'Western Europe/Hi-income AP', 7, 5.0, 2019, true, 'Strong road safety laws, infrastructure, enforcement'),
(302, 'Western Europe/Australasia', 8, 10.0, 2019, true, 'Safety regulations, building codes, rescue services'),
(303, 'North Africa and Middle East', 16, 5.0, 2019, true, 'Very low homicide and lower suicide; data quality caveat');
