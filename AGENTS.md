 # Routine Clock – AGENTS Guide

 This file describes how AI assistants should collaborate on the `routine-clock` project.

 ---

 ## Purpose of this document

 - **Capture the mental model** of the Family Routine Clock (what it is, who it serves, and its constraints).
 - **Explain the architecture and conventions** so agents can safely extend the app.
 - **Record collaboration preferences** so responses stay consistent across sessions.

 Treat this as the single source of truth for how to work on this repo; keep it updated when requirements change.

 ---

 ## Project overview

 **What this is**: A **visual routine planning app** that shows morning and evening family routines on an analog clock with a **rolling 60‑minute window**. It is intentionally **display‑only** (no interactive checklists) and is designed to run full‑screen on an **iPad or digital photo frame** as a persistent “wall clock”.

 **Who it is for**:

 - Children (approx. between 5 and 10 years old), sharing the **same routine**.
 - Parents want to reduce nagging and give kids a **self‑service way** to see “what should be happening now”.

 **Core behavior** (from `README.md` and `REQUIREMENTS.md`):

 - **Morning routine** (approx. 06:45–07:30) and **evening routine** (approx. 18:00–19:30).
 - Tasks have **start times, durations, colors, and icons**; labels on the clock face are **icons only**.
 - The clock shows:
   - Real **hour and minute hands** (educational: learn analog time).
   - A **rolling 60‑minute window** anchored at the current minute.
   - **Colored task wedges** for tasks that:
     - Are currently running,
     - Start soon, or
     - Finished within the last ~15 minutes (grace period).
 - There is also a **task list** beside the clock that shows the full routine with an “active” highlight.
 - The experience is **purely visual** – no sounds, no notifications, no gamification.

 The goal is **at‑a‑glance comprehension**: a 5‑year‑old should be able to tell “what should I be doing now?” within a second or two.

 ---

 ## Core concepts & data model

 **Routines and tasks** (as used in Firestore and in the editor):

 - A **routine** (e.g. `morning`, `evening`) has:
   - `startTime: "HH:MM"` (e.g. `"06:45"` or `"18:00"`),
   - `tasks: Task[]`,
   - derived `endTime` when building the data for display.
 - A **task** has:
   - `name` (German label, used in the editor and task list),
   - `duration` in minutes,
   - `icon` (emoji, shown on the clock segment and in the list),
   - `color` (hex string, used for segment and list styling),
   - derived `startTime` when computing the final schedule.

 **Visibility & timing rules** (`src/utils/timeUtils.js`):

 - Time is normalized to **minutes since midnight**.
 - A task is **visible on the clock** if:
   - It **ends within the next 60 minutes**, or
   - It is **currently running**, or
   - It **ended less than 15 minutes ago**.
 - This prevents overfilled clocks while still:
   - Always showing the current task,
   - Giving a short grace period for recently finished tasks,
   - Showing only near‑term upcoming tasks.
 - The **active routine** is chosen by checking which of `morning` / `evening` has any visible tasks in the current 60‑minute window.

 **Important invariants** (enforced in `Editor.jsx`):

 - Each routine must have **at least one task**.
 - Each task must have a **non‑empty name**.
 - `morning` and `evening` **must not overlap in absolute time** (minutes since midnight).
 - Start times for tasks are **derived sequentially** from the routine `startTime` plus `duration`s – they are not user‑editable individually.

 If you change how timing or visibility works, update **both** the editor validation and the clock utilities so they stay consistent.

 ---

 ## User flows & URLs

 **Hash‑based routing** (in `src/App.jsx`):

 - `#/` (no ID and no stored `routineId`) → **Landing page** where the user can:
   - Create a new routine.
   - Load an existing routine by ID or link.
 - `#/new` → **Editor** for creating a new routine from defaults.
 - `#/:id` → **Clock view** for a specific routine document.
 - `#/:id/edit` → **Editor** for an existing routine.

 Additional URL behaviors:

 - `?id=:id` query param:
   - Used so a pinned home‑screen shortcut can keep its ID;
   - On first load it is migrated into `localStorage` and converted to a `#/:id` hash.
 - `?time=HH:MM`:
   - Enables **time simulation mode** (e.g. ``/routine/?time=07:00``).
   - In this mode, time advances in memory and a small banner indicates “Test‑Modus: Zeit simuliert”.

 Future agents should **preserve these URL behaviors**; if you change routing, keep backwards compatibility with existing shared links where possible.

 ---

 ## Tech stack & architecture

 **Frontend & build**:

 - **React 18** (functional components, hooks).
 - **Vite 6** (`npm run dev`, `npm run build`).
 - Styles with plain **CSS** files per component (e.g. `Clock.css`, `TaskList.css`, `Editor.css`).
 - **SVG** used for the clock face and hands (`Clock.jsx`, `ClockHands.jsx`, `TaskSegments.jsx`).

 **Time & logic**:

 - Lightweight time helpers in `src/utils/timeUtils.js` (minutes‑since‑midnight, rolling window, routine selection).
 - Additional heuristics for automatic icons/colors in `src/utils/taskDefaults.js` (German & English keywords).

 **Persistence & backend**:

 - **Firebase Firestore** via `src/firebase.js`:
   - App initialized with a fixed `firebaseConfig` object (project: `routine-clock`).
   - Routines stored in a `routines` collection.
   - Helpers:
     - `loadRoutine(id)` → fetch document data,
     - `saveRoutine(id, data)` → overwrite with `lastModified` timestamp,
     - `createRoutine(data)` → add new document with `createdAt` / `lastModified` and return ID.
   - Firestore uses **persistent local cache** (works well for occasionally offline tablets).
 - Important guidance:
   - **Do not change** the `firebaseConfig` or collection name unless explicitly requested.
   - If secrets need to be rotated or externalized, propose an `.env`‑based setup but **do not commit secrets**.

 **Internationalization**:

 - `src/i18n.js` contains a simple German string map and `t(key)` helper.
 - UI text is **German‑only** right now; the rest of the code, comments, and identifiers are in English.
 - When adding new UI text:
   - Add a key to the `de` object.
   - Use `t('yourKey')` in components instead of hard‑coding text.

 **PWA & deployment**:

 - Configured as a **PWA‑capable** app:
   - `public/manifest.json` and `public/sw.js` are present to support installability and offline caching.
 - Deployment is to **GitHub Pages** on each push to `main` (see `README.md`).
 - Target use is **always‑on display**, so:
   - Keep CPU/GPU usage low.
   - Avoid heavy animations or unnecessary re‑renders (time updates only once per second in clock view).

 ---

 ## How future AI agents should help

 - **Bias for small, safe improvements**:
   - Respect the existing architecture (React + Firestore + SVG clock).
   - Prefer incremental changes over sweeping rewrites.
 - **Clock & visualization changes**:
   - Keep the **rolling 60‑minute window** semantics unless the requirements explicitly change.
   - Maintain the educational value: analog clock hands, minute markers, and clear segment colors.
 - **Routine editor changes**:
   - Preserve validation rules (no overlaps, non‑empty names, sequential timing).
   - Ensure the editor and clock remain consistent in how they interpret routine data.
 - **New features**:
   - Align with **“display‑only, low‑cognitive‑load”** goals.
   - If adding interactions (e.g., settings, profiles), isolate them from the main display and keep them parent‑friendly.

 When requirements and code disagree, **prefer the written requirements** in `REQUIREMENTS.md` but call out the discrepancy in the summary.

 ---

 ## Code style & quality expectations

 - **Follow local conventions**:
   - Use functional React components and hooks.
   - Match existing file organization (`components/`, `utils/`, `firebase.js`, `i18n.js`).
   - Keep files focused; extract helpers into `utils` if they grow.
 - **Dependencies**:
   - Current runtime dependencies are small: `react`, `react-dom`, `date-fns`, `firebase`.
   - Avoid adding new dependencies unless they clearly reduce complexity or address a concrete need; explain trade‑offs in your summary.
 - **Comments**:
   - Only for non‑obvious decisions, invariants, or constraints (e.g., timing rules, performance trade‑offs).
   - Do not narrate straightforward logic.
 - **Performance**:
   - Remember this runs continuously on resource‑constrained tablets.
   - Avoid expensive per‑frame computations; prefer `useMemo`/`useEffect` where appropriate.

 There is currently no dedicated test suite; for critical logic changes (e.g., timing/visibility rules), consider proposing minimal tests (e.g., with Vitest) before adding a full testing stack.

 ---

 ## Git & workflow preferences

 - **Safety**:
   - Do **not** run destructive git commands (`reset --hard`, `push --force`, history rewrites) unless explicitly requested.
   - Do **not** commit secrets (Firebase keys are public‑ish, but any private keys, tokens, or `.env` contents must stay uncommitted).
 - **Commits & PRs** (when asked to make them):
   - Use clear, purpose‑driven commit messages focused on the “why”.
   - Group related changes together; avoid mixing refactors with functional changes without explanation.
   - If a change touches UX and logic, call that out explicitly.

 If a change requires schema or data migrations for existing routines, describe the impact and any manual steps in the summary.

 ---

 ## Communication preferences

 - **Tone & style**:
   - Be concise but precise; assume the user is comfortable with technical depth.
   - Use headings and bullet points, especially when summarizing changes or plans.
   - Use code blocks for non‑trivial code or commands; avoid pasting huge files when a focused snippet will do.
 - **Sessions**:
   - At the start of a substantial change, briefly outline your approach.
   - At the end, provide a short summary of what changed, any trade‑offs, and follow‑up ideas.
 - **Formatting**:
   - Avoid emojis unless explicitly requested.
   - Prefer explaining domain‑specific behavior (e.g., why a task is visible on the clock) over generic descriptions of React mechanics.

 Future agents should treat this file as the “contract” for how to behave in this repo and update it when major design decisions or workflows change.

 # Routine – AGENTS Guide

 This file describes how AI assistants should collaborate on the `routine` project.
 Cursor will automatically surface this to agents in future sessions.

 ---

 ## Purpose

 - Share a quick mental model of the project.
 - Capture collaboration preferences and expectations.
 - Avoid repeating the same explanations in every session.

 You can edit this file any time as your preferences or the project evolve.

 ---

 ## Project overview

 _Fill this in with a short description of what `routine` does, key features, and primary users._

 Suggested prompts:

 - What problem does this project solve?
 - Who uses it and how often?
 - What are the most critical flows or components?

 ---

 ## Tech stack

 _Replace this section with the actual stack once confirmed._

 - Languages: _(e.g., TypeScript, Python, Go)_
 - Frameworks: _(e.g., Next.js, Express, Django, React Native)_
 - Data/storage: _(e.g., Postgres, Redis, S3, SQLite)_
 - Infrastructure: _(e.g., Vercel, Render, Fly.io, Kubernetes)_

 If multiple apps or services exist, briefly list each one and its role.

 ---

 ## How AI should help here

 - **Bias for action**: When in doubt, propose a concrete plan and, if reasonable, go ahead and implement it.
 - **Summaries**: Keep explanations and final summaries concise but specific enough that changes are easy to audit.
 - **Tests & safety**:
   - Prefer changes that are easy to test.
   - When introducing non-trivial logic, include or update tests where practical.
 - **Respect existing patterns**:
   - Match the existing conventions and architecture before introducing new tools or patterns.
   - Prefer incremental improvements over large rewrites unless explicitly requested.

 ---

 ## Code style & quality expectations

 - Follow the existing style in each file (naming, formatting, patterns).
 - Avoid adding dependencies unless clearly beneficial; explain trade-offs when you do.
 - Keep functions and components focused; prefer small, composable pieces.
 - Add comments only for non-obvious intent, constraints, or trade-offs (not to narrate what the code does).

 If the project has linters or formatters configured, run or respect them when making changes.

 ---

 ## Git & workflow preferences

 - Do **not** run destructive git commands (e.g., `reset --hard`, `push --force`) unless explicitly asked.
 - Do **not** commit secrets or credentials (API keys, `.env` contents, etc.).
 - When asked to create commits or PRs:
   - Write clear, purpose-focused commit messages.
   - Group related changes together; avoid mixing unrelated refactors with feature work.

 ---

 ## Communication preferences

 - Use clear headings and bullets in explanations.
 - Use code blocks for any non-trivial snippets or commands.
 - Assume the user is comfortable with technical detail, but default to concise answers.
 - Avoid emojis unless explicitly requested.

 You can refine this section over time (for example, to request more or less explanation, or to set preferences around architectural choices).

