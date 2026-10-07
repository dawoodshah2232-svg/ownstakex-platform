# OwnStakeX — API Backend (Laravel)

REST API for the OwnStakeX investment platform. Token authentication via
Laravel Sanctum. Owned by Bridging Investment LLC, Dubai, UAE.

## Production database: MySQL

Production runs on **MySQL** (cPanel hosting). SQLite is supported **only**
for quick local smoke tests — never ship a SQLite `.env` to production.

## Setup

Requirements: PHP 8.3+, Composer, MySQL 8.

```bash
cd backend
cp .env.example .env
php artisan key:generate
```

Edit `.env` with your MySQL credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ownstakex
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

Create the empty database first (`CREATE DATABASE ownstakex;`), then:

```bash
php artisan migrate --seed
php artisan serve --host=0.0.0.0 --port=8000
```

The API is then available at `http://localhost:8000/api/v1`.

## Demo credentials (seeded)

| Role     | Email                 | Password   |
|----------|-----------------------|------------|
| Admin    | admin@ownstakex.com   | `password` |
| Investor | investor@ownstakex.com| `password` |

Change these before any real deployment.

## API endpoints

Base URL: `/api/v1`. Authenticated routes use `Authorization: Bearer <token>`.

### Public

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| POST   | /auth/register        | Register investor (name, email, password) |
| POST   | /auth/login           | Login, returns token                     |
| GET    | /projects             | List live projects (?category, ?status, ?search, ?per_page) |
| GET    | /projects/{slug}      | Project detail with images + documents   |
| GET    | /documents            | Public investor-facing documents         |
| GET    | /blog                 | Published posts (?tag, ?search)           |
| GET    | /blog/{slug}          | Single post                              |

### Investor (Bearer token)

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| POST   | /auth/logout          | Revoke current token                     |
| GET    | /auth/me              | Current user                             |
| GET    | /investor/dashboard   | Portfolio summary, investments, reservations, payments, documents, announcements |
| GET    | /reservations         | My reservations                          |
| POST   | /reservations         | Reserve units {project_id, units}         |
| GET    | /documents            | Investor-audience documents              |

### Admin (Bearer token + admin role)

| Method | Endpoint                              | Description                          |
|--------|---------------------------------------|--------------------------------------|
| GET    | /admin/users                          | List users (?search, ?role)          |
| PATCH  | /admin/users/{user}                   | Update user (role, kyc_status, …)    |
| GET    | /admin/projects                       | All projects incl. drafts            |
| POST   | /admin/projects                       | Create project (+ images[], documents[]) |
| PATCH  | /admin/projects/{project}             | Update project                       |
| DELETE | /admin/projects/{project}             | Delete project                       |
| GET    | /admin/documents                      | All documents                        |
| POST   | /admin/documents                      | Add document                         |
| PATCH  | /admin/documents/{document}           | Update document                      |
| DELETE | /admin/documents/{document}           | Delete document                      |
| GET    | /admin/announcements                  | List announcements                   |
| POST   | /admin/announcements                  | Create announcement                  |
| PATCH  | /admin/announcements/{announcement}   | Update announcement                  |
| DELETE | /admin/announcements/{announcement}   | Delete announcement                  |
| GET    | /admin/audit-logs                     | Audit trail                          |

## Notes

- SQLite was used **only for the local smoke test** (migrations, seeding,
  27 routes, login/token flow, dashboard, reservations all verified). The
  shipped `.env.example` is MySQL-only; no SQLite config is committed.

- `POST /api/v1/admin/projects` accepts `images: [url, …]` (replaces the
  gallery) and `documents: [{title, file_url, category, …}]` (appends).
- Reservations validate project status (`funding`), min/max units per
  investor, and available inventory; reserved units increment `reserved`.
- The `admin` middleware (`app/Http/Middleware/EnsureAdmin.php`) rejects
  non-admin tokens with HTTP 403.
- File uploads are stored as URLs (`cover_image`, `file_url`, …) — wire
  your cPanel storage/CDN and pass the public URLs.
