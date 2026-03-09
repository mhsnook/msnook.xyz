-- Generic key-value store for client-side app state.
-- Each app gets one row; Zustand persist handles versioning and migrations.
CREATE TABLE app_stores (
  store_name TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update the timestamp on every write.
CREATE OR REPLACE FUNCTION update_app_stores_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER app_stores_updated_at
  BEFORE UPDATE ON app_stores
  FOR EACH ROW
  EXECUTE FUNCTION update_app_stores_timestamp();

-- RLS: only authenticated users can access.
ALTER TABLE app_stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage app stores"
  ON app_stores FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
