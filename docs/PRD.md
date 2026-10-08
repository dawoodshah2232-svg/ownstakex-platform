# OwnStakeX — PRD

## What it is
OwnStakeX.com is a fractional investment platform owned by **Bridging Investment LLC, Dubai, UAE**. It structures premium real-world assets (real estate, yachts, hospitality, operating businesses) into transparent vehicles where many investors can each own a meaningful stake.

## Users
- **Investors** — browse projects, reserve units, pay against a reference, track ownership, certificates, statements, vote in polls, earn referral commissions.
- **Admins (Bridging Investment LLC team)** — manage projects, documents, announcements, users, deadlines, referral commissions, contact messages, project submissions, audit logs.

## Features (live in repo)
- Public site: Home, Projects, Project detail, How It Works (8-step journey), About, Blog, FAQs, Contact, Legal, Reporting, Submit a Project.
- Investor portal (`/investor`): dashboard, ownership records, certificates, statements, polls/voting, reservations, referrals.
- Admin CRM (`/admin`): users, projects, documents, announcements, deadlines (with +7d extension), referral commission pipeline (approve → payable → paid), waitlist, inbox (contact + project submissions), audit logs.
- Backend API: `POST /api/v1/auth/register|login`, public `GET /projects`, `/documents`, `/blog`, `POST /waitlist|/contact|/project-submissions` (throttled), Sanctum-authenticated investor routes, admin-only routes behind `admin` middleware.
- Demo mode: frontend ships `src/data/demo.js` fallback content when the API is unreachable.

## Non-goals / honesty rules
- Never promise guaranteed returns — the About page states this explicitly and it is a standing rule.
- No fake stats, testimonials, or invented projects. Unconfirmed facts stay as TODO.

## Open TODOs (owner decisions)
- Disable or rotate demo accounts (`admin@ownstakex.com`, `investor@ownstakex.com`, password `password`) before any public launch.
- Confirm real contact details, fee schedule figures, and reporting waterfall content (spec v1.1 drafted from Kailash's notes).
