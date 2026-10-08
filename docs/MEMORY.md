# OwnStakeX — Memory (progress log)

## 2026-10-08
- **Context files + SEO sweep** on branch `chore/context-and-seo` (Dawood's standing orders: context files in every project; 20-fix SEO sweep on every site).
- Docs created from real repo inspection: PRD (fractional investment platform, Bridging Investment LLC), ARCHITECTURE (React 18+Vite / Laravel 10+Sanctum+MySQL, cPanel deploy flow), RULES (stack, git, honesty, UI), DESIGN (orange #f97316 + navy #0e1a2b system), TASKS, this MEMORY.
- SEO work: new `PageHead.jsx` (per-page title ≤60 chars, meta description, canonical, OG/Twitter, JSON-LD WebSite/WebPage/BreadcrumbList, GSC verification env hook, noindex for app screens); `public/sitemap.xml` (12 public routes) + `public/robots.txt`; fixed missing H1 on HowItWorks; `hero.jpg` (450KB) → `hero.webp`; index.html OG tags + theme-color.
- **Held off `main` deliberately:** `deploy-cpanel.yml` auto-deploys the backend on main push — conflicts with the no-backend-auto-deploy policy. Dawood's decision pending; branch only.

## Earlier (from git log)
- Full-stack rebuild scaffolded (README, quick start, demo accounts).
- Advanced CRM workflow ported from static demo (deadlines, referrals, ownership, certificates, voting, project economics).
- Backend: same CRM workflow ported (deadlines, certificates, statements, polls, referral commissions).
- Website spec v1.1: Submit a project, fee schedule, reporting waterfall; website forms persisted.
- How It Works page built (8-step journey, three rules, fine print).
- Production readiness: `.env.example` + `docs/DEPLOY.md` for Kailash.
