import { signToken, sessionCookie, timingSafeEqual, isSecure, json, SESSION_TTL_MS } from '../../lib/auth.mjs';

export async function onRequestPost(ctx) {
  let body;
  try { body = await ctx.request.json(); } catch { return json({ error: 'bad request' }, 400); }

  const supplied = body && typeof body.passphrase === 'string' ? body.passphrase : '';
  const real = ctx.env.APP_PASSPHRASE || '';
  if (!real || !ctx.env.AUTH_SECRET) return json({ error: 'server not configured' }, 500);
  if (!timingSafeEqual(supplied, real)) return json({ error: 'invalid passphrase' }, 401);

  const token = await signToken(ctx.env.AUTH_SECRET, { exp: Date.now() + SESSION_TTL_MS });
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie(token, { secure: isSecure(ctx.request) }) });
}
