import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    seed:
      process.env.NODE_ENV === 'production'
        ? 'node dist/prisma/seed.js'
        : 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});

