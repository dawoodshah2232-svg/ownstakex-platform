# OwnStakeX — React Frontend

React 18 + Vite frontend for the OwnStakeX fractional investment platform.
Light premium theme (white/cream, orange `#f97316`, navy `#0e1a2e`), ported from the shipped OwnStakeX design system.

## Requirements

- Node.js 18+ (tested on Node 24)
- The Laravel API at `http://localhost:8000/api/v1` (optional — the UI ships with demo fallback content and works without it)

## Install & run

```bash
cd frontend
npm install

# point at your API (optional)
cp .env.example .env
# edit VITE_API_URL if your backend runs elsewhere

npm run dev      # dev server, default http://localhost:5173
npm run build    # production build -> dist/
npm run preview  # serve the production build locally
```

## Environment

| Variable      | Default                        | Purpose                          |
|---------------|--------------------------------|----------------------------------|
| VITE_API_URL  | http://localhost:8000/api/v1   | Laravel API base URL (Sanctum)   |

Auth uses a Bearer token stored in `localStorage` (`ownstakex_token`), attached to every request by the axios client in `src/api/client.js`.

## Demo accounts (work even when the API is offline)

| Email                  | Password   | Role     |
|------------------------|------------|----------|
| investor@ownstakex.com | `password` | investor |
| admin@ownstakex.com    | `password` | admin    |

## Page map

| Route              | Page               | Notes                                    |
|--------------------|--------------------|------------------------------------------|
| `/`                | Home               | Full-bleed hero, stats band, categories, 5-step row, featured projects |
| `/projects`        | Projects           | Category filter, API + demo fallback     |
| `/projects/:slug`  | ProjectDetail      | Funding progress, reserve flow, documents|
| `/how-it-works`    | HowItWorks         | 5-step process, structure explainers     |
| `/about`           | About              | Company story, stats                     |
| `/blog`            | Blog               | Article list, API + demo fallback        |
| `/blog/:slug`      | BlogPost           | Article body, risk disclaimer            |
| `/contact`         | Contact            | Contact form (POST /contact)             |
| `/faqs`            | FAQs               | Accordion                                |
| `/legal`           | Legal              | Terms, risk disclosure, privacy          |
| `/reporting`       | Reporting          | Reports list, transparency commitments   |
| `/login`           | Login              | POST /auth/login, demo hints             |
| `/register`        | Register           | POST /auth/register                      |
| `/investor`        | InvestorDashboard  | Tabs: overview, reservations, payments, investments, documents, profile (role: investor, admin) |
| `/admin`           | AdminDashboard     | Tabs: overview, projects (media + document management), document library, investors, announcements (role: admin) |

## API contract (Laravel backend)

- `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `GET /auth/me`
- `GET /projects`, `GET /projects/:slug`, `POST /projects/:slug/reservations`
- `GET /blog`, `GET /blog/:slug`, `POST /contact`
- `GET /investor/overview|reservations|payments|investments|documents`
- `GET /admin/overview|projects|documents|investors|announcements`
- `POST|PUT|DELETE /admin/projects/:id`, `POST /admin/media`, `DELETE /admin/media/:id`
- `POST|DELETE /admin/documents/:id`, `POST /admin/announcements`

Every page degrades gracefully: if the API is unreachable, sensible demo content renders instead of a blank screen.

## Notes

- No emojis in the UI — inline SVG icons only (`src/components/icons.jsx`).
- Footer carries the legal line: "OwnStakeX.com is owned by Bridging Investment LLC, Dubai, UAE."
- "Capital at risk" risk language appears wherever investments are shown.
- Mobile responsive: hamburger nav under 1024px, stacked layouts, 2-col stat grids on small screens.
