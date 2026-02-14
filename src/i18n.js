const de = {
  // Landing page
  landingTitle: 'Routinen-Uhr',
  landingSubtitle: 'Erstelle deine eigene Routinen-Uhr für den Familienalltag.',
  createNew: 'Neue Routine erstellen',

  // Editor
  editorTitle: 'Routine bearbeiten',
  morning: 'Morgenroutine',
  evening: 'Abendroutine',
  startTime: 'Startzeit',
  taskName: 'Aufgabe',
  duration: 'Dauer (Min.)',
  icon: 'Icon',
  color: 'Farbe',
  addTask: 'Aufgabe hinzufügen',
  addMorningRoutine: 'Morgenroutine hinzufügen',
  addEveningRoutine: 'Abendroutine hinzufügen',
  removeRoutine: 'Routine entfernen',
  save: 'Speichern',
  saving: 'Speichert...',
  saved: 'Gespeichert!',
  copyLink: 'Link kopieren',
  linkCopied: 'Link kopiert!',
  showClock: 'Zur Uhr',
  deleteTask: 'Entfernen',

  // Validation
  errorOverlap: 'Die Morgen- und Abendroutine überlappen sich zeitlich.',
  errorNoTasks: 'Füge mindestens eine Aufgabe hinzu.',
  errorNoName: 'Jede Aufgabe braucht einen Namen.',

  // Preview
  preview: 'Vorschau',
  previewPlay: 'Abspielen',
  previewPause: 'Pause',

  // Clock
  loading: 'Lade Routinen...',
  notFound: 'Routine nicht gefunden.',
  editRoutine: 'Bearbeiten',
}

export function t(key) {
  return de[key] || key
}
