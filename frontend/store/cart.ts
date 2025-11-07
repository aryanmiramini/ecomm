import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: any
}

interface CartStore {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  calculateTotal: () => void
}

export const useCartStore = create<CartStore>(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item: CartItem) => {
        const existing = get().items.find((i) => i.productId === item.productId)
        if (existing) {
          existing.quantity += item.quantity
        } else {
          set((state) => ({ items: [...state.items, item] }))
        }
        get().calculateTotal()
      },
      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
        get().calculateTotal()
      },
      updateQuantity: (id: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }))
        get().calculateTotal()
      },
      clear: () => {
        set({ items: [], total: 0 })
      },
      calculateTotal: () => {
        const total = get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        set({ total })
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
