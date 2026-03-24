# Contributing to Luna·Prentissage

Thanks for your interest in this project! Here's how to contribute.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [pnpm](https://pnpm.io/) >= 10
- A [Neon](https://neon.tech/) PostgreSQL database (free tier available)

## Setup

1. **Fork** and clone the repo
2. Copy `.env.example` to `.env` and fill in your values
3. Install dependencies: `pnpm install`
4. Run migrations: `pnpm migrate`
5. Start the dev server: `pnpm dev`

## Workflow

1. Create a branch from `main`: `git checkout -b feat/my-feature`
2. Make your changes
3. Make sure everything passes:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```
4. Commit with a clear message (in English)
5. Open a Pull Request against `main`

## Conventions

- **Application UI is in French** — code and technical comments in English
- **No ORM** — parameterized SQL queries only
- **Vue composables** for state management (no Vuex/Pinia)
- **pnpm** exclusively as the package manager
- Formatting via Prettier, linting via ESLint (configs included)

## Reporting a Bug

Open an [issue](../../issues) with:

- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment (browser, OS)

## Suggesting a Feature

Open an issue with the `enhancement` label to discuss before coding.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold these standards.
