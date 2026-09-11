# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Luna-prentissage is a medical terminology learning app (French UI) built with **Nuxt 4 + Vue 3** (frontend) and **Nitro server routes + Neon PostgreSQL** (backend). Users study medical roots/prefixes/suffixes via flashcards and quizzes. An admin panel manages terminology.

## Commands

```bash
pnpm dev          # Dev server on http://localhost:3000
pnpm build        # Production build → .output/
pnpm preview      # Preview production build
pnpm typecheck    # TypeScript check
pnpm lint         # ESLint
pnpm lint:fix     # ESLint auto-fix
pnpm migrate      # Run database migrations
```

## Architecture

### Frontend (`app/`)

- **Nuxt 4** with file-based routing (`app/pages/`)
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin, config in `app/assets/css/main.css`
- **Composables** (`app/composables/`) for state management — no Vuex/Pinia:
  - `useAdminAuth` — session-based admin auth (login/logout/status)
  - `useCategories` — fetch and cache categories
  - `useTerms` — fetch, filter, and shuffle terms
  - `useQuiz` — quiz generation, scoring, answer tracking
  - `useTheme` — theme preference (`light` | `dark` | `system`), persisted in localStorage
- **Layouts** (`app/layouts/`): `default` (sidebar with nav, category list, theme switch) and `admin` (sidebar with admin nav); login and error screens opt out with `layout: false`. Layouts only read shared state; each page fetches the data it needs in `onMounted`
- **Components** (`app/components/`): `AppSidebar`, `AppWordmark`, `ThemeSwitch`, `FlashCard`, `QuizQuestion`, and `admin/` (`Modal`, `CategoryForm`, `TermForm`)
- **Theme**: light/dark tokens as CSS variables in `main.css` (`:root`, `[data-theme='dark']`, `prefers-color-scheme` fallback), exposed to Tailwind through `@theme inline`. An inline head script in `nuxt.config.ts` applies the stored choice before first paint; `plugins/theme.client.ts` mirrors it into `useTheme` after hydration
- **Category filter**: carried by the URL (`/flashcards?category=<id>`, `/quiz?category=<id>`) so the sidebar links and the pages stay in sync
- **Fonts**: Public Sans (UI), Newsreader italic (meanings, quiz prompts) via `@nuxt/fonts`
- **Shared classes** (`main.css`): `btn-primary|secondary|ghost|danger`, `field`, `label`, `hint`, `kicker`, `row`/`row-active`, `dot`

### Backend (`server/`)

- **Nitro server routes** under `server/api/` — file-based, method-suffixed (e.g., `index.get.ts`, `[id].delete.ts`)
- **Database**: Neon serverless PostgreSQL via `@neondatabase/serverless` — direct SQL with tagged template literals, no ORM
- **Auth**: H3 encrypted sessions (7-day cookie), single admin user from env vars
- **Utilities**:
  - `server/utils/db.ts` — cached DB connection
  - `server/utils/auth.ts` — session helpers
  - `server/utils/queries.ts` — all SQL CRUD operations (parameterized)

### API Structure

| Public                                    | Admin (session-protected)               |
| ----------------------------------------- | --------------------------------------- |
| `GET /api/categories`                     | `POST/PUT/DELETE /api/admin/categories` |
| `GET /api/terms` (filter by `categoryId`) | `POST/PUT/DELETE /api/admin/terms`      |
| `GET /api/terms/:id`                      | `POST /api/admin/auth/login\|logout`    |
|                                           | `GET /api/admin/auth/status`            |

### Key Types (`app/types/index.ts`)

- `Category` — id, name, color (hex), description
- `Term` — id, root, meaning, category_id
- `TermWithCategory` — Term + joined category_name/category_color
- `QuizQuestion` — multiple-choice or true-false with options/correctAnswer

## Environment Variables

Required in `.env` (see `.env.example`):

- `DATABASE_URL` — Neon PostgreSQL connection string
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — single admin credentials
- `SESSION_SECRET` — 32-char hex for H3 session encryption

These are read via `nuxt.config.ts` `runtimeConfig` (server-side private keys).

## Conventions

- **Language**: UI text is in French, code/technical terms in English
- **No ORM**: Raw parameterized SQL queries — keep it that way
- **Composables over stores**: State lives in Vue composables with `useState`
- **Package manager**: pnpm exclusively
