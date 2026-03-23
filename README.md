# Luna-Prentissage

Application web d'apprentissage de la terminologie médicale. Étudiez les radicaux, préfixes et suffixes médicaux via des flashcards interactives et des quiz configurables.

## Stack technique

| Couche | Technologie |
|--------|------------|
| Framework | [Nuxt 4](https://nuxt.com) (Vue 3, TypeScript) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Base de données | [Neon PostgreSQL](https://neon.tech) (serverless) |
| Fonts | Crimson Pro (serif), DM Sans (sans-serif) via `@nuxt/fonts` |
| Auth | Sessions H3 (cookie chiffré, 7 jours) |
| Package manager | pnpm |

## Pré-requis

- Node.js (version LTS — voir `.node-version`)
- pnpm
- Une base PostgreSQL ([Neon](https://neon.tech) recommandé — offre gratuite disponible)

## Installation

```bash
# Cloner le repo
git clone git@github.com:manoz/luna-prentissage.git
cd luna-prentissage

# Installer les dépendances
pnpm install

# Configurer l'environnement
cp .env.example .env
```

Éditez `.env` avec vos valeurs :

```env
DATABASE_URL="postgresql://user:pass@host.neon.tech:5432/dbname?sslmode=require"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="votre_mot_de_passe"
SESSION_SECRET="cle_aleatoire_32_caracteres"
NODE_ENV="development"
```

Pour générer un `SESSION_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Base de données

### Schéma

Deux tables avec une relation `terms.category_id → categories.id` (ON DELETE RESTRICT) :

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL,        -- Couleur hex (#FF5733)
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE terms (
  id SERIAL PRIMARY KEY,
  root VARCHAR(255) NOT NULL,        -- Le radical médical (ex: "arthro-")
  meaning VARCHAR(500) NOT NULL,     -- Sa signification (ex: "articulation")
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Migration

Le script de migration crée les tables et injecte les données depuis `docs/categories.json` et `docs/terms.json` :

```bash
pnpm migrate
```

La migration est idempotente (upsert sur le nom de catégorie, `IF NOT EXISTS` sur les tables).

## Développement

```bash
pnpm dev          # Serveur de dev sur http://localhost:3000
pnpm build        # Build de production (.output/)
pnpm preview      # Prévisualiser le build
pnpm typecheck    # Vérification TypeScript
pnpm lint         # ESLint
pnpm lint:fix     # ESLint avec auto-fix
```

## Architecture

### Frontend (`app/`)

```
app/
├── pages/
│   ├── index.vue            # Accueil — hero + grille de catégories
│   ├── flashcards.vue       # Mode flashcards (flip 3D, filtres, navigation clavier)
│   ├── quiz.vue             # Mode quiz (QCM, Vrai/Faux, Mixte, résultats + confetti)
│   └── admin/
│       ├── login.vue        # Connexion admin
│       ├── index.vue        # Dashboard admin
│       ├── categories.vue   # CRUD catégories
│       └── terms.vue        # CRUD termes (paginé)
├── components/
│   ├── FlashCard.vue        # Carte avec animation flip 3D
│   ├── CategoryFilter.vue   # Sidebar de filtrage par catégorie
│   ├── QuizQuestion.vue     # Affichage question (QCM ou Vrai/Faux)
│   └── admin/
│       ├── CategoryForm.vue # Formulaire catégorie
│       └── TermForm.vue     # Formulaire terme
├── composables/
│   ├── useAdminAuth.ts      # Login/logout/status session admin
│   ├── useCategories.ts     # Fetch et cache des catégories
│   ├── useTerms.ts          # Fetch, filtre et mélange des termes
│   └── useQuiz.ts           # Génération de quiz, scoring, tracking
├── middleware/
│   └── admin.ts             # Guard : redirige vers /admin/login si non authentifié
└── assets/css/main.css      # Thème Tailwind (@theme) + fonts globales
```

### Backend (`server/`)

```
server/
├── api/
│   ├── categories/index.get.ts       # GET /api/categories
│   ├── terms/
│   │   ├── index.get.ts              # GET /api/terms(?categoryId=N)
│   │   └── [id].get.ts               # GET /api/terms/:id
│   └── admin/                        # Endpoints protégés par session
│       ├── auth/{login,logout,status} # Authentification
│       ├── categories/               # POST, PUT, DELETE
│       └── terms/                    # POST, PUT, DELETE
└── utils/
    ├── db.ts                         # Connexion Neon (singleton)
    ├── queries.ts                    # Requêtes SQL paramétrées
    └── auth.ts                       # Helpers session (requireAuth, etc.)
```

### API

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/api/categories` | Non | Liste toutes les catégories |
| GET | `/api/terms` | Non | Liste les termes (filtre optionnel `?categoryId=N`) |
| GET | `/api/terms/:id` | Non | Détail d'un terme |
| POST | `/api/admin/auth/login` | Non | Connexion (`{ username, password }`) |
| POST | `/api/admin/auth/logout` | Oui | Déconnexion |
| GET | `/api/admin/auth/status` | Oui | Vérifier la session |
| POST | `/api/admin/categories` | Oui | Créer une catégorie |
| PUT | `/api/admin/categories/:id` | Oui | Modifier une catégorie |
| DELETE | `/api/admin/categories/:id` | Oui | Supprimer une catégorie |
| POST | `/api/admin/terms` | Oui | Créer un terme |
| PUT | `/api/admin/terms/:id` | Oui | Modifier un terme |
| DELETE | `/api/admin/terms/:id` | Oui | Supprimer un terme |

## Design system

Trois couleurs définies dans `@theme` (Tailwind 4) :

| Token | Hex | Usage |
|-------|-----|-------|
| `warm-cream` | `#FAF9F6` | Fond de page |
| `deep-teal` | `#2D5F5D` | Texte principal, boutons, accents |
| `terracotta` | `#C1666B` | Alertes, actions destructives, accents secondaires |

Les catégories utilisent chacune une couleur personnalisée stockée en base (champ `color`).

## Hébergement

L'application est conçue pour tourner sur n'importe quelle plateforme supportant Nuxt/Nitro :

- **Vercel** : déploiement zero-config (auto-détecte Nuxt)
- **Netlify** : supporté via le preset Nitro
- **Node.js** : `pnpm build && node .output/server/index.mjs`

Variables d'environnement à configurer sur la plateforme :
- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`

## Données médicales

Le jeu de données initial (`docs/`) contient ~180 termes répartis en 11 catégories :

- Système Nerveux et Motricité
- Système Cardio-Respiratoire
- Nutrition
- Constituance, État
- Couleurs
- Homéostasie
- Organisation et Fonctionnement
- Nombres, Quantités, Position, Forme
- Pathologies et traitements
- Gestes Chirurgicaux
- Analyses, Examens

Les termes supplémentaires peuvent être ajoutés via l'interface admin ou directement dans les fichiers JSON avant migration.

## Licence

[MIT](LICENSE)
