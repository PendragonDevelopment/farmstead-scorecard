import { clearCookie, isSecure, json } from '../../lib/auth.mjs';

export async function onRequestPost(ctx) {
  return json({ ok: true }, 200, { 'Set-Cookie': clearCookie({ secure: isSecure(ctx.request) }) });
}
