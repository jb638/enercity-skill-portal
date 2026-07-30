// Gemeinsame Hilfsfunktionen für Login-Sessions.
// Kein Datenbank-Login nötig: Die Session ist ein signiertes Cookie,
// das serverseitig mit SESSION_SECRET geprüft wird.

const crypto = require('crypto');

const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

function sign(value) {
  const secret = process.env.SESSION_SECRET || 'change-me';
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    cookies[key] = decodeURIComponent(val);
  });
  return cookies;
}

function createSessionCookie(name) {
  const payload = `${name}|${Date.now()}`;
  const token = `${payload}.${sign(payload)}`;
  const maxAgeSeconds = THIRTY_DAYS_MS / 1000;
  return `session=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function verifySession(req) {
  const cookies = parseCookies(req);
  const token = cookies.session;
  if (!token) return null;

  const lastDot = token.lastIndexOf('.');
  if (lastDot === -1) return null;

  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);

  if (signature !== sign(payload)) return null;

  const [name, timestamp] = payload.split('|');
  if (!name || !timestamp) return null;

  const age = Date.now() - Number(timestamp);
  if (Number.isNaN(age) || age > THIRTY_DAYS_MS) return null;

  return { name };
}

module.exports = { createSessionCookie, verifySession, parseCookies };
