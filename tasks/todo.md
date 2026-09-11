# Suivi — Audit sécurité & accessibilité (docs/audit-2026-09-11.md)

Branche : `fix/security-accessibility-audit` (depuis `dev`). Un commit par lot.

## Lot 1 — Quick wins (9309d42)

- [x] S1 `sameSite: 'strict'` sur le cookie de session
- [x] S4 En-têtes de sécurité via `routeRules`
- [x] C1 `lang="fr"`
- [x] M6 `autocomplete="username"`
- [x] m3 `prefers-reduced-motion` global + garde confetti
- [x] m6 ✓/✗ en `aria-hidden`

## Lot 2 — Flashcards + quiz (065a44b)

- [x] C2 FlashCard en `<button aria-pressed>` + `aria-hidden` sur la face cachée
- [x] C3 Listener clavier enregistré/retiré de façon synchrone, plus de raccourci Espace global
- [x] C4 Feedback quiz dans une région `role="status"` permanente
- [x] M3 Type de quiz en `fieldset` de radios natifs, `aria-pressed` sur le filtre catégories
- [x] M4 Focus déplacé à chaque transition (titre de question, bouton suivant, résultats)
- [x] m2 `role="progressbar"`
- [x] Labels `for`/`id` du quiz, `<output>`, focus visible sur le curseur (M1/M5 partiels)
- Relu par l'agent accessibilité : aucune régression, oublis intégrés au lot 3

## Lot 3 — Contraste (f6449a2)

- [x] C7 Tokens `deep-teal-muted` et `terracotta-dark`, erreurs en `red-700`, résultats en `-800`
- [x] C7 `readableTextOn()` pour le texte sur couleurs de catégorie (11/11 ≥ 4,7:1)
- [x] M5 Bordures ≥ 3:1, pastilles délimitées, icône supprimer en `red-700`
- [x] m7 404 décoratif en `aria-hidden`
- [x] m1 (partiel) h3 → h2 sur flashcards, quiz, CategoryFilter

## Lot 4 — Admin (80d2dbd)

- [x] C5 `AdminModal` sur `<dialog>` natif (focus trap, Échap, restauration du focus, `alertdialog`)
- [x] C6 `aria-label` sur tous les boutons/liens icône, `aria-hidden` sur les SVG décoratifs
- [x] M1 Labels recherche/filtre, `aria-label` sur le color picker, aperçu du badge
- [x] M2 Erreurs de sauvegarde/suppression remontées en `role="alert"` (plus de `// TODO`)
- [x] M7 `<main>` sur toutes les pages, h1 de l'accueil = titre du hero
- [x] m4 `role="status"` sur les loaders
- [x] m5 Tableau : caption, `scope="col"`, ligne vide, `<nav>` pagination + `aria-current`
- [x] S7 Suppression de catégorie avec termes → 409
- [x] Testé en session admin réelle (Chrome) : focus initial dans la modale, Tab piégé, Échap ferme, focus rendu au bouton déclencheur, `alertdialog` sur les suppressions, erreurs réseau affichées en `role="alert"` sans fermer la modale, tableau/caption/pagination/état vide conformes

## Lot 5 — Durcissement (cf2e9e8)

- [x] S2 Rate limiting login (5 échecs / 15 min / IP, `Retry-After`)
- [x] S3 Comparaison en temps constant (`timingSafeEqual` sur SHA-256)
- [x] S5 Sessions liées à une empreinte du mot de passe (rotation = déconnexion)
- [x] S6 Parsing strict des IDs de route (`getIdParam`)
- [x] S1 (suite) Middleware `Origin` / `Sec-Fetch-Site` sur `/api/admin/*`
- [x] S4 (suite) CSP minimale `frame-ancestors 'none'; base-uri 'self'; object-src 'none'`
- [x] S8 `eslint`, `@nuxt/eslint`, `dotenv` en devDependencies, Dependabot, actions épinglées par SHA
- [x] SECURITY.md mis à jour

## Reste à faire (hors lots)

- [ ] CSP complète avec `script-src` (nonces Nuxt + domaines Vercel Analytics) — `nuxt-security` recommandé
- [ ] `ADMIN_PASSWORD_HASH` (argon2/bcrypt) à la place du mot de passe en clair dans l'env
- [ ] m8 Lien « Administration » et aide clavier masqués sous `sm`/`md` (reflow 200 %)
- [ ] Rate limiting durable via Vercel Firewall si plusieurs instances
- [ ] Test lecteur d'écran réel (VoiceOver) sur flashcards, quiz et admin
