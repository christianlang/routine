# Routinen-Uhr

Eine visuelle Routinen-Planungs-App für Familien mit rollender 60-Minuten-Ansicht.

## Features

- 🕐 Rollende 60-Minuten-Ansicht mit echter Uhr (Stunden- und Minutenzeiger)
- 🎨 Farbige Segmente für verschiedene Aufgaben
- 📱 Optimiert für Tablets und digitale Bilderrahmen
- 🇩🇪 Vollständig auf Deutsch
- ⚡ PWA-fähig (installierbar, offline-fähig)

## Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev

# Build für Produktion
npm run build
```

## Konfiguration

Routinen können in `public/routines.json` angepasst werden:

```json
{
  "morning": {
    "startTime": "06:45",
    "endTime": "07:30",
    "tasks": [
      {
        "name": "Frühstück",
        "startTime": "06:45",
        "duration": 30,
        "color": "#FF9500",
        "icon": "🍳"
      }
    ]
  }
}
```

## Deployment

Die App wird automatisch auf GitHub Pages deployed bei jedem Push auf `main`.

## Tech Stack

- React 18
- Vite 6
- date-fns
- SVG für Grafiken
