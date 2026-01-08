# Family Routine Clock - Requirements

## Overview
A visual routine planning app that helps navigate morning and evening family routines using a clock-based interface. Designed for two children (ages 5 and 8) and displayed on an iPad or digital picture frame.

## Family Context
- **Children**: 8-year-old (school) and 5-year-old (kindergarten)
- **Routines**: Morning (6:45-7:30) and Evening (TBD)
- **Language**: German interface (all labels and text in German)
- **Both children follow the same routine**

## Morning Routine Schedule

| Zeit | Dauer | Aufgabe | Farbe | Icon |
|------|-------|---------|-------|------|
| 6:45-7:15 | 30 min | Frühstück | 🔵 Blue (#2196F3) | 🥣 Bowl |
| 7:15-7:25 | 10 min | Zähne putzen | 🟢 Green (#4CAF50) | 🪥 Toothbrush |
| 7:25-7:30 | 5 min | Anziehen | 🟡 Yellow (#FFD700) | 👕 Clothing |
| 7:30 | - | Haus verlassen | - | 🚪 |

**Total duration**: 45 minutes (fits within one rolling hour view)
**Label format**: Icon only (no text)

## Core Visual Concept

### Clock Face Design (Rolling 60-Minute Window)
The app displays a real clock face with hour and minute hands, but uses a rolling 60-minute window for displaying task segments:

- **Real clock hands**:
  - **Stundenzeiger (hour hand)**: Shows actual hour (shorter, moves slowly)
  - **Minutenzeiger (minute hand)**: Shows actual minute (longer, moves continuously)
  - Helps children learn to read analog clock

- **Rolling 60-minute window**:
  - From the minute hand's current position, display the next 60 minutes of tasks
  - Example at 6:45: Window shows 6:45-7:45 (minute hand at 45, segments from 45 around to 45)
  - Example at 7:00: Window shows 7:00-8:00 (minute hand at 0, segments from 0 around to 0)
  - The minute hand acts like a "now line" that sweeps away the past and reveals the future

- **Colored task segments**:
  - Tasks are positioned relative to the minute hand's position
  - Each segment's color and position updates as time progresses
  - Segments "wrap around" the clock face (e.g., a 30-minute task starting at 6:45 goes from position 45, through 0, to position 15)

- **Standard minute markers**: Display 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55 around the clock face

### Example Visualization (at 6:50 Uhr)
```
        12 (0)
      /---\
    55     5  ← Frühstück (noch 25 min bis 7:15)
       \   /
    50 ●━━━━━● 10  ← Stundenzeiger zeigt auf ~7
       │ FRÜ│        Minutenzeiger zeigt auf 50
    45 │HSTK│ 15     (Window: 6:50-7:50)
       │    │
    40 ●━━━━● 20  ← Zähne putzen (7:15-7:25)
         │
    35   ●   25  ← Anziehen (7:25-7:30)
         30

Legende:
- Stundenzeiger: kurz, zeigt auf ~7
- Minutenzeiger: lang, zeigt auf 50 (JETZT)
- Von Minutenzeiger aus: nächste 60 Minuten = 6:50 bis 7:50
- Farbsegmente: relativ zum Minutenzeiger positioniert
```

## Key Requirements

### 1. Display Mode
- **Display-only interface**: No interaction required
- **Auto-updating**: Automatically advances based on real time
- **Auto-skip behavior**: Shows current task based on actual time (not dependent on previous task completion)
- Passive viewing experience like a wall clock

### 2. Time Management
- **Fixed schedule**: Same times every day
- **Rolling hour view**: Always displays current 60-minute window
- **Morning routine**: 6:45-7:30 (45 minutes)
- **Evening routine**: TBD
- Tasks positioned on clock face by their scheduled start time within the hour

### 3. Visual Design
- **Clock face**: Circular design with traditional clock appearance
- **Clock hands**:
  - Stundenzeiger (hour hand) - shorter, thicker
  - Minutenzeiger (minute hand) - longer, thinner
  - Both hands show actual current time
- **Task segments**: Colored wedges positioned relative to minute hand
  - Duration determines wedge size (e.g., 10-minute task = 60° wedge)
  - Segments positioned based on scheduled time relative to current minute
- **Minute markers**: Standard clock numbers (5, 10, 15, etc.) for educational value
- **Color coding**: Blue (Frühstück), Green (Zähne putzen), Yellow (Anziehen)
- **Labels**: Icon only on each segment (e.g., "🥣")
- **Digital time display**: Optional small digital time for additional clarity

### 4. Task Information
Each task includes:
- **Name**: Brief description in German (e.g., "Frühstück", "Zähne putzen")
- **Start time**: When task begins
- **Duration**: How long task should take
- **Color**: Unique color for visual identification

### 5. Educational Benefits
- Helps children learn to read analog clock
- Builds time awareness and time management skills
- Visual representation makes abstract time concept concrete
- Consistent minute markers reinforce time-telling practice

### 6. User Experience Goals
- **5-year-old can understand**: Simple enough for kindergartener
- **At-a-glance comprehension**: Instantly see what should be happening
- **No audio**: Purely visual (no sounds or notifications)
- **No parent nagging**: Kids can self-regulate using the display

## Technical Requirements

### Platform
- **Web application**: Runs in browser
- **Target devices**:
  - iPad (primary) - full-screen browser mode
  - Digital picture frame (secondary)
- **Responsive design**: Works in portrait or landscape
- **Minimal backend**: Can run as static site
- **Language**: German UI (all text, labels, and content in German)

### Tech Stack (Finalized)
- **Framework**: React + Vite
  - Fast, modern build tooling
  - Component-based architecture for clock + segments + hands
  - Optimized for older Android devices
  - Lightweight bundle size
- **Styling**: CSS (or Tailwind) for responsive design
- **Graphics**: SVG for clock face (scalable, sharp on all displays, resolution-independent)
- **Time library**: date-fns or Day.js (lightweight date/time utilities)
- **Configuration**: JSON file (`routines.json`) in repository
  - Editable directly on GitHub
  - No UI needed for editing
- **Deployment**:
  - GitHub Pages (free, reliable)
  - GitHub Actions for automated CI/CD
  - Deployed URL: `https://<username>.github.io/routine`
- **PWA Features**:
  - Installable on Android tablet (works like native app)
  - Offline-capable (service worker caching)
  - Fullscreen mode support

### Performance
- **Smooth animations**: Arc should sweep smoothly
- **Efficient updates**: Only re-render when minute changes
- **Low resource usage**: Suitable for always-on display

## Design Advantages Over Clock Face (12-hour)

This approach solves the original problems:

1. ✅ **Sufficient granularity**: 60-minute face gives precise 1-minute resolution
2. ✅ **No time overlap**: Rolling hour view means morning and evening routines don't conflict
3. ✅ **Educational value**: Uses real clock face to teach time-telling
4. ✅ **Visual time perception**: Filled arc provides Time Timer-style intuitive countdown
5. ✅ **Adapts to routine length**: Rolling view works whether routine is 30 min or 2 hours

## Out of Scope (MVP)

- Task check-offs or interaction
- Audio alerts or notifications
- Different routines per child
- Adjustable start times or schedule editing UI
- Weekday vs weekend modes
- Historical tracking or analytics
- Mobile app native features

## Next Steps

1. **Define exact routine**: Map out specific tasks with start times and durations
2. **Choose colors**: Select color scheme for task segments
3. **Design mockups**: Sketch clock face layout with example routine
4. **Build prototype**: Create basic working version
5. **Test with family**: Validate usability with both children
6. **Iterate**: Refine based on real-world use

## Open Questions

1. ✅ ~~Morning routine tasks & timing~~ - **DEFINED**: 6:45-7:30 (Frühstück, Zähne putzen, Anziehen)
2. ✅ ~~Color scheme~~ - **DEFINED**: Orange, Türkis, Lila
3. ✅ ~~Task labels~~ - **DEFINED**: Icons + Text
4. ✅ ~~Tech stack~~ - **DEFINED**: React + Vite, GitHub Pages, JSON config
5. ✅ ~~Configuration method~~ - **DEFINED**: JSON file, no UI editor needed
6. **Evening routine**: Out of scope for MVP, focus on morning only
7. **Outside routine hours**: What should display show when no routine is active (e.g., at 3:00 PM)?
   - Options: Empty clock, message "Keine Routine", or hide entirely?
