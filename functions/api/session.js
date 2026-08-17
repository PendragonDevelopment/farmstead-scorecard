import { verifyToken, getCookie, json, COOKIE_NAME } from '../../lib/auth.mjs';

export async function onRequestGet(ctx) {
  const cookie = getCookie(ctx.request, COOKIE_NAME);
  const payload = cookie ? await verifyToken(ctx.env.AUTH_SECRET, cookie) : null;
  return json({ authed: !!payload });
}
