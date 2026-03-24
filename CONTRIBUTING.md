# Contribuer à Luna·Prentissage

Merci de votre intérêt pour ce projet ! Voici comment contribuer.

## Prérequis

- [Node.js](https://nodejs.org/) >= 22
- [pnpm](https://pnpm.io/) >= 10
- Une base de données [Neon](https://neon.tech/) PostgreSQL (gratuit)

## Mise en place

1. **Fork** et clone le repo
2. Copiez `.env.example` vers `.env` et renseignez vos variables
3. Installez les dépendances : `pnpm install`
4. Lancez les migrations : `pnpm migrate`
5. Démarrez le serveur de développement : `pnpm dev`

## Workflow

1. Créez une branche depuis `main` : `git checkout -b feat/ma-feature`
2. Faites vos modifications
3. Vérifiez que tout passe :
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```
4. Commitez avec un message clair (en anglais de préférence)
5. Ouvrez une Pull Request vers `main`

## Conventions

- **UI en français**, code et commentaires techniques en anglais
- **Pas d'ORM** — requêtes SQL paramétrées uniquement
- **Composables Vue** pour la gestion d'état (pas de Vuex/Pinia)
- **pnpm** exclusivement comme gestionnaire de paquets
- Formatage via Prettier, lint via ESLint (configs incluses)

## Signaler un bug

Ouvrez une [issue](../../issues) avec :
- Description du problème
- Étapes pour reproduire
- Comportement attendu vs observé
- Environnement (navigateur, OS)

## Proposer une fonctionnalité

Ouvrez une issue avec le tag `enhancement` pour en discuter avant de coder.

## Code de conduite

Ce projet suit le [Contributor Covenant](CODE_OF_CONDUCT.md). En participant, vous vous engagez à respecter ces règles.
