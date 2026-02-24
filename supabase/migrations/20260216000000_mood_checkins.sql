-- Mood check-ins: simple spike tracking (great / okay / awful)
-- Replaces the 6-scale check_ins for day-level mood tracking

CREATE TABLE flow.mood_checkins (
  id serial PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id),
  mood text NOT NULL CHECK (mood IN ('great', 'okay', 'awful')),
  tags text[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_mood_checkins_user ON flow.mood_checkins(user_id);
CREATE INDEX idx_mood_checkins_created ON flow.mood_checkins(created_at);

ALTER TABLE flow.mood_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own data" ON flow.mood_checkins FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

GRANT ALL ON flow.mood_checkins TO authenticated;
GRANT ALL ON flow.mood_checkins TO service_role;
GRANT USAGE, SELECT ON SEQUENCE flow.mood_checkins_id_seq TO authenticated, service_role;
