# E-commerce Frontend

Next.js 16 storefront (Persian RTL) with BFF API routes under `app/api/`.

## Local development

```bash
npm install
npm run dev
```

Set `BACKEND_API_URL` (server) and `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_BACKEND_URL` (client) to point at the NestJS backend.

## Docker

Built via root `docker-compose.yml` — frontend on port **3001**, backend on **3000**.
