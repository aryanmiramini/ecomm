-- Auth/cart fixes: one cart per user, one review per user+product
-- Prisma column names are camelCase (e.g. "userId"), not snake_case.

-- 1) Remove duplicate carts (keep newest per user; cart_items cascade on delete)
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "updatedAt" DESC) AS rn
  FROM carts
)
DELETE FROM carts
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- 2) Remove duplicate reviews (keep newest per user+product)
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "userId", "productId"
      ORDER BY "createdAt" DESC
    ) AS rn
  FROM reviews
)
DELETE FROM reviews
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- 3) Unique constraints (drop plain index first if present — replaced by unique)
DROP INDEX IF EXISTS "carts_userId_idx";

CREATE UNIQUE INDEX IF NOT EXISTS "carts_userId_key" ON "carts"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "reviews_userId_productId_key" ON "reviews"("userId", "productId");
