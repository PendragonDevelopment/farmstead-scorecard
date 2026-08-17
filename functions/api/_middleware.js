import { verifyToken, getCookie, json, COOKIE_NAME } from '../../lib/auth.mjs';

// Endpoints reachable without a valid session.
const PUBLIC = new Set(['/api/login', '/api/session']);

export async function onRequest(ctx) {
  const { request } = ctx;
  if (request.method === 'OPTIONS') return ctx.next();

  const path = new URL(request.url).pathname;
  if (PUBLIC.has(path)) return ctx.next();

  const cookie = getCookie(request, COOKIE_NAME);
  const payload = cookie ? await verifyToken(ctx.env.AUTH_SECRET, cookie) : null;
  if (!payload) return json({ error: 'unauthorized' }, 401);

  return ctx.next();
}
