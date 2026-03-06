const translations = {
  de: {
    // Landing page
    landingTitle: 'Routinen-Uhr',
    landingSubtitle: 'Erstelle deine eigene Routinen-Uhr für den Familienalltag.',
    createNew: 'Neue Routine erstellen',
    or: 'oder',
    loadExisting: 'Bestehende Routine laden',
    loadPlaceholder: 'Link oder ID einfügen',
    loadButton: 'Laden',
    loadError: 'Ungültiger Link oder ID.',

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
    saveAndShow: 'Speichern & zur Uhr',
    saving: 'Speichert...',
    saved: 'Gespeichert!',
    cancel: 'Abbrechen',
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

    // Misc / new keys
    testModeBanner: 'Test-Modus: Zeit simuliert',
    until: 'bis',
    errorSaveFailed: 'Speichern fehlgeschlagen. Bitte versuche es erneut.',

    // Theme toggle
    themeDark: 'Dunkel',
    themeLight: 'Hell',
    themeAuto: 'Auto',
    themeTitle: 'Design',
  },
  en: {
    // Landing page
    landingTitle: 'Routine Clock',
    landingSubtitle: 'Create your own routine clock for family life.',
    createNew: 'Create new routine',
    or: 'or',
    loadExisting: 'Load existing routine',
    loadPlaceholder: 'Paste link or ID',
    loadButton: 'Load',
    loadError: 'Invalid link or ID.',

    // Editor
    editorTitle: 'Edit routine',
    morning: 'Morning routine',
    evening: 'Evening routine',
    startTime: 'Start time',
    taskName: 'Task',
    duration: 'Duration (min)',
    icon: 'Icon',
    color: 'Color',
    addTask: 'Add task',
    addMorningRoutine: 'Add morning routine',
    addEveningRoutine: 'Add evening routine',
    removeRoutine: 'Remove routine',
    save: 'Save',
    saveAndShow: 'Save & show clock',
    saving: 'Saving...',
    saved: 'Saved!',
    cancel: 'Cancel',
    copyLink: 'Copy link',
    linkCopied: 'Link copied!',
    showClock: 'Show clock',
    deleteTask: 'Remove',

    // Validation
    errorOverlap: 'Morning and evening routines overlap in time.',
    errorNoTasks: 'Add at least one task.',
    errorNoName: 'Every task needs a name.',

    // Preview
    preview: 'Preview',
    previewPlay: 'Play',
    previewPause: 'Pause',

    // Clock
    loading: 'Loading routines...',
    notFound: 'Routine not found.',
    editRoutine: 'Edit',

    // Misc / new keys
    testModeBanner: 'Test mode: simulated time',
    until: 'until',
    errorSaveFailed: 'Save failed. Please try again.',

    // Theme toggle
    themeDark: 'Dark',
    themeLight: 'Light',
    themeAuto: 'Auto',
    themeTitle: 'Theme',
  },
}

const SUPPORTED_LANGUAGES = ['en', 'de']

function detectLanguageAndLocale() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { language: 'en', locale: 'en-US' }
  }

  const candidates = []
  if (Array.isArray(navigator.languages)) {
    candidates.push(...navigator.languages)
  }
  if (navigator.language) {
    candidates.push(navigator.language)
  }

  for (const candidate of candidates) {
    if (!candidate) continue
    const [base] = candidate.toLowerCase().split('-')
    if (SUPPORTED_LANGUAGES.includes(base)) {
      return { language: base, locale: candidate }
    }
  }

  return { language: 'en', locale: 'en-US' }
}

const { language: detectedLanguage, locale: detectedLocale } = detectLanguageAndLocale()

export function getCurrentLanguage() {
  return detectedLanguage
}

export function getCurrentLocale() {
  return detectedLocale
}

export function t(key) {
  const lang = detectedLanguage in translations ? detectedLanguage : 'en'
  const dict = translations[lang] || translations.en
  return dict[key] || translations.en[key] || key
}
