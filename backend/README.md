# Blood Donation Backend (Nest-like minimal scaffold)

This is a lightweight Nest-style backend scaffold built with TypeScript and Nest core packages.
It uses a simple file-based JSON database for quick setup. It provides REST endpoints for donors
and a simple JWT-based admin authentication.

## Quick start

1. Install dependencies

```bash
cd backend
npm install
```

2. Copy `.env.example` to `.env` and edit secrets

```bash
cp .env.example .env
# edit .env to set JWT_SECRET and credentials
```

3. Run in development

```bash
npm run start:dev
```

4. API endpoints

- POST /auth/login  → { username, password } → { accessToken }
- POST /donors      → create donor (public)
- GET /donors       → list donors (query: status, page, pageSize)
- GET /donors/:id   → get donor by id
- PATCH /donors/:id/status → update status (requires Authorization: Bearer <token>)
- GET /stats        → compute aggregated stats

## Notes
- This scaffold purposefully uses a file JSON DB (data/db.json) to avoid DB setup.
- For production, swap `FileDbService` with a real DB (Postgres, MongoDB, Prisma, TypeORM).
- The JWT token returned from `/auth/login` must be provided in `Authorization: Bearer <token>` header
  for protected endpoints (status updates).
