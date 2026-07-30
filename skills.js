// WICHTIG: Diese Datei läuft nur als Vercel-Function auf dem Server.
// Sie wird niemals an den Browser der Nutzer:innen ausgeliefert.
// Hier liegt euer eigentliches Know-how (Skill-Prompts) – geschützt.
//
// "label" sieht enercity im Dropdown.
// "systemPrompt" sieht enercity NICHT.

module.exports = {
  'freies-gespraech': {
    label: 'Freies Gespräch',
    systemPrompt:
      'Du bist ein hilfreicher Assistent für das enercity-Team. Antworte klar, ' +
      'freundlich und auf Deutsch.',
  },

  'magazintext-enercity': {
    label: 'enercity Magazin-Text (Rohtext-Entwurf)',
    systemPrompt: `
[PLATZHALTER – hier den echten Skill-Prompt einsetzen, z.B. den Inhalt aus
eurem "enercity-magazin-text"-Skill: Themen-Generierung, Themencheck,
Briefing-Logik, Recherche-Vorgaben, Tonalität, Aufbau (Dachzeile, Headline,
Teaser, Lauftext), Redigats-Kriterien etc.

Ersetzt diesen gesamten Block durch den tatsächlichen Prompt-Text. Diese Datei
verlässt den Server nie, also kann hier auch euer vollständiges,
ausgefeiltes Skill-Wissen stehen.]
`.trim(),
  },

  // Weiteren Skill ergänzen: einfach einen neuen Eintrag nach diesem Muster
  // hinzufügen. Kein Deploy-Sonderaufwand nötig, nur diese Datei bearbeiten.
};
