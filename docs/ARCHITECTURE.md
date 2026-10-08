# OwnStakeX — Architecture

```
ownstakex-platform/
├── frontend/   # React 18.3 + Vite 8 — public site, investor portal, admin CRM
├── backend/    # Laravel 10.50.3 (PHP 8.1), Sanctum 3.3 auth, MySQL
├── docs/       # this file set
├── ownstakex.sql  # seedable DB dump
└── .github/workflows/deploy-cpanel.yml  # builds + SFTPs to cPanel on main push
```

## Frontend (`frontend/src`)
- `pages/` — 17 routes: Home, Projects, ProjectDetail (`/projects/:slug`), HowItWorks, About, Blog, BlogPost (`/blog/:slug`), Contact, Faqs, Legal, Reporting, SubmitProject, Login, Register, InvestorDashboard, AdminDashboard, NotFound.
- `components/` — Navbar, Footer, ProtectedRoute (role gating), ProjectCard, CertificateModal, Reveal (scroll animation), icons (inline SVG).
- `context/AuthContext` — Sanctum token auth state; `api/` — axios client; `data/` — `demo.js` + `countries.js` fallbacks.
- Routing: react-router-dom v7 `BrowserRouter`. Public pages wrapped in `Shell` (Navbar + Footer); `/investor` requires investor/admin role; `/admin` requires admin.
- SEO: `components/PageHead.jsx` sets per-page title, meta description, canonical, OG/Twitter tags and JSON-LD (WebSite/WebPage/BreadcrumbList) via `useEffect`. App screens (login/register/dashboards) are `noindex`.
- Build: `npm run build` → static `dist/`. No SSR/prerendering — crawlers see the shell + PageHead meta injected at runtime.

## Backend (`backend/`)
- Standard Laravel 10 layout: `app/Http/Controllers/Api/V1/` — Auth, Project, Blog, Document, Deadline, Inbox, Investor, Poll, ReferralCommission, Reservation, Waitlist controllers.
- Routes: `routes/api.php` under `/api/v1` prefix (public reads, throttled form posts, Sanctum-authenticated investor + admin groups). `ownstakex.sql` / seeders provide demo projects and users.
- PHP requirement pinned: `composer.json` `config.platform.php = 8.1.0`.

## Deploy
- GitHub Actions `deploy-cpanel.yml`: builds frontend, `composer install --no-dev`, rsyncs into `release/`, writes `.htaccess` (SPA fallback + `/api` → `backend/public/index.php`), SFTPs a tarball to cPanel.
- ⚠️ **Policy conflict:** this workflow auto-deploys the BACKEND on every `main` push, which violates Dawood's standing no-backend-auto-deploy rule (backend = manual review first). Dawood's decision on this workflow is pending — see TASKS.md. Until resolved, do not push SEO/content work to `main`; use branches.
- Production target per `docs/DEPLOY.md`: frontend `dist/` → `public_html`, backend → subdomain/folder, domain `https://ownstakex.com`.
