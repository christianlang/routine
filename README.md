# Routine Clock

A visual routine planning app for families with a rolling 60-minute window view.

## Features

- 🕐 Rolling 60-minute window with real clock (hour and minute hands)
- 🎨 Color-coded segments for different tasks
- 🌅 Multiple routines (morning, evening) with automatic switching
- 📋 Task list showing current and upcoming activities
- 📱 Optimized for tablets and digital photo frames
- 🌍 English and German UI, language chosen automatically from browser settings
- 🌍 Fully localizable via JSON configuration
- ⚡ PWA-capable (installable, offline-ready)
- 🧪 Time simulation mode for testing

## Demo

Try it with time simulation:
- Morning routine: `http://localhost:5173/routine/?time=07:00`
- Evening routine: `http://localhost:5173/routine/?time=18:30`

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Configuration

Routines can be customized in `public/routines.json`:

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
        "icon": "🥣"
      }
    ]
  },
  "evening": {
    "startTime": "18:00",
    "endTime": "19:30",
    "tasks": [
      {
        "name": "Abendessen",
        "startTime": "18:00",
        "duration": 30,
        "color": "#FF9500",
        "icon": "🍽️"
      }
    ]
  }
}
```

### Configuration Options

- `name`: Task name (any language)
- `startTime`: Start time in HH:MM format
- `duration`: Duration in minutes
- `color`: Hex color code
- `icon`: Emoji icon

### Visibility Logic

Tasks are displayed when:
- They start within the next 45 minutes
- OR they are currently running
- OR they ended less than 15 minutes ago

## Deployment

The app is automatically deployed to GitHub Pages on every push to `main`.

## Tech Stack

- React 18
- Vite 6
- date-fns
- SVG graphics
