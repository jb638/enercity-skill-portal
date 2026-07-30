const { createSessionCookie } = require('./_session');

// Format der Umgebungsvariable ACCESS_CODES:
// "code1:Name1,code2:Name2,code3:Name3"
function getAccessCodes() {
  const raw = process.env.ACCESS_CODES || '';
  const map = {};
  raw.split(',').forEach((pair) => {
    const [code, name] = pair.split(':').map((s) => (s || '').trim());
    if (code) map[code] = name || code;
  });
  return map;
}

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body || '{}');
  } catch (e) {
    return {};
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = parseBody(req);
  const code = (body.code || '').trim();

  if (!code) {
    res.status(400).json({ error: 'Bitte einen Zugangscode eingeben.' });
    return;
  }

  const codes = getAccessCodes();
  const name = codes[code];

  if (!name) {
    res.status(401).json({ error: 'Ungültiger Zugangscode.' });
    return;
  }

  res.setHeader('Set-Cookie', createSessionCookie(name));
  res.status(200).json({ ok: true, name });
};
