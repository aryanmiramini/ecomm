"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/components/auth/auth-provider"
import type { CartItem, CartSummary } from "@/lib/types"

const GUEST_CART_KEY = "guest_cart"

type CartContextValue = {
  cart: CartSummary | null
  loading: boolean
  refresh: () => Promise<void>
  addItem: (productId: string, quantity?: number, productData?: { nameFa: string; image: string; price: number }) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clear: () => Promise<void>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function getGuestCart(): CartSummary {
  if (typeof window === "undefined") {
    return { items: [], subtotal: 0, itemCount: 0, totalQuantity: 0 }
  }
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // ignore invalid guest cart payload
  }
  return { items: [], subtotal: 0, itemCount: 0, totalQuantity: 0 }
}

function saveGuestCart(cart: CartSummary) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart))
  } catch {
    // ignore storage failures
  }
}

function clearGuestCart() {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(GUEST_CART_KEY)
  } catch {
    // ignore storage failures
  }
}

function recalculateCart(items: CartItem[]): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const itemCount = items.length
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  return { items, subtotal, itemCount, totalQuantity }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, loading: authLoading } = useAuth()
  const syncInProgressRef = useRef(false)
  const wasAuthenticatedRef = useRef(false)

  const refresh = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await apiClient.getCart()
        setCart(response.cart)
      } catch {
        setCart({ items: [], subtotal: 0, itemCount: 0, totalQuantity: 0 })
      }
    } else {
      setCart(getGuestCart())
    }
    setLoading(false)
  }, [isAuthenticated])

  useEffect(() => {
    if (authLoading) return

    const syncAndRefresh = async () => {
      if (isAuthenticated) {
        const guestCart = getGuestCart()
        if (guestCart.items.length > 0 && !syncInProgressRef.current) {
          syncInProgressRef.current = true
          try {
            await apiClient.mergeCart(
              guestCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            )
            clearGuestCart()
          } catch {
            // keep guest cart for retry on next auth flip
          } finally {
            syncInProgressRef.current = false
          }
        }
      } else if (wasAuthenticatedRef.current) {
        setCart(getGuestCart())
        setLoading(false)
        return
      }

      await refresh()
    }

    void syncAndRefresh()
    wasAuthenticatedRef.current = isAuthenticated
  }, [authLoading, isAuthenticated, refresh])

  const addItem = useCallback(
    async (productId: string, quantity = 1, productData?: { nameFa: string; image: string; price: number }) => {
      if (isAuthenticated) {
        await apiClient.addToCart({ productId, quantity })
        await refresh()
      } else {
        const currentCart = getGuestCart()
        const existingItemIndex = currentCart.items.findIndex((item) => item.productId === productId)

        if (existingItemIndex >= 0) {
          currentCart.items[existingItemIndex].quantity += quantity
          currentCart.items[existingItemIndex].total =
            currentCart.items[existingItemIndex].price * currentCart.items[existingItemIndex].quantity
        } else {
          if (!productData) {
            try {
              const { product } = await apiClient.getProduct(productId)
              productData = {
                nameFa: product.nameFa,
                image: product.image || "/placeholder.svg",
                price: product.discountPrice || product.price,
              }
            } catch {
              throw new Error("خطا در افزودن محصول به سبد")
            }
          }

          const newItem: CartItem = {
            id: `guest_${productId}_${Date.now()}`,
            productId,
            name: productData.nameFa,
            nameFa: productData.nameFa,
            image: productData.image,
            quantity,
            price: productData.price,
            total: productData.price * quantity,
          }
          currentCart.items.push(newItem)
        }

        const updatedCart = recalculateCart(currentCart.items)
        saveGuestCart(updatedCart)
        setCart(updatedCart)
      }
    },
    [isAuthenticated, refresh],
  )

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      if (isAuthenticated) {
        await apiClient.updateCartItem(itemId, quantity)
        await refresh()
      } else {
        const currentCart = getGuestCart()
        const itemIndex = currentCart.items.findIndex((item) => item.id === itemId)

        if (itemIndex >= 0) {
          if (quantity <= 0) {
            currentCart.items.splice(itemIndex, 1)
          } else {
            currentCart.items[itemIndex].quantity = quantity
            currentCart.items[itemIndex].total = currentCart.items[itemIndex].price * quantity
          }

          const updatedCart = recalculateCart(currentCart.items)
          saveGuestCart(updatedCart)
          setCart(updatedCart)
        }
      }
    },
    [isAuthenticated, refresh],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      if (isAuthenticated) {
        await apiClient.removeCartItem(itemId)
        await refresh()
      } else {
        const currentCart = getGuestCart()
        const filteredItems = currentCart.items.filter((item) => item.id !== itemId)
        const updatedCart = recalculateCart(filteredItems)
        saveGuestCart(updatedCart)
        setCart(updatedCart)
      }
    },
    [isAuthenticated, refresh],
  )

  const clear = useCallback(async () => {
    if (isAuthenticated) {
      await apiClient.clearCart()
      await refresh()
    } else {
      clearGuestCart()
      setCart({ items: [], subtotal: 0, itemCount: 0, totalQuantity: 0 })
    }
  }, [isAuthenticated, refresh])

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
