import { create } from "zustand"
import { persist } from "zustand/middleware"
import { apiEndpoints } from "@/lib/api"

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
  isLoading: boolean
  error: string | null
  fetchCart: () => Promise<void>
  addItem: (productId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clear: () => Promise<void>
  calculateTotal: () => void
}

// @ts-expect-error - zustand persist middleware typing issue
export const useCartStore = create<CartStore>(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiEndpoints.getCart()
          const cartData = response.data.data || response.data
          
          // Handle different response formats
          let items: CartItem[] = []
          
          // Check if response has cart.items structure (from getCartSummary)
          if (cartData.cart?.items && Array.isArray(cartData.cart.items)) {
            items = cartData.cart.items.map((item: any) => ({
              id: item.id?.toString() || item.itemId?.toString(),
              productId: item.product?.id?.toString() || item.productId?.toString(),
              quantity: item.quantity || 1,
              price: item.product?.price || item.itemTotal / item.quantity || 0,
              product: item.product || {},
            }))
          } else if (cartData.items && Array.isArray(cartData.items)) {
            // Response has items array directly
            items = cartData.items.map((item: any) => ({
              id: item.id?.toString() || item.itemId?.toString() || item.cartItemId?.toString(),
              productId: item.productId?.toString() || item.product?.id?.toString(),
              quantity: item.quantity || 1,
              price: item.price || item.product?.price || 0,
              product: item.product || {},
            }))
          } else if (Array.isArray(cartData)) {
            // Response is directly an array
            items = cartData.map((item: any) => ({
              id: item.id?.toString() || item.itemId?.toString(),
              productId: item.productId?.toString() || item.product?.id?.toString(),
              quantity: item.quantity || 1,
              price: item.price || item.product?.price || 0,
              product: item.product || {},
            }))
          }

          set({ items, isLoading: false })
          get().calculateTotal()
        } catch (error: any) {
          console.error("Failed to fetch cart:", error)
          // If 401, user is not authenticated, clear cart
          if (error.response?.status === 401) {
            set({ items: [], total: 0, isLoading: false, error: null })
          } else {
            set({ isLoading: false, error: error.response?.data?.message || "Failed to load cart" })
          }
        }
      },

      addItem: async (productId: string, quantity: number = 1) => {
        set({ isLoading: true, error: null })
        try {
          await apiEndpoints.addToCart({ productId, quantity })
          // Refresh cart from server
          await get().fetchCart()
        } catch (error: any) {
          console.error("Failed to add item to cart:", error)
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || "Failed to add item to cart" 
          })
          throw error
        }
      },

      removeItem: async (itemId: string) => {
        set({ isLoading: true, error: null })
        try {
          await apiEndpoints.removeCartItem(itemId)
          // Refresh cart from server
          await get().fetchCart()
        } catch (error: any) {
          console.error("Failed to remove item from cart:", error)
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || "Failed to remove item from cart" 
          })
          throw error
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        if (quantity < 1) {
          await get().removeItem(itemId)
          return
        }
        
        set({ isLoading: true, error: null })
        try {
          await apiEndpoints.updateCartItem(itemId, { quantity })
          // Refresh cart from server
          await get().fetchCart()
        } catch (error: any) {
          console.error("Failed to update cart item:", error)
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || "Failed to update cart item" 
          })
          throw error
        }
      },

      clear: async () => {
        set({ isLoading: true, error: null })
        try {
          await apiEndpoints.clearCart()
          set({ items: [], total: 0, isLoading: false })
        } catch (error: any) {
          console.error("Failed to clear cart:", error)
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || "Failed to clear cart" 
          })
          throw error
        }
      },

      calculateTotal: () => {
        const total = get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        set({ total })
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items, total: state.total }),
    },
  ),
)
