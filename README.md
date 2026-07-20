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
   - `SUPER_ADMIN_*` — first admin account (email, phone, password)
   - Public URLs — set `FRONTEND_PUBLIC_URL`, `CORS_ORIGIN`, `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_API_URL` to your domain or server IP
   - Store contact — `NEXT_PUBLIC_STORE_PHONE`, `NEXT_PUBLIC_STORE_EMAIL`, `NEXT_PUBLIC_STORE_ADDRESS`
   - Bank transfer (optional) — `NEXT_PUBLIC_BANK_CARD_NUMBER`, `NEXT_PUBLIC_BANK_SHEBA`, `NEXT_PUBLIC_BANK_HOLDER`
3. Start with Docker:
   ```bash
   docker compose up --build -d
   ```
4. Open:
   - Storefront: http://localhost (via nginx)
   - Health: http://localhost/health

Backend and frontend are **not** exposed directly; nginx is the public entrypoint.

## Docker deploy (production VPS)

### 1. Server prerequisites

- Docker Engine + Compose plugin
- Open port 80 (or set `HTTP_PORT` in `.env`)
- If Docker Hub is blocked in Iran, keep Arvan image mirrors in `.env`:
  ```
  NODE_IMAGE=docker.arvancloud.ir/library/node:20-alpine
  POSTGRES_IMAGE=docker.arvancloud.ir/library/postgres:16-alpine
  NGINX_IMAGE=docker.arvancloud.ir/library/nginx:1.27-alpine
  ```

### 2. Configure `.env`

Minimum production values:

| Variable | Example |
|----------|---------|
| `JWT_SECRET` | 32+ random chars |
| `DB_PASSWORD` | strong password |
| `FRONTEND_PUBLIC_URL` | `http://your-domain.ir` |
| `CORS_ORIGIN` | same as public URL |
| `NEXT_PUBLIC_BACKEND_URL` | same as public URL |
| `NEXT_PUBLIC_API_URL` | `http://your-domain.ir/api` |
| `SUPER_ADMIN_EMAIL` | admin email |
| `SUPER_ADMIN_PHONE` | `09xxxxxxxxx` |
| `SUPER_ADMIN_PASSWORD` | strong password |
| `COOKIE_SECURE` | `false` on HTTP, `true` behind HTTPS |

Keep `ENABLE_OTP=false` and `ENABLE_PASSWORD_RESET=false` unless Kavenegar/email is configured.

### 3. Build and start

```bash
git clone <repo-url> ecomm && cd ecomm
cp env.example .env
# edit .env
docker compose up --build -d
docker compose ps
docker compose logs -f backend
```

Migrations run automatically on backend startup (`prisma migrate deploy`).

### 4. Smoke test checklist

- [ ] `curl http://<host>/health` returns `healthy`
- [ ] Storefront loads at `http://<host>/`
- [ ] No requests to `fonts.googleapis.com` in browser Network tab
- [ ] Register + login works
- [ ] Add product to cart → checkout → COD order succeeds
- [ ] Admin login at `/admin` with `SUPER_ADMIN_*` credentials
- [ ] Admin can update order status (PENDING → PROCESSING → SHIPPED)
- [ ] Cancel order restores stock correctly
- [ ] Product with order history soft-deactivates instead of hard delete
- [ ] Upload product image → visible at `/media/...`

### 5. Backups

- Postgres data: Docker volume `postgres_data`
- Uploaded media: bind mount `./backend/media`

```bash
docker compose exec postgres pg_dump -U postgres ecommerce_db > backup.sql
```

### 6. Updates

```bash
git pull
docker compose up --build -d
```

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

## Payments (MVP)

Cash on delivery, POS, and bank transfer only. Online payment gateway integration is planned separately.

Admin marks orders paid/delivered manually; `paymentStatus` becomes `COMPLETED` when status is `PAID` or `DELIVERED`.

## Production checklist

1. Set strong `JWT_SECRET` and `DB_PASSWORD` (Compose will fail without them)
2. Set `COOKIE_SECURE=true` when TLS is enabled
3. Terminate TLS at nginx or an external load balancer
4. Configure `SUPER_ADMIN_*` for first admin bootstrap
5. Do **not** set `RUN_SEED=true` on production
6. Set real store contact and bank details in `.env`
7. Vazirmatn font is self-hosted under `frontend/public/fonts/` (no Google Fonts)

## Iran / offline notes

- Docker images: use Arvan mirrors if Docker Hub is blocked
- Fonts: self-hosted Vazirmatn (no external CDN at runtime)
- SMS: Kavenegar only when OTP enabled (Iran-local)
- No Stripe or foreign payment APIs
- App runs fully on your VPS; customers need network access to your server

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
| `NEXT_PUBLIC_STORE_*` | Footer contact info |
| `NEXT_PUBLIC_BANK_*` | Bank transfer page |

## Ports (Docker)

| Service | Public port |
|---------|-------------|
| nginx | 80 |
| Backend | internal only |
| Frontend | internal only |
| Postgres | internal only |
