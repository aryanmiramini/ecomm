-- Drop legacy Stripe column
ALTER TABLE "orders" DROP COLUMN IF EXISTS "paymentIntentId";

-- Idempotency for duplicate order prevention
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "idempotencyKey" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "orders_idempotencyKey_key" ON "orders"("idempotencyKey");

-- Performance indexes
CREATE INDEX IF NOT EXISTS "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX IF NOT EXISTS "products_isActive_createdAt_idx" ON "products"("isActive", "createdAt");
CREATE INDEX IF NOT EXISTS "products_isActive_price_idx" ON "products"("isActive", "price");
CREATE INDEX IF NOT EXISTS "products_isFeatured_idx" ON "products"("isFeatured");
CREATE INDEX IF NOT EXISTS "orders_userId_createdAt_idx" ON "orders"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "cart_items_cartId_productId_key" ON "cart_items"("cartId", "productId");
CREATE INDEX IF NOT EXISTS "cart_items_productId_idx" ON "cart_items"("productId");
CREATE INDEX IF NOT EXISTS "carts_userId_idx" ON "carts"("userId");
CREATE INDEX IF NOT EXISTS "reviews_productId_idx" ON "reviews"("productId");
CREATE INDEX IF NOT EXISTS "notifications_userId_read_idx" ON "notifications"("userId", "read");
CREATE INDEX IF NOT EXISTS "order_items_orderId_idx" ON "order_items"("orderId");
CREATE INDEX IF NOT EXISTS "order_items_productId_idx" ON "order_items"("productId");
