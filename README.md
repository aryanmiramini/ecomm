# Persian E-commerce (NestJS + Next.js)

Monorepo with a NestJS API (`backend/`) and Next.js storefront (`frontend/`).

## Quick start

1. Copy environment file:
   ```bash
   cp env.example .env
   ```
2. Set **required** values in `.env`:
   - `JWT_SECRET` — at least 32 random characters (must match in backend + frontend)
   - `DB_PASSWORD` — strong Postgres password
3. Start with Docker:
   ```bash
   docker compose up --build
   ```
4. Open:
   - Storefront: http://localhost (via nginx)
   - Health: http://localhost/health

Backend and frontend are **not** exposed directly; nginx is the public entrypoint.

## Local development (without Docker)

Run Postgres locally, then:

```bash
# backend
cd backend && npm install && npx prisma migrate deploy && npm run start:dev

# frontend (separate terminal)
cd frontend && npm install && npm run dev
```

Use `COOKIE_SECURE=false` and `NODE_ENV=development` in `.env`.

## Seed demo data (optional)

```bash
RUN_SEED=true docker compose run --rm backend node dist/prisma/seed.js
```

**Warning:** seed wipes demo tables when `RUN_SEED=true`. Never run on production data.

Demo accounts after seed:
- Admin: `admin@ecommerce.com` / `Password123!`
- Customer: `customer@example.com` / `Password123!`

## Auth flows (MVP)

- **Email/password** — register + login (enabled by default)
- **Phone OTP** — disabled until `ENABLE_OTP=true`, `NEXT_PUBLIC_ENABLE_OTP=true`, and Kavenegar is configured
- **Password reset** — disabled until `ENABLE_PASSWORD_RESET=true` and email/SMS delivery is wired

## Production checklist

1. Set strong `JWT_SECRET` and `DB_PASSWORD` (Compose will fail without them)
2. Set `COOKIE_SECURE=true` when TLS is enabled
3. Terminate TLS at nginx or an external load balancer
4. Configure `SUPER_ADMIN_*` for first admin bootstrap
5. Do **not** set `RUN_SEED=true` on production

## Media / images

- Uploaded files: `backend/media/` served at `/media/*`
- nginx proxies `/media/*` to the backend
- Seed images: `backend/media/seed/`

## Important env vars

| Variable | Used by |
|----------|---------|
| `JWT_SECRET` | Backend JWT + Next.js proxy/admin gate |
| `COOKIE_SECURE` | Auth cookie `Secure` flag (true with HTTPS) |
| `BACKEND_API_URL` | Next.js BFF (server-side API calls) |
| `NEXT_PUBLIC_BACKEND_URL` | Client media fallback |
| `CORS_ORIGIN` | Backend CORS allowlist |
| `ORDER_*` / `NEXT_PUBLIC_ORDER_*` | Pricing (must match backend and frontend) |

## Ports (Docker)

| Service | Public port |
|---------|-------------|
| nginx | 80 |
| Backend | internal only |
| Frontend | internal only |
| Postgres | internal only |
