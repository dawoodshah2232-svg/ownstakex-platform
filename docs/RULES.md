# OwnStakeX — Coding rules

## Stack (non-negotiable)
- Backends are **MySQL + PHP only** (cPanel hosting). No Supabase/Postgres, no Node backends.
- Frontend: React 18 + Vite. Backend: Laravel 10 on PHP 8.1 (`config.platform.php` pinned).

## Before writing code
- `git fetch origin` + pull latest `main` first. Never work from or push from a stale copy.
- Read this `docs/` folder first (PRD/ARCHITECTURE/DESIGN/TASKS/MEMORY) — continue, don't restart.
- Inspect before editing: branch, `git status`, `git diff`, recent commits.

## After editing
- Frontend: `npm run build` + `npm run lint` must pass. Backend: keep PHPUnit green.
- `git diff --check`. Report whether safe to deploy.
- Never claim success before verifying (build + a real check, e.g. curl the route).

## Git discipline
- Never force-push. Never `git reset --hard` without Dawood's explicit approval.
- **Never push to `main`** until the deploy-workflow conflict is resolved (see ARCHITECTURE.md) — backend auto-deploys on main push, violating the standing no-backend-auto-deploy policy. Work on branches; Kailash deploys backends manually after review.

## Honesty
- Never invent features, stats, reviews, testimonials, or financial figures.
- Never promise guaranteed returns — the product itself forbids it.
- Unknowns become TODOs in TASKS.md, not guesses in code.

## UI
- apple-design + web-animations standards for all user-facing UI work.
- No emojis in UI. Icons = inline SVG only (`components/icons.jsx`).
- Logos used raw, never inside a card/box.
- Apple font stack (already in `index.css` `--font`).
