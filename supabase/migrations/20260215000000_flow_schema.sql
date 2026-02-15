-- Flow: Personal Activity & Wellbeing Tracker
-- Tracks pomodoro sessions, mood/energy check-ins, habits, sleep, and life domains

CREATE SCHEMA IF NOT EXISTS flow;

GRANT USAGE ON SCHEMA flow TO anon, authenticated, service_role;

-- =============================================================================
-- TABLES
-- =============================================================================

-- Life domains: configurable categories of activity
CREATE TABLE flow.life_domains (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  name text NOT NULL,
  icon text, -- emoji
  color text, -- tailwind color name or hex
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Projects linked to domains
CREATE TABLE flow.projects (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  domain_id integer REFERENCES flow.life_domains(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  is_priority boolean NOT NULL DEFAULT false,
  target_pct numeric CHECK (target_pct IS NULL OR (target_pct >= 0 AND target_pct <= 100)),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tags for sessions and items
CREATE TABLE flow.tags (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  name text NOT NULL,
  domain_id integer REFERENCES flow.life_domains(id) ON DELETE SET NULL,
  project_id integer REFERENCES flow.projects(id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'user' CHECK (source IN ('user', 'suggested', 'todoist', 'github')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);

-- Pomodoro timer sessions
CREATE TABLE flow.pomodoro_sessions (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_seconds integer NOT NULL DEFAULT 1500, -- 25 min default
  intention text,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'paused', 'completed', 'abandoned')),
  mood smallint CHECK (mood IS NULL OR (mood >= 1 AND mood <= 5)),
  energy smallint CHECK (energy IS NULL OR (energy >= 1 AND energy <= 5)),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Many-to-many: sessions <-> tags
CREATE TABLE flow.session_tags (
  id serial PRIMARY KEY,
  session_id integer NOT NULL REFERENCES flow.pomodoro_sessions(id) ON DELETE CASCADE,
  tag_id integer NOT NULL REFERENCES flow.tags(id) ON DELETE CASCADE,
  UNIQUE (session_id, tag_id)
);

-- Mood/energy check-ins
CREATE TABLE flow.check_ins (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  anxiety smallint CHECK (anxiety IS NULL OR (anxiety >= 1 AND anxiety <= 5)),
  depression smallint CHECK (depression IS NULL OR (depression >= 1 AND depression <= 5)),
  energy smallint CHECK (energy IS NULL OR (energy >= 1 AND energy <= 5)),
  ease smallint CHECK (ease IS NULL OR (ease >= 1 AND ease <= 5)),
  flow smallint CHECK (flow IS NULL OR (flow >= 1 AND flow <= 5)),
  focus smallint CHECK (focus IS NULL OR (focus >= 1 AND focus <= 5)),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Sleep tracking
CREATE TABLE flow.sleep_logs (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  hours_slept numeric CHECK (hours_slept IS NULL OR (hours_slept >= 0 AND hours_slept <= 24)),
  quality smallint CHECK (quality IS NULL OR (quality >= 1 AND quality <= 5)),
  bedtime time,
  wake_time time,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

-- User-configurable habit definitions
CREATE TABLE flow.habit_definitions (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  name text NOT NULL,
  icon text, -- emoji
  domain_id integer REFERENCES flow.life_domains(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'positive' CHECK (category IN ('positive', 'neutral')),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Daily habit entries
CREATE TABLE flow.habit_logs (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  habit_definition_id integer NOT NULL REFERENCES flow.habit_definitions(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (habit_definition_id, date)
);

-- Cache of Todoist tasks
CREATE TABLE flow.todoist_tasks (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  todoist_id text NOT NULL,
  content text NOT NULL,
  description text,
  project_name text,
  priority integer,
  due_date text,
  is_completed boolean NOT NULL DEFAULT false,
  labels text[], -- array of label strings
  synced_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, todoist_id)
);

-- Cache of GitHub issues/PRs/commits
CREATE TABLE flow.github_items (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  github_id text NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('issue', 'pull_request', 'commit', 'event')),
  repo text NOT NULL,
  title text,
  url text,
  state text,
  created_at_gh timestamptz,
  synced_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, github_id)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_sessions_user ON flow.pomodoro_sessions(user_id);
CREATE INDEX idx_sessions_started ON flow.pomodoro_sessions(started_at);
CREATE INDEX idx_sessions_status ON flow.pomodoro_sessions(status);
CREATE INDEX idx_checkins_user ON flow.check_ins(user_id);
CREATE INDEX idx_checkins_created ON flow.check_ins(created_at);
CREATE INDEX idx_sleep_user_date ON flow.sleep_logs(user_id, date);
CREATE INDEX idx_habits_user ON flow.habit_definitions(user_id);
CREATE INDEX idx_habit_logs_date ON flow.habit_logs(date);
CREATE INDEX idx_habit_logs_habit ON flow.habit_logs(habit_definition_id);
CREATE INDEX idx_tags_user ON flow.tags(user_id);
CREATE INDEX idx_todoist_user ON flow.todoist_tasks(user_id);
CREATE INDEX idx_github_user ON flow.github_items(user_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE flow.life_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow.pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow.session_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow.habit_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow.todoist_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow.github_items ENABLE ROW LEVEL SECURITY;

-- Authenticated users: full access to own rows
CREATE POLICY "Users manage own data" ON flow.life_domains FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users manage own data" ON flow.projects FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users manage own data" ON flow.tags FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users manage own data" ON flow.pomodoro_sessions FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users manage own session_tags" ON flow.session_tags FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM flow.pomodoro_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM flow.pomodoro_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));
CREATE POLICY "Users manage own data" ON flow.check_ins FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users manage own data" ON flow.sleep_logs FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users manage own data" ON flow.habit_definitions FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users manage own data" ON flow.habit_logs FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users manage own data" ON flow.todoist_tasks FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users manage own data" ON flow.github_items FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- GRANTS
-- =============================================================================

GRANT ALL ON ALL TABLES IN SCHEMA flow TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA flow TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA flow TO authenticated, service_role;
