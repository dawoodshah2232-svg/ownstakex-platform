# OwnStakeX — Tasks

## Done
- [x] Full-stack rebuild: React 18 + Vite frontend, Laravel 10 API, MySQL (README, quick start, demo accounts).
- [x] Advanced CRM workflow ported: deadlines + severity badges + Extend +7d, referral commissions pipeline, ownership records, certificates, statements, polls/voting.
- [x] Website spec v1.1: Submit a project form, fee schedule, reporting waterfall; website forms stored via API.
- [x] How It Works page: 8-step investor journey, three rules, fine print.
- [x] Production readiness: `.env.example` with live API placeholder + `docs/DEPLOY.md` cPanel guide for Kailash.
- [x] Context files: docs/PRD/ARCHITECTURE/RULES/DESIGN/TASKS/MEMORY (2026-10-08, branch `chore/context-and-seo`).
- [x] 20-fix SEO sweep on frontend (2026-10-08, same branch): PageHead per-page meta/canonical/OG/JSON-LD, sitemap.xml, robots.txt, HowItWorks H1 fix, hero.jpg→hero.webp, index.html OG/theme-color, GSC verification env hook.

## In progress
- [ ] Branch `chore/context-and-seo` — merged to main pending Dawood's workflow decision (see below).

## Next / TODO
- [ ] **DECISION (Dawood): `.github/workflows/deploy-cpanel.yml` auto-deploys the BACKEND on every `main` push** — violates the standing no-backend-auto-deploy policy (backend = manual review, Kailash deploys). Options: (a) split workflow to frontend-only auto-deploy, (b) disable auto-deploy entirely, (c) grant exception. Until decided: nothing pushes to `main`.
- [ ] **Google Search Console (owner UI):** verify property `https://ownstakex.com` (paste token → set `VITE_GSC_VERIFICATION` → rebuild), submit `sitemap.xml`, request indexing for /, /projects, /how-it-works, /about.
- [ ] Backlinks: earn via content only (project stories, blog) — never buy or spam links.
- [ ] Disable or rotate demo accounts (`admin@ownstakex.com` / `investor@ownstakex.com`, password `password`) before any public launch.
- [ ] Confirm real contact details, fee figures, reporting waterfall text (currently from spec v1.1 notes).
- [ ] Replace `__SITE_URL__`-style placeholders if any remain; confirm canonical domain is `https://ownstakex.com`.
- [ ] PageSpeed/Core Web Vitals check on the live domain after deploy (LCP/INP/CLS).
