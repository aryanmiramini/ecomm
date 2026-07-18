export type OrderPricing = {
  subtotal: number
  tax: number
  shipping: number
  total: number
}

const DEFAULT_TAX_RATE = 0.09
const DEFAULT_FLAT_SHIPPING = 50_000
const FREE_SHIPPING_THRESHOLD = 500_000

export function estimateOrderPricing(subtotal: number): OrderPricing {
  const tax = Math.round(subtotal * DEFAULT_TAX_RATE)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_FLAT_SHIPPING
  const total = subtotal + tax + shipping
  return { subtotal, tax, shipping, total }
}
