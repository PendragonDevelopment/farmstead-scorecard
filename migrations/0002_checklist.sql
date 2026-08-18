-- Shared state for the readiness checklist, mirroring the properties table.
-- One row per checklist item id (e.g. "exp.4"); only touched items are stored.
-- updated_at (ms epoch) drives last-write-wins sync across devices.
CREATE TABLE IF NOT EXISTS checklist_state (
  id         TEXT PRIMARY KEY,
  done       INTEGER NOT NULL DEFAULT 0,
  done_at    TEXT,
  note       TEXT    NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_checklist_updated_at ON checklist_state(updated_at);
