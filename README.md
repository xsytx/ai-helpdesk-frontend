# AI Helpdesk — Frontend

React + Vite + TypeScript + Tailwind UI for the university AI assistant (Sprint 1 foundation).

## Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — use any `@sdu.edu.kz` email and a password (6+ chars) for demo login until the FastAPI JWT backend is connected.

## Brand assets

- `public/logo-icon.svg` — SDU mark (63×63) shown next to “AI Helpdesk” in the header
- `public/logo-full.svg` — full Figma export (mark + wordmark) if needed elsewhere

## Sprint 2 — Forum

- `/forum` — list threads (Top / Newest), create question
- `/forum/:threadId` — view thread, post answers, like answers (sorted by likes)
- Data: `localStorage` mock by default; set `VITE_MOCK_FORUM=false` to use API:
  - `GET /forum/threads?sort=top|newest`
  - `POST /forum/threads`
  - `GET /forum/threads/:id`
  - `GET /forum/threads/:id/answers`
  - `POST /forum/threads/:id/answers`
  - `POST /forum/answers/:id/like`

## Design fixes applied

- Avatar initials match author names (e.g. Jacob Bob → **JB**)
- Consistent **New Chat** label (desktop + mobile)
- Mobile tabs: Home, Forum, New Chat, FAQ, Profile (no placeholder “Label”)
- **Settings** stays on one line; campus link labeled **Maps**
- EN / KZ / RU language switcher
- Login: forgot password link, show/hide password, validation errors, loading state, stronger label contrast, focus rings

## Project structure

Matches `frontend-context.md`: `src/app`, `pages`, `features`, `entities`, `shared`.
