const { verifySession } = require('./_session');

module.exports = async (req, res) => {
  const session = verifySession(req);
  if (!session) {
    res.status(401).json({ error: 'Nicht eingeloggt.' });
    return;
  }
  res.status(200).json({ name: session.name });
};
