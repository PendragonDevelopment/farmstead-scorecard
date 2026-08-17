import { json } from '../../lib/auth.mjs';

const MAX_BATCH = 1000; // D1 free-tier batch limit

const str = (v) => (v == null ? '' : String(v));
const safeParse = (s, fallback) => { try { return JSON.parse(s); } catch { return fallback; } };

// GET /api/properties — full set (including tombstones) for the client to merge.
export async function onRequestGet(ctx) {
  const { results } = await ctx.env.DB
    .prepare('SELECT id,name,town,acres,price,notes,gates,scores,updated_at,deleted_at FROM properties')
    .all();

  const properties = results.map((r) => ({
    id: String(r.id),
    name: r.name || '', town: r.town || '', acres: r.acres || '',
    price: r.price || '', notes: r.notes || '',
    gates: safeParse(r.gates, {}), scores: safeParse(r.scores, {}),
    updated_at: r.updated_at || 0,
    deleted_at: r.deleted_at ?? null,
  }));

  return json({ properties, serverTime: Date.now() });
}

// POST /api/properties — upsert a batch. Last-write-wins on updated_at.
export async function onRequestPost(ctx) {
  let body;
  try { body = await ctx.request.json(); } catch { return json({ error: 'bad request' }, 400); }

  const list = Array.isArray(body?.properties) ? body.properties : null;
  if (!list) return json({ error: 'expected {properties: []}' }, 400);
  if (list.length > MAX_BATCH) return json({ error: 'too many properties in one request' }, 413);

  const stmt = ctx.env.DB.prepare(
    `INSERT INTO properties (id,name,town,acres,price,notes,gates,scores,updated_at,deleted_at)
       VALUES (?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(id) DO UPDATE SET
       name=excluded.name, town=excluded.town, acres=excluded.acres, price=excluded.price,
       notes=excluded.notes, gates=excluded.gates, scores=excluded.scores,
       updated_at=excluded.updated_at, deleted_at=excluded.deleted_at
     WHERE excluded.updated_at > properties.updated_at`
  );

  const batch = [];
  for (const p of list) {
    if (!p || p.id == null) continue;
    batch.push(stmt.bind(
      String(p.id),
      str(p.name), str(p.town), str(p.acres), str(p.price), str(p.notes),
      JSON.stringify(p.gates || {}), JSON.stringify(p.scores || {}),
      Number(p.updated_at) || 0,
      p.deleted_at ? Number(p.deleted_at) : null
    ));
  }

  if (batch.length) await ctx.env.DB.batch(batch);
  return json({ ok: true, count: batch.length, serverTime: Date.now() });
}
