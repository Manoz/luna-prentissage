# Suivi — Audit sécurité & accessibilité (docs/audit-2026-09-11.md)

## Lot 1 — Quick wins

- [x] S1 `sameSite: 'strict'` sur le cookie de session (`server/utils/auth.ts`)
- [x] S4 En-têtes de sécurité via `routeRules` (`nuxt.config.ts`)
- [x] C1 `lang="fr"` (`nuxt.config.ts`)
- [x] M6 `autocomplete="username"` (`app/pages/admin/login.vue`)
- [x] m3 `prefers-reduced-motion` global + garde confetti (`main.css`, `quiz.vue`)
- [x] m6 ✓/✗ en `aria-hidden` (`QuizQuestion.vue`)
- [x] Doublon de transition FlashCard supprimé

Vérifié : lint, typecheck, format, build, puis curl sur le build de prod (headers présents, `<html lang="fr">`, `SameSite=Strict` sur `admin-session`).

Non fait dans ce lot : vérification `Origin` sur `/api/admin/*` (ceinture-bretelles de S1), CSP (S4). Reportés au lot 5.

## Lot 2 — Flashcards + quiz (C2, C3, C4, M3, M4, m2)

- [ ] À faire

## Lot 3 — Contraste (C7, M5, m7)

- [ ] À faire

## Lot 4 — Admin (C5, C6, M1, M2, M7, m4, m5, S7)

- [ ] À faire

## Lot 5 — Durcissement (S2, S3, S5, S6, S8, Origin check, CSP)

- [ ] À faire
