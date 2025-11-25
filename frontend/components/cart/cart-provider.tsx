"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { CartSummary } from "@/lib/types"

type CartContextValue = {
  cart: CartSummary | null
  loading: boolean
  refresh: () => Promise<void>
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clear: () => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const response = await apiClient.getCart()
      setCart(response.cart)
    } catch (error) {
      // ignore errors (likely unauthenticated) but keep cart empty
      setCart(null)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh().catch(() => setLoading(false))
  }, [refresh])

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      await apiClient.addToCart({ productId, quantity })
      await refresh()
    },
    [refresh],
  )

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      await apiClient.updateCartItem(itemId, quantity)
      await refresh()
    },
    [refresh],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      await apiClient.removeCartItem(itemId)
      await refresh()
    },
    [refresh],
  )

  const clear = useCallback(async () => {
    await apiClient.clearCart()
    await refresh()
  }, [refresh])

  return (
    <CartContext.Provider value={{ cart, loading, refresh, addItem, updateItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider")
  }
  return ctx
}


