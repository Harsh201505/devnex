# Dev.Nex — 5 Page Website + Backend

## Pages
- `/` Home
- `/services.html` Services
- `/work.html` Portfolio
- `/pricing.html` Pricing
- `/contact.html` Contact

## Backend
Node.js + Express + SQLite.
- `POST /api/enquiries` saves contact enquiries.
- `GET /api/health` checks API status.
- `GET /api/enquiries` requires `x-admin-key`.
- `/admin?key=YOUR_ADMIN_KEY` displays enquiries.

## Run locally
1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Set a strong `ADMIN_KEY`.
4. Run `npm install`.
5. Run `npm start`.
6. Open http://localhost:3000

The SQLite database is created automatically at `data/devnex.db`.

## Deploy
Deploy to a Node-compatible host such as Render, Railway, Fly.io, VPS, etc.
Set environment variables:
- `PORT` (usually supplied by the host)
- `ADMIN_KEY`

For production, use persistent disk/storage for SQLite or replace SQLite with PostgreSQL/MySQL if the host filesystem is ephemeral.

## Existing demos
- Gym: https://gymdemo20154.netlify.app
- Salon: https://salondemosite01.netlify.app/
- Restaurant: https://pt659741.netlify.app/

## Brand
Dev.Nex — DN lettermark.
