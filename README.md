# Persian E-commerce (NestJS + Next.js)

Monorepo with a NestJS API (`backend/`) and Next.js storefront (`frontend/`).

## Quick start

1. Copy environment file:
   ```bash
   cp env.example .env
   ```
2. Set strong values for `JWT_SECRET`, `DB_PASSWORD`, and `JWT_SECRET` (must match in frontend for route protection).
3. Start with Docker:
   ```bash
   docker compose up --build
   ```
4. Open:
   - Storefront: http://localhost:3001
   - API: http://localhost:3000/api
   - Health: http://localhost:3000/api/health

## Seed demo data (optional)

```bash
RUN_SEED=true docker compose run --rm backend node dist/prisma/seed.js
```

**Warning:** seed wipes demo tables when `RUN_SEED=true`.

Demo accounts after seed:
- Admin: `admin@ecommerce.com` / `Password123!`
- Customer: `customer@example.com` / `Password123!`

## Auth flows

- **Email/password** — register + login
- **Phone OTP** — request code + verify (Kavenegar in production; dev returns code in API response)
- **Password reset** — forgot password; in non-production the API returns a reset token for `/reset-password`

## Media / images

- Uploaded files: `backend/media/` served at `/media/*`
- Next.js rewrites `/media/*` to the backend so images work in Docker without exposing internal hostnames
- Seed images: `backend/media/seed/`

## Important env vars

| Variable | Used by |
|----------|---------|
| `JWT_SECRET` | Backend JWT + Next.js proxy/admin gate |
| `BACKEND_API_URL` | Next.js BFF (server-side API calls) |
| `NEXT_PUBLIC_BACKEND_URL` | Client media fallback |
| `CORS_ORIGIN` | Backend CORS allowlist |

## Ports

| Service | Port |
|---------|------|
| Frontend | 3001 |
| Backend | 3000 |
| Postgres | internal only |
