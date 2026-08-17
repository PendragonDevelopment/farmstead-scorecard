-- Farmstead scorecard: one row per property.
-- gates/scores are stored as JSON text (mirrors the client shape).
-- updated_at (ms epoch) drives last-write-wins sync across devices.
-- deleted_at is a tombstone so deletions propagate to other devices.
CREATE TABLE IF NOT EXISTS properties (
  id         TEXT PRIMARY KEY,
  name       TEXT    NOT NULL DEFAULT '',
  town       TEXT    NOT NULL DEFAULT '',
  acres      TEXT    NOT NULL DEFAULT '',
  price      TEXT    NOT NULL DEFAULT '',
  notes      TEXT    NOT NULL DEFAULT '',
  gates      TEXT    NOT NULL DEFAULT '{}',
  scores     TEXT    NOT NULL DEFAULT '{}',
  updated_at INTEGER NOT NULL DEFAULT 0,
  deleted_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_properties_updated_at ON properties(updated_at);
