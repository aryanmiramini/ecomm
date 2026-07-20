export function readNumberEnv(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function formatToman(amount: number): string {
  return amount.toLocaleString("fa-IR")
}

export const storeConfig = {
  phone: process.env.NEXT_PUBLIC_STORE_PHONE || "021-00000000",
  email: process.env.NEXT_PUBLIC_STORE_EMAIL || "support@example.com",
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS || "تهران",
  bankCard: process.env.NEXT_PUBLIC_BANK_CARD_NUMBER || "",
  bankSheba: process.env.NEXT_PUBLIC_BANK_SHEBA || "",
  bankHolder: process.env.NEXT_PUBLIC_BANK_HOLDER || "",
  freeShippingThreshold: readNumberEnv("NEXT_PUBLIC_ORDER_FREE_SHIPPING_THRESHOLD", 500_000),
  flatShipping: readNumberEnv("NEXT_PUBLIC_ORDER_SHIPPING_FLAT", 50_000),
}
