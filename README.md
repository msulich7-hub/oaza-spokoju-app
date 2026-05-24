# 🏠 Oaza Spokoju — AI Architecture Copilot

AI-powered dashboard for the "Oaza Spokoju" house project in Cieszyn, Poland.
Chat with a Cursor agent (Composer 2.5) that knows every dimension, elevation, and design decision of your project.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up API key
cp .env.local.example .env.local
# Edit .env.local — add your Cursor API key from https://cursor.com/dashboard/integrations

# 3. Run
npm run dev

# 4. Open http://localhost:7000
```

## Kontynuacja pracy

→ **`docs/HANDOFF_2026-05-24.md`** — stan na 24.05.2026 (eksperci 3 tryby, działka 4/5, backlog na jutro).

## What's Inside

- **AI Chat** — Talk to Composer 2.5 about your project in Polish. Full project context is injected on first message.
- **Panel ekspertów** — 50 ekspertów; tryby: **jeden ekspert**, **debata** (≥2), **idealny projekt** (ranking wariantów).
- **Warianty projektu** — Wklej link (Pinterest, ArchDaily, Houzz…), opisz intencję (np. „lustrzane odbicie”), zbuduj i zapisz wariant. Eksport JSON.
- **Floor Plans** — Interactive SVG floor plans for ground floor and upper floor (z transformacjami wariantu).
- **Plot Map** — Visualization of the building on the plot with setbacks, orientation, and neighbors.
- **Topography** — Terrain cross-section showing elevation changes across the plot.

## Workflow: link → wariant → recenzja

1. Zakładka **Warianty** → wklej URL projektu z internetu
2. Opisz intencję: np. `lustrzane odbicie bryły względem osi wschód-zachód`
3. **Zbuduj i zapisz wariant** — mapa działki i rzuty aktualizują się automatycznie
4. Zakładka **Eksperci** → wybierz tryb (jeden / debata / idealny projekt)
5. Porównaj warianty i eksportuj JSON dla architekta

## Tech Stack

- Next.js 15 + TypeScript
- **Cursor SDK** (`@cursor/sdk`) — Composer 2.5 agent in `plan` mode
- Tailwind CSS 4
- SVG for architectural drawings

## Architecture

```
src/
├── app/api/chat/route.ts         # SSE streaming → Cursor SDK
├── app/api/analyze-link/route.ts # Pobieranie metadanych z URL + detekcja transformacji
├── app/api/expert-session/route.ts # Jeden ekspert / debata / idealny projekt
├── app/api/review/route.ts       # (legacy) recenzja wszystkich ekspertów
├── data/experts.ts               # Persony ekspertów + wzorce UX 2026
├── lib/project-transforms.ts     # Lustrzane odbicie E↔W, N↔S
├── lib/expert-review.ts          # Silnik opinii ekspertów
├── hooks/useProjectVariants.ts   # Persistencja wariantów (localStorage)
└── components/
    ├── ExpertsPanel.tsx
    ├── VariantsPanel.tsx
    └── Dashboard.tsx
```

## Project Data

All project data is in `src/data/`:
- `project-context.ts` — Full context injected into agent prompt
- `rooms.ts` — Room definitions with coordinates for floor plans
- `karta-techniczna.md` — Complete plot technical card
- `komplet.md` — Master project file with all design decisions
