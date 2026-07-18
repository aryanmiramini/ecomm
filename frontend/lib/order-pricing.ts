export type OrderPricing = {
  subtotal: number
  tax: number
  shipping: number
  total: number
}

const DEFAULT_TAX_RATE = 0.09
const DEFAULT_FLAT_SHIPPING = 50_000
const FREE_SHIPPING_THRESHOLD = 500_000

function readNumberEnv(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function estimateOrderPricing(subtotal: number): OrderPricing {
  const taxRate = readNumberEnv("NEXT_PUBLIC_ORDER_TAX_RATE", DEFAULT_TAX_RATE)
  const flatShipping = readNumberEnv("NEXT_PUBLIC_ORDER_SHIPPING_FLAT", DEFAULT_FLAT_SHIPPING)
  const freeThreshold = readNumberEnv(
    "NEXT_PUBLIC_ORDER_FREE_SHIPPING_THRESHOLD",
    FREE_SHIPPING_THRESHOLD,
  )

  const tax = Math.round(subtotal * taxRate)
  const shipping = subtotal >= freeThreshold ? 0 : flatShipping
  const total = subtotal + tax + shipping
  return { subtotal, tax, shipping, total }
}
