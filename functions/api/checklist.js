import { json } from '../../lib/auth.mjs';

const MAX_BATCH = 1000; // D1 free-tier batch limit

const str = (v) => (v == null ? '' : String(v));

// GET /api/checklist — full state (one row per touched item) for the client to merge.
export async function onRequestGet(ctx) {
  const { results } = await ctx.env.DB
    .prepare('SELECT id,done,done_at,note,updated_at FROM checklist_state')
    .all();

  const items = results.map((r) => ({
    id: String(r.id),
    done: !!r.done,
    at: r.done_at ?? null,
    note: r.note || '',
    updated_at: r.updated_at || 0,
  }));

  return json({ items, serverTime: Date.now() });
}

// POST /api/checklist — upsert a batch of item states. Last-write-wins on updated_at.
export async function onRequestPost(ctx) {
  let body;
  try { body = await ctx.request.json(); } catch { return json({ error: 'bad request' }, 400); }

  const list = Array.isArray(body?.items) ? body.items : null;
  if (!list) return json({ error: 'expected {items: []}' }, 400);
  if (list.length > MAX_BATCH) return json({ error: 'too many items in one request' }, 413);

  const stmt = ctx.env.DB.prepare(
    `INSERT INTO checklist_state (id,done,done_at,note,updated_at)
       VALUES (?,?,?,?,?)
     ON CONFLICT(id) DO UPDATE SET
       done=excluded.done, done_at=excluded.done_at, note=excluded.note, updated_at=excluded.updated_at
     WHERE excluded.updated_at > checklist_state.updated_at`
  );

  const batch = [];
  for (const it of list) {
    if (!it || it.id == null) continue;
    batch.push(stmt.bind(
      String(it.id),
      it.done ? 1 : 0,
      it.at ? str(it.at) : null,
      str(it.note),
      Number(it.updated_at) || 0
    ));
  }

  if (batch.length) await ctx.env.DB.batch(batch);
  return json({ ok: true, count: batch.length, serverTime: Date.now() });
}
