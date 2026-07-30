const { verifySession } = require('./_session');
const skills = require('../lib/skills');

module.exports = async (req, res) => {
  const session = verifySession(req);
  if (!session) {
    res.status(401).json({ error: 'Bitte zuerst einloggen.' });
    return;
  }

  const list = Object.entries(skills).map(([id, skill]) => ({
    id,
    label: skill.label,
  }));

  res.status(200).json({ skills: list });
};
