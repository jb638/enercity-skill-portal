const Anthropic = require('@anthropic-ai/sdk');
const { verifySession } = require('./_session');
const skills = require('../lib/skills');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';

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

  const session = verifySession(req);
  if (!session) {
    res.status(401).json({ error: 'Bitte zuerst einloggen.' });
    return;
  }

  const body = parseBody(req);
  const { skillId, messages } = body;
  const skill = skills[skillId];

  if (!skill) {
    res.status(400).json({ error: 'Unbekannter Skill.' });
    return;
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Keine Nachricht übergeben.' });
    return;
  }

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: skill.systemPrompt,
      messages,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    res.status(200).json({ reply: textBlock ? textBlock.text : '' });
  } catch (err) {
    console.error('Anthropic API error:', err);
    res.status(500).json({ error: 'Fehler bei der Anfrage an Claude.' });
  }
};
