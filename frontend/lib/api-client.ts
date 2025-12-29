import { mapCart, mapCategory, mapOrder, mapProduct } from "./api-mappers"
import type { CartSummary, Category, DashboardStats, Order, Product, User, UserProfile } from "./types"

const API_BASE_URL = "/api"

type GetProductsParams = {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  sort?: "newest" | "price-low" | "price-high" | "popular"
  featured?: boolean
}

type ApiResponse<T = any> = {
  success: boolean
  data?: T
  message?: string
  messageEn?: string
  messageFa?: string
  code?: string
  details?: any
  timestamp?: string
  path?: string
  total?: number
  page?: number
  limit?: number
}

const mapUser = (user: any): User => {
  return {
    id: user.id,
    email: user.email || null,
    phone: user.phone || null,
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    role: (user.role || "CUSTOMER") as User["role"],
    isActive: user.isActive ?? true,
    createdAt: user.createdAt || new Date().toISOString(),
  }
}

export class ApiClient {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  }

  private async fetchApi<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = this.getToken()
    
    const headers = new Headers(options?.headers)
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }
    if (!headers.has("Accept-Language")) {
      headers.set("Accept-Language", "fa") // Default to Persian
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const responseText = await response.text()
    let responseData: any = null
    
    try {
      responseData = responseText ? JSON.parse(responseText) : null
    } catch (e) {
      // If not JSON, treat as text
      responseData = responseText
    }

    if (!response.ok) {
      // Extract error message with priority: messageFa > message > messageEn
      let errorMessage = "خطا در ارتباط با سرور"
      
      if (responseData && typeof responseData === 'object') {
        errorMessage = responseData.messageFa || 
                      responseData.message || 
                      responseData.messageEn ||
                      errorMessage
      }

      const error = new Error(errorMessage) as Error & { 
        status?: number
        code?: string
        details?: any 
      }
      error.status = response.status
      error.code = responseData?.code
      error.details = responseData?.details
      throw error
    }

    return responseData as T
  }

  private normalizeProductPayload(data: any) {
    const payload: any = { ...data }

    if ("discountPrice" in payload) {
      const basePrice = Number(payload.price ?? 0)
      const discountPrice = payload.discountPrice !== undefined && payload.discountPrice !== null
        ? Number(payload.discountPrice)
        : NaN

      delete payload.discountPrice

      // If a discount price exists, treat current price as original and send discounted values
      if (!Number.isNaN(discountPrice) && discountPrice > 0) {
        const originalPrice = basePrice > 0 ? basePrice : discountPrice
        payload.originalPrice = originalPrice
        payload.price = discountPrice
        if (originalPrice > discountPrice) {
          payload.discountPercentage = Number(
            (((originalPrice - discountPrice) / originalPrice) * 100).toFixed(2),
          )
        }
      } else if (!Number.isNaN(basePrice)) {
        payload.price = basePrice
      }
    }

    return payload
  }

  // Products
  async getProducts(params: GetProductsParams = {}) {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set("page", params.page.toString())
    if (params.limit) searchParams.set("limit", params.limit.toString())
    if (params.search) searchParams.set("search", params.search)
    if (params.categoryId) searchParams.set("categoryId", params.categoryId)
    if (params.sort) {
      const sortMap: Record<string, string> = {
        "newest": "newest",
        "price-low": "price-asc",
        "price-high": "price-desc",
        "popular": "popular",
      }
      searchParams.set("sort", sortMap[params.sort] || "newest")
    }

    const response = await this.fetchApi<ApiResponse>(`/products${searchParams.toString() ? `?${searchParams}` : ""}`)
    
    const products = Array.isArray(response.data) 
      ? response.data.map(mapProduct) 
      : []
    
    const filteredProducts = params.featured 
      ? products.filter((p) => p.featured) 
      : products

    return {
      products: filteredProducts,
      total: response.total ?? filteredProducts.length,
      page: response.page ?? 1,
      limit: response.limit ?? 10,
    }
  }

  async getProduct(id: string) {
    const response = await this.fetchApi<ApiResponse>(`/products/${id}`)
    return { product: mapProduct(response.data) }
  }

  async createProduct(data: any) {
    const payload = this.normalizeProductPayload(data)
    const response = await this.fetchApi<ApiResponse>("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    return response.data
  }

  async updateProduct(id: string, data: any) {
    const payload = this.normalizeProductPayload(data)
    const response = await this.fetchApi<ApiResponse>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
    return response.data
  }

  async deleteProduct(id: string) {
    const response = await this.fetchApi<ApiResponse>(`/products/${id}`, {
      method: "DELETE",
    })
    return response
  }

  // Categories
  async getCategories() {
    const response = await this.fetchApi<ApiResponse>("/categories")
    const categories = Array.isArray(response.data) 
      ? response.data.map(mapCategory)
      : []
    return { categories }
  }

  async createCategory(data: any) {
    const response = await this.fetchApi<ApiResponse>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.data
  }

  async updateCategory(id: string, data: any) {
    const response = await this.fetchApi<ApiResponse>(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
    return response.data
  }

  async deleteCategory(id: string) {
    const response = await this.fetchApi<ApiResponse>(`/categories/${id}`, {
      method: "DELETE",
    })
    return response
  }

  async getCategory(id: string) {
    const response = await this.fetchApi<ApiResponse>(`/categories/${id}`)
    const categoryData = response.data
    return {
      category: mapCategory(categoryData),
      products: Array.isArray(categoryData.products) 
        ? categoryData.products.map(mapProduct) 
        : [],
    }
  }

  // Orders
  async getOrders() {
    const response = await this.fetchApi<ApiResponse>("/orders")
    return {
      orders: Array.isArray(response.data) 
        ? response.data.map(mapOrder) 
        : [],
      total: response.total ?? 0,
      page: response.page ?? 1,
      limit: response.limit ?? 10,
    }
  }

  async getMyOrders() {
    const response = await this.fetchApi<ApiResponse>("/orders/my-orders")
    return {
      orders: Array.isArray(response.data) 
        ? response.data.map(mapOrder)
        : [],
    }
  }

  async getOrder(id: string) {
    const response = await this.fetchApi<ApiResponse>(`/orders/${id}`)
    return { order: mapOrder(response.data) }
  }

  async createOrder(data: any) {
    const response = await this.fetchApi<ApiResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.data
  }

  async updateOrderStatus(id: string, status: string) {
    const statusMap: Record<string, string> = {
      pending: "PENDING",
      processing: "PROCESSING",
      shipped: "SHIPPED",
      delivered: "DELIVERED",
      cancelled: "CANCELLED",
    }
    const backendStatus = statusMap[status] || status.toUpperCase()
    
    const response = await this.fetchApi<ApiResponse>(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: backendStatus }),
    })
    return response.data
  }

  // Dashboard
  async getDashboardStats(): Promise<{ stats: DashboardStats }> {
    const response = await this.fetchApi<ApiResponse>("/admin/dashboard")
    return { stats: response.data as DashboardStats }
  }

  // Cart
  async getCart(): Promise<{ cart: CartSummary }> {
    const response = await this.fetchApi<ApiResponse>("/cart")
    return { cart: mapCart(response.data) }
  }

  async addToCart(payload: { productId: string; quantity?: number }) {
    const response = await this.fetchApi<ApiResponse>("/cart", {
      method: "POST",
      body: JSON.stringify({ quantity: 1, ...payload }),
    })
    return response.data
  }

  async updateCartItem(itemId: string, quantity: number) {
    const response = await this.fetchApi<ApiResponse>(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    })
    return response.data
  }

  async removeCartItem(itemId: string) {
    const response = await this.fetchApi<ApiResponse>(`/cart/items/${itemId}`, {
      method: "DELETE",
    })
    return response
  }

  async clearCart() {
    const response = await this.fetchApi<ApiResponse>("/cart/clear", {
      method: "DELETE",
    })
    return response
  }

  // Users
  async getUsers(): Promise<{ users: User[] }> {
    const response = await this.fetchApi<ApiResponse>("/users")
    const users = Array.isArray(response.data) 
      ? response.data.map(mapUser) 
      : []
    return { users }
  }

  async updateUser(id: string, data: any) {
    const response = await this.fetchApi<ApiResponse>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
    return response.data
  }

  async deleteUser(id: string) {
    const response = await this.fetchApi<ApiResponse>(`/users/${id}`, {
      method: "DELETE",
    })
    return response
  }

  async getProfile(): Promise<{ profile: UserProfile }> {
    const response = await this.fetchApi<ApiResponse>("/users/profile")
    const data = response.data
    return {
      profile: {
        id: data.id,
        email: data.email || null,
        phone: data.phone || null,
        firstName: data.firstName,
        lastName: data.lastName,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        role: (data.role || "CUSTOMER") as UserProfile["role"],
        createdAt: data.createdAt || new Date().toISOString(),
      },
    }
  }

  async updateProfile(data: Partial<UserProfile>) {
    const response = await this.fetchApi<ApiResponse>("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
    return response.data
  }

  // Auth
  async login(phone: string, password: string) {
    const response = await this.fetchApi<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, password }),
    })
    
    if (response.access_token) {
      localStorage.setItem('token', response.access_token)
    }
    
    return response
  }

  async register(data: any) {
    const response = await this.fetchApi<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
    
    if (response.access_token) {
      localStorage.setItem('token', response.access_token)
    }
    
    return response
  }

  async logout() {
    try {
      await this.fetchApi("/auth/logout", { method: "POST" })
    } finally {
      localStorage.removeItem('token')
    }
  }
      
  // Wishlist
  async getWishlist() {
    const response = await this.fetchApi<ApiResponse>("/wishlist")
    const products = Array.isArray(response.data) 
      ? response.data.map(mapProduct) 
      : []
    return { products }
  }

  async addToWishlist(productId: string) {
    const response = await this.fetchApi<ApiResponse>(`/wishlist/${productId}`, { 
      method: "POST" 
    })
    return response.data
  }

  async removeFromWishlist(productId: string) {
    const response = await this.fetchApi<ApiResponse>(`/wishlist/${productId}`, { 
      method: "DELETE" 
    })
    return response
  }

  async checkWishlist(productId: string) {
    const response = await this.fetchApi<ApiResponse>(`/wishlist/check/${productId}`)
    return response.data as { inWishlist: boolean }
  }

  // Notifications
  async getNotifications(unreadOnly = false) {
    const response = await this.fetchApi<ApiResponse>(
      `/notifications${unreadOnly ? "?unreadOnly=true" : ""}`
    )
    return { notifications: response.data || [] }
  }

  async markNotificationRead(id: string) {
    const response = await this.fetchApi<ApiResponse>(`/notifications/${id}/read`, { 
      method: "PATCH" 
    })
    return response.data
  }

  async markAllNotificationsRead() {
    const response = await this.fetchApi<ApiResponse>("/notifications/read-all", { 
      method: "PATCH" 
    })
    return response.data
  }

  // Reviews
  async getProductReviews(productId: string) {
    const response = await this.fetchApi<ApiResponse>(`/reviews/products/${productId}`)
    return { reviews: response.data || [] }
  }

  async addReview(productId: string, data: { rating: number; comment: string }) {
    const response = await this.fetchApi<ApiResponse>(`/reviews/products/${productId}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.data
  }

  async deleteReview(reviewId: string) {
    const response = await this.fetchApi<ApiResponse>(`/reviews/${reviewId}`, { 
      method: "DELETE" 
    })
    return response
  }
}

export const apiClient = new ApiClient()