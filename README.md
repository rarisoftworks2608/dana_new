# Dana Supplier Technology Day 2026 — Event Registration & QR Attendance System

> **Note on the backend:** the `server/` folder was replaced with a rebuilt version. It talks
> to the frontend exactly the same way (same request/response fields), but the internal
> file layout and a few internal DB column names differ from what's described later in this
> README. Quick start for the current server:
>
> ```bash
> cd server
> npm install
> cp .env.example .env        # then set MONGODB_URI to your Atlas connection string
> npm run migrate             # syncs indexes + seeds a default event
> npm run seed:admin          # creates the first admin login (see .env for email/password)
> npm run dev                 # starts on http://localhost:5000
> ```
>
> WhatsApp and Email notifications run in **sandbox mode** by default (they just log to the
> console) until you add real `WHATSAPP_ACCESS_TOKEN` / `SMTP_PASS` values to
> `server/.env` — so registrations, login, the dashboard, and the QR scanner all work locally
> without any external credentials.


A full-stack event platform: a marketing/registration landing page, a REST API backed by
MongoDB Atlas, automated WhatsApp/Email confirmations with QR codes, an admin dashboard, and a
live QR check-in scanner.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, React Router, React Hook Form, Recharts, html5-qrcode |
| Backend | Node.js, Express, MongoDB Atlas (`mongoose`), JWT, `qrcode`, ExcelJS |
| Notifications | Meta WhatsApp Cloud API, Hostinger SMTP (via Nodemailer) |

## Project Structure

```
dana_event/
├── client/                      React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/         Navbar, Hero, About, TechFocusAreas, WhyAttend, ...
│   │   │   ├── admin/           StatCard, charts, RegistrationsTable, EditRegistrationModal, ...
│   │   │   └── common/          ScrollReveal, AnimatedCounter, ProtectedRoute, ...
│   │   ├── pages/                LandingPage, AdminLogin, AdminDashboard, AdminScanner, NotFound
│   │   ├── layouts/               AdminLayout
│   │   ├── context/               AuthContext (JWT session)
│   │   ├── hooks/                 useCountdown, useInView
│   │   ├── services/              api.js (axios client)
│   │   └── utils/                 eventData.js (static content config)
│   └── ...
├── server/                       Node + Express backend
│   ├── src/
│   │   ├── config/                db.js (Mongoose connection)
│   │   ├── db/                    migrate.js, seedAdmin.js
│   │   ├── models/                Event, Admin, Registration, Attendance, Notification, Counter
│   │   ├── controllers/           registration, auth, dashboard, attendance, export
│   │   ├── routes/
│   │   ├── middleware/            auth (JWT)
│   │   ├── utils/                 qrService, emailService, whatsappService
│   │   └── server.js
│   └── uploads/qrcodes/           Generated QR PNGs (gitignored)
└── package.json                  npm workspaces root (client + server)
```

## 1. Prerequisites

- Node.js 18+ (native `fetch`/`FormData` used by the WhatsApp service)
- A MongoDB Atlas cluster (free M0 tier is enough) — or a local MongoDB instance for development
- A Meta WhatsApp Cloud API app (phone number ID + access token + an approved template)
- A Hostinger-hosted mailbox (e.g. `info@eventsportal.in`) for sending confirmation emails via SMTP

## 2. Install

```bash
npm run install:all
```

This installs both `client/` and `server/` workspaces from the repo root.

## 3. Configure Environment Variables

Copy the example files and fill in real values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Key `server/.env` values:

- `MONGODB_URI` — MongoDB Atlas connection string (from Atlas > Database > Connect > Drivers), including the database name
- `JWT_SECRET` — set a long random string in production
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — the first admin login, created by `db:seed`
- `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_TEMPLATE_NAME` — from Meta Business Manager
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — Hostinger mailbox credentials used to send confirmation emails

### WhatsApp template requirement

The confirmation message uses a **pre-approved** WhatsApp template with an **image header** and
a 3-parameter body (`{{1}}` name, `{{2}}` registration ID, `{{3}}` venue). Create and get this
template approved in Meta Business Manager before go-live; update `WHATSAPP_TEMPLATE_NAME` /
`WHATSAPP_TEMPLATE_LANG` to match.

## 4. Database Setup (MongoDB Atlas)

1. In [Atlas](https://cloud.mongodb.com), create a free cluster, a database user (username/password),
   and add your IP (or `0.0.0.0/0` for Hostinger, which has no fixed outbound IP on shared plans)
   to **Network Access**.
2. Copy the connection string from **Database > Connect > Drivers** into `MONGODB_URI` in
   `server/.env` — make sure it includes a database name, e.g. `.../dana_event?retryWrites=...`.
3. Run:

```bash
npm run db:migrate              # syncs Mongoose indexes + seeds the default event
npm run db:seed                 # creates the first admin user
```

Collections (`server/src/models/`):

- `Event` — event metadata (name, date, venue)
- `Admin` — dashboard/scanner operator accounts (bcrypt password hash)
- `Registration` — attendee/exhibitor/Dana registrations; unique on `email`, `mobile`, `qr_token`
- `Attendance` — one check-in log row per scan
- `Notification` — delivery log for WhatsApp/Email sends (`sent` / `failed` + error detail)
- `Counter` — backs the sequential `DANA-2026-000123`-style registration codes (MongoDB's `_id`
  is a non-sequential ObjectId, so this atomic counter replaces Postgres's `SERIAL`)

## 5. Run in Development

```bash
npm run dev
```

Runs the Vite dev server (`http://localhost:5173`) and the Express API (`http://localhost:5000`)
concurrently, with the Vite dev proxy forwarding `/api` to the backend.

Log in to the admin dashboard at `http://localhost:5173/admin/login` using the seeded admin
credentials, then visit **QR Scanner** to test check-ins with a webcam.

## 6. API Reference

All responses are JSON: `{ success, message?, data?, pagination? }`.

### Public

| Method | Path | Description |
|---|---|---|
| POST | `/api/registrations` | Register an attendee. Validates input, rejects duplicate email/mobile, generates a Registration ID + QR code, persists the record, and fires WhatsApp + Email notifications asynchronously. |
| GET | `/api/registrations/check?email=&mobile=` | Check if a registration already exists (used for optional client-side duplicate warnings). |
| GET | `/api/health` | Health check. |

### Auth

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` → `{ token, admin }` (JWT, expires per `JWT_EXPIRES_IN`). |
| GET | `/api/auth/me` | Returns the authenticated admin's profile. Requires `Authorization: Bearer <token>`. |

### Dashboard *(JWT required)*

| Method | Path | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Totals, today's count, checked-in/pending, category breakdown, daily trend. |
| GET | `/api/dashboard/registrations` | Paginated list. Query: `search`, `type`, `status`, `checkedIn`, `page`, `limit`, `sortBy`, `sortDir`. |
| PUT | `/api/dashboard/registrations/:id` | Edit a registration's fields. |
| DELETE | `/api/dashboard/registrations/:id` | Delete a registration (cascades to its attendance/notification rows). |

### Attendance *(JWT required)*

| Method | Path | Description |
|---|---|---|
| POST | `/api/attendance/checkin` | `{ qrToken }` → validates the QR, rejects unknown/cancelled tokens, returns `409 { alreadyCheckedIn: true }` on a repeat scan, otherwise records the check-in and returns the attendee profile. |
| GET | `/api/attendance` | Paginated check-in log. |

### Export *(JWT required)*

| Method | Path | Description |
|---|---|---|
| GET | `/api/export/excel` | Downloads all registrations as `.xlsx`. |
| GET | `/api/export/csv` | Downloads all registrations as `.csv`. |

## 7. QR Code Flow

1. On successful registration, the server generates a QR code encoding the registration's
   unique `qr_token` (UUID), saves a PNG under `server/uploads/qrcodes/`, and returns a base64
   data URL in the API response so the success modal can render/download it immediately.
2. The same PNG is attached to the confirmation email (inline, via `cid`) and uploaded to
   WhatsApp as the template's header image.
3. At the venue, `/admin/scanner` uses `html5-qrcode` to read the token from camera input and
   posts it to `/api/attendance/checkin`. The `UNIQUE(registration_id)` constraint on the
   `attendance` table is the source of truth that prevents double check-ins even under
   concurrent scans.

## 8. Testing Checklist

Manual verification performed while building this project (no live Atlas/WhatsApp/SMTP
credentials were available in the build environment, so DB-dependent flows should be
re-verified against your own instance):

- [x] `client` builds cleanly with `vite build` and lints clean with `eslint .`
- [x] `server` boots, `/api/health` returns 200, unknown routes return 404 via `notFoundHandler`
- [x] `qrService.generateQrCode` produces a valid PNG + base64 data URL in isolation
- [ ] Full registration → DB insert → QR → WhatsApp/Email round trip (needs your Atlas + Meta + Hostinger SMTP credentials)
- [ ] Admin login → dashboard stats/charts/table/export (needs seeded DB)
- [ ] Scanner check-in + duplicate check-in rejection (needs seeded DB + camera)

Recommended before go-live: register a few test entries end-to-end, confirm both notification
channels arrive, then scan each QR twice to confirm the second scan is rejected as a duplicate.

## 9. Content Assets To Supply

- `client/public/dana-supplier-technology-day-brochure.pdf` — the Hero section's "Download
  Brochure" button links here; add your actual brochure PDF at this path (any filename works,
  just update the `href` in `client/src/components/landing/Hero.jsx`).
- Real contact details, social links, and the Google Maps embed URL in `Contact.jsx` / `Venue.jsx`
  / `Footer.jsx` are placeholders — replace with Dana India's actual numbers/handles before launch.

## 10. Deployment Notes

- **Backend on Hostinger**: deploy `server/` to your Hostinger Node.js hosting (or a VPS running
  Node under PM2). Set `MONGODB_URI` to your Atlas connection string, `NODE_ENV=production`, and
  `FRONTEND_URL` to your deployed frontend origin (CORS is locked to this origin in `src/server.js`).
  In Atlas **Network Access**, allow Hostinger's outbound IP if it's static, otherwise allow
  `0.0.0.0/0` (shared Hostinger plans don't expose a fixed IP) and rely on the Atlas database
  user's credentials for access control.
- **Frontend**: `npm run build --prefix client` outputs static files to `client/dist/`; deploy to
  any static host (Vercel, Netlify, S3+CloudFront) and set `VITE_API_BASE_URL` to your deployed
  API's `/api` URL at build time.
- **Uploads**: `server/uploads/qrcodes/` is local disk storage. On multi-instance or ephemeral
  filesystem hosts (e.g. most PaaS dynos), switch this to S3/Cloud Storage before scaling
  horizontally — the QR file is only re-read for the email attachment and WhatsApp media upload,
  so this is a contained change inside `qrService.js`.
- **Secrets**: never commit `.env`. Rotate `JWT_SECRET`, the Meta access token, and the SMTP
  mailbox password per your organization's policy.
