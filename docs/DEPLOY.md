# OwnStakeX — cPanel Deployment Guide (for Kailash)

Production stack: **React 18 + Vite frontend** + **Laravel 10 (PHP 8.1)** + **MySQL 8**.

## 0. Requirements on the server
- PHP 8.1 (with extensions: mbstring, xml, curl, zip, mysqlnd/pdo_mysql, fileinfo, tokenizer)
- MySQL 8 database + user
- Composer 2
- Node 18+ (only needed once, to build the frontend — can be built locally and uploaded)

## 1. Backend (Laravel) → e.g. `ownstakex.com/api` or a subdomain
1. Upload the contents of `backend/` (excluding `node_modules`, `.git`, `tests`) to the backend folder on the server.
2. `composer install --no-dev --optimize-autoloader`
3. Copy `.env.example` → `.env` and set:
   - `APP_URL=https://ownstakex.com` (your real domain)
   - `APP_ENV=production`, `APP_DEBUG=false`
   - `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (the MySQL 8 database)
   - `SANCTUM_STATEFUL_DOMAINS=ownstakex.com` (so the React frontend can authenticate)
4. `php artisan key:generate`
5. `php artisan migrate --seed` (creates all tables + demo projects/users)
6. `php artisan storage:link`
7. Point the domain/subdomain document root to `backend/public`.
8. Set the scheduler cron (optional, for future automation):
   `* * * * * cd /path/to/backend && php artisan schedule:run >> /dev/null 2>&1`

Demo logins after seeding: `admin@ownstakex.com` / `investor@ownstakex.com`, password `password`.
**Change or disable these demo accounts before any public launch.**

## 2. Frontend (React) → `public_html`
1. **Before building**, set the real backend URL (this is the step that must not be skipped):
   - Copy `frontend/.env.example` → `frontend/.env`
   - Set `VITE_API_URL=https://ownstakex.com/api/v1` (your real backend URL — never `localhost`)
2. `npm install`
3. `npm run build` (creates `dist/`)
4. Upload the contents of `dist/` to `public_html` (the site root).

## 3. Verify live
- Open `https://ownstakex.com` → homepage loads, projects show.
- Log in as admin → Admin dashboard opens (white OwnStakeX logo on the dark sidebar is intentional).
- Log in as investor → Ownership tab, Certificate modal, Statements, Board & voting.
- Admin → Deadlines tab shows the 4 demo projects with severity badges; "Extend +7d" works.

## Notes
- Frontend is a static build — it can be rebuilt locally and re-uploaded any time; no Node needed on the server.
- Backend is never auto-deployed: code is pushed to GitHub, and each backend release gets a manual review + `php artisan migrate` on the server before going live.
- The static demo site (GitHub Pages) is a separate preview build and does not affect production.
