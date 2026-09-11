# Luna-Prentissage

A web application for learning medical terminology. Study medical roots, prefixes and suffixes through interactive flashcards and configurable quizzes.

> The application UI is in French. Internationalization (i18n) may be added later.

## Tech Stack

| Layer           | Technology                                                                   |
| --------------- | ---------------------------------------------------------------------------- |
| Framework       | [Nuxt 4](https://nuxt.com) (Vue 3, TypeScript)                               |
| Styling         | [Tailwind CSS 4](https://tailwindcss.com)                                    |
| Database        | [Neon PostgreSQL](https://neon.tech) (serverless)                            |
| Fonts           | Public Sans (UI), Newsreader italic (meanings) via `@nuxt/fonts`             |
| Auth            | H3 sessions (encrypted cookie, 7-day expiry), see [SECURITY.md](SECURITY.md) |
| Package manager | pnpm                                                                         |

## Prerequisites

- Node.js >= 22 (see `.node-version`)
- pnpm
- A PostgreSQL database ([Neon](https://neon.tech) recommended — free tier available)

## Installation

```bash
# Clone the repo
git clone git@github.com:manoz/luna-prentissage.git
cd luna-prentissage

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:pass@host.neon.tech:5432/dbname?sslmode=require"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your_secure_password"
SESSION_SECRET="random_32_char_hex_string"
NODE_ENV="development"
```

To generate a `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database

### Schema

Two tables with a `terms.category_id → categories.id` relationship (ON DELETE RESTRICT):

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL,        -- Hex color (#FF5733)
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE terms (
  id SERIAL PRIMARY KEY,
  root VARCHAR(255) NOT NULL,        -- Medical root (e.g., "arthro-")
  meaning VARCHAR(500) NOT NULL,     -- Its meaning (e.g., "joint")
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Migration

The migration script creates tables and seeds data from `docs/categories.json` and `docs/terms.json`:

```bash
pnpm migrate
```

The migration is idempotent (upsert on category name, `IF NOT EXISTS` on tables).

## Development

```bash
pnpm dev          # Dev server on http://localhost:3000
pnpm build        # Production build → .output/
pnpm preview      # Preview the production build
pnpm typecheck    # TypeScript check
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix
```

## Architecture

### Frontend (`app/`)

```
app/
├── layouts/
│   ├── default.vue          # Sidebar: navigation, category list, theme switch
│   └── admin.vue            # Sidebar: admin navigation, logout
├── pages/
│   ├── index.vue            # Home — overview and per-category shortcuts
│   ├── flashcards.vue       # Flashcard mode (reveal in place, series list, keyboard navigation)
│   ├── quiz.vue             # Quiz mode (MCQ, True/False, Mixed, results + confetti)
│   └── admin/
│       ├── login.vue        # Admin login (no layout)
│       ├── index.vue        # Admin dashboard
│       ├── categories.vue   # Category CRUD
│       └── terms.vue        # Term CRUD (paginated)
├── components/
│   ├── AppSidebar.vue       # Shared sidebar shell used by both layouts
│   ├── AppWordmark.vue      # Logo link
│   ├── ThemeSwitch.vue      # Light / dark / system radio group
│   ├── FlashCard.vue        # Term with meaning revealed on press
│   ├── QuizQuestion.vue     # Question display (MCQ or True/False)
│   └── admin/
│       ├── Modal.vue        # Native <dialog> wrapper
│       ├── CategoryForm.vue # Category form
│       └── TermForm.vue     # Term form
├── composables/
│   ├── useAdminAuth.ts      # Admin session login/logout/status
│   ├── useCategories.ts     # Fetch and cache categories
│   ├── useTerms.ts          # Fetch, filter and shuffle terms
│   ├── useQuiz.ts           # Quiz generation, scoring, tracking
│   └── useTheme.ts          # Theme preference persisted in localStorage
├── plugins/
│   └── theme.client.ts      # Loads the stored theme preference after hydration
├── middleware/
│   └── admin.ts             # Guard: redirects to /admin/login if unauthenticated
├── error.vue                # Error page (no layout)
└── assets/css/main.css      # Theme tokens (light/dark), Tailwind theme, shared classes
```

### Backend (`server/`)

```
server/
├── api/
│   ├── categories/index.get.ts       # GET /api/categories
│   ├── terms/
│   │   ├── index.get.ts              # GET /api/terms(?categoryId=N)
│   │   └── [id].get.ts               # GET /api/terms/:id
│   └── admin/                        # Session-protected endpoints
│       ├── auth/{login,logout,status} # Authentication
│       ├── categories/               # POST, PUT, DELETE
│       └── terms/                    # POST, PUT, DELETE
├── middleware/
│   └── csrf.ts                       # Same-origin check on state-changing admin requests
└── utils/
    ├── db.ts                         # Neon connection (singleton)
    ├── queries.ts                    # Parameterized SQL queries
    ├── validation.ts                 # Input validation helpers
    ├── params.ts                     # Numeric route parameter parsing
    ├── rate-limit.ts                 # Login attempt limiter (per IP)
    └── auth.ts                       # Session helpers (requireAdminAuth, etc.)
```

### API

| Method | Endpoint                    | Auth | Description                                  |
| ------ | --------------------------- | ---- | -------------------------------------------- |
| GET    | `/api/categories`           | No   | List all categories                          |
| GET    | `/api/terms`                | No   | List terms (optional filter `?categoryId=N`) |
| GET    | `/api/terms/:id`            | No   | Get a single term                            |
| POST   | `/api/admin/auth/login`     | No   | Login (`{ username, password }`)             |
| POST   | `/api/admin/auth/logout`    | Yes  | Logout                                       |
| GET    | `/api/admin/auth/status`    | Yes  | Check session                                |
| POST   | `/api/admin/categories`     | Yes  | Create a category                            |
| PUT    | `/api/admin/categories/:id` | Yes  | Update a category                            |
| DELETE | `/api/admin/categories/:id` | Yes  | Delete a category                            |
| POST   | `/api/admin/terms`          | Yes  | Create a term                                |
| PUT    | `/api/admin/terms/:id`      | Yes  | Update a term                                |
| DELETE | `/api/admin/terms/:id`      | Yes  | Delete a term                                |

## Design System

Light and dark themes share one set of CSS variables (`app/assets/css/main.css`), exposed to Tailwind 4 through `@theme inline`. The user picks light, dark or system in the sidebar; the choice is stored in `localStorage` and applied before first paint.

| Token     | Light     | Dark      | Usage                            |
| --------- | --------- | --------- | -------------------------------- |
| `paper`   | `#F5F6F5` | `#14181D` | Page background                  |
| `panel`   | `#ECEEEC` | `#0F1215` | Sidebar                          |
| `surface` | `#FFFFFF` | `#1D2329` | Fields, active rows, dialogs     |
| `ink`     | `#1A1D21` | `#E8EBEF` | Text                             |
| `accent`  | `#1F8A6B` | `#7FD1B9` | Meanings, primary actions, focus |
| `danger`  | `#C2373F` | `#F28B93` | Errors, destructive actions      |

Each category uses a custom color stored in the database (`color` field).

## Hosting

The app is designed to run on any platform that supports Nuxt/Nitro:

- **Vercel**: zero-config deployment (auto-detects Nuxt)
- **Netlify**: supported via Nitro preset
- **Node.js**: `pnpm build && node .output/server/index.mjs`

Environment variables to configure on the platform:

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`

## Medical Data

The initial dataset (`docs/`) contains ~180 terms across 11 categories covering nervous system, cardiovascular, nutrition, pathologies, surgical procedures, and more.

Additional terms can be added via the admin interface or directly in the JSON files before running the migration.

## License

[MIT](LICENSE)
