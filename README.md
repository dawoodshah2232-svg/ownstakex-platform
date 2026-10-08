# OwnStakeX Platform

Full-stack rebuild of the OwnStakeX investment platform.

```
ownstakex-platform/
├── frontend/   # React 18 + Vite — public site, investor portal, admin CRM
├── backend/    # PHP Laravel 10 — REST API (Sanctum auth), MySQL database
```

**Brand:** OwnStakeX.com is owned by Bridging Investment LLC, Dubai, UAE.

---

## Quick start (local development)

### 1. Database (MySQL)
Create a database and user:
```sql
CREATE DATABASE ownstakex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ownstakex'@'localhost' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON ownstakex.* TO 'ownstakex'@'localhost';
```

### 2. Backend (Laravel 10, PHP 8.1+)
```bash
cd backend
cp .env.example .env
# edit .env → DB_DATABASE=ownstakex, DB_USERNAME, DB_PASSWORD
composer install           # installs exact versions from composer.lock
php artisan key:generate
php artisan migrate --seed # or import ../ownstakex.sql into MySQL
php artisan serve          # API at http://localhost:8000/api/v1
```

**Versions:** Laravel 10.x (locked at 10.50.3), Sanctum 3.3, PHPUnit 10.
`composer.json` pins `config.platform.php` to `8.1.0`, so `composer update`
always resolves packages that run on PHP 8.1, even if your local PHP is newer.
Laravel 10 officially supports PHP 8.1–8.3; newer PHP versions may show
deprecation warnings.

Composer commands:
```bash
composer install           # after clone / git pull (keeps locked versions)
composer update            # pull latest Laravel 10.x patch releases
php artisan optimize:clear # clear caches after updating
```

### 3. Frontend (React, Node 18+)
```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:8000/api/v1
npm run dev               # site at http://localhost:5173
```

### Demo accounts (seeded)
| Role     | Email                  | Password   |
|----------|------------------------|------------|
| Admin    | admin@ownstakex.com    | `password` |
| Investor | investor@ownstakex.com | `password` |

> Change these before any production use.

---

## API overview (`/api/v1`)

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/auth/register`, `/auth/login`, `/auth/logout` | public / auth |
| GET | `/auth/me` | auth |
| GET | `/projects`, `/projects/{slug}` | public |
| GET | `/documents`, `/blog`, `/blog/{slug}` | public |
| GET/POST | `/reservations` | investor |
| GET | `/investor/dashboard` | investor |
| GET/POST/PUT/DELETE | `/admin/users`, `/admin/projects`, `/admin/documents`, `/admin/announcements` | admin |
| GET | `/admin/audit-log` | admin |

Full endpoint table: see `backend/README.md`.

## Database tables (MySQL)

users, projects, project_images, documents, reservations, investments,
payments, distributions, blog_posts, announcements, audit_logs.

Migrations: `backend/database/migrations/`. Seeders: `backend/database/seeders/`.

## cPanel deployment notes

- Backend needs PHP **8.1+** (8.1–8.3 recommended) with `pdo_mysql`, `mbstring`, `openssl`, `json`, `curl`.
- Point the domain's document root at `backend/public`.
- Set up the MySQL database in cPanel, update `.env`, run migrations over SSH
  (`php artisan migrate --force`) or import `database/schema.sql` if provided.
- Frontend: run `npm run build` locally and upload `frontend/dist/` contents
  to `public_html` (or serve from a subdomain).

## Frontend without backend

Every page ships with built-in demo content and renders fully even when the
API is unreachable — useful for design review before the backend is deployed.
