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

type BackendListResponse<T> = {
  data: T[]
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
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "خطا در ارتباط با سرور" }))
      throw new Error(error.message || "خطای سرور")
    }

    return response.json()
  }

  // Products
  async getProducts(params: GetProductsParams = {}) {
    const search = new URLSearchParams()
    if (params.page) search.set("page", params.page.toString())
    if (params.limit) search.set("limit", params.limit.toString())
    if (params.search) search.set("search", params.search)
    if (params.categoryId) search.set("categoryId", params.categoryId)
    if (params.sort && params.sort !== "newest") {
      const sortMap: Record<string, string> = {
        "price-low": "price-asc",
        "price-high": "price-desc",
        popular: "popular",
      }
      const sortValue = sortMap[params.sort]
      if (sortValue) search.set("sort", sortValue)
    }

    const response = await this.fetchApi<BackendListResponse<any>>(`/products${search.size ? `?${search}` : ""}`)
    const products = Array.isArray(response.data) ? response.data.map(mapProduct) : []
    const filteredProducts = params.featured ? products.filter((p) => p.featured) : products
    return {
      products: filteredProducts,
      total: response.total ?? filteredProducts.length ?? 0,
    }
  }

  async getProduct(id: string) {
    const response = await this.fetchApi<any>(`/products/${id}`)
    // Handle both direct product response and wrapped response
    const productData = response.data || response
    return { product: mapProduct(productData) }
  }

  async createProduct(data: any) {
    return this.fetchApi("/products", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateProduct(id: string, data: any) {
    return this.fetchApi(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(id: string) {
    return this.fetchApi(`/products/${id}`, {
      method: "DELETE",
    })
  }

  // Categories
  async getCategories() {
    const response = await this.fetchApi<{ data?: any[]; success?: boolean } | any[]>("/categories")
    // Handle both array response and wrapped response
    const categoriesArray = Array.isArray(response) 
      ? response 
      : (Array.isArray((response as any).data) ? (response as any).data : [])
    return {
      categories: categoriesArray.map(mapCategory),
    }
  }

  async createCategory(data: any) {
    return this.fetchApi("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCategory(id: string, data: any) {
    return this.fetchApi(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(id: string) {
    return this.fetchApi(`/categories/${id}`, {
      method: "DELETE",
    })
  }

  async getCategory(id: string) {
    const response = await this.fetchApi<{ data?: any }>(`/categories/${id}`)
    const categoryData = response.data || response
    return {
      category: mapCategory(categoryData),
      products: Array.isArray(categoryData.products) ? categoryData.products.map(mapProduct) : [],
    }
  }

  // Orders
  async getOrders() {
    const response = await this.fetchApi<BackendListResponse<any>>("/orders")
    return {
      orders: Array.isArray(response.data) ? response.data.map(mapOrder) : [],
      total: response.total ?? response.data?.length ?? 0,
    }
  }

  async getMyOrders() {
    const response = await this.fetchApi<{ orders: any[] }>("/orders/my-orders")
    return {
      orders: response.orders || [],
    }
  }

  async getOrder(id: string) {
    const response = await this.fetchApi<any>(`/orders/${id}`)
    // Handle both direct order response and wrapped response
    const orderData = response.data || response
    return { order: mapOrder(orderData) }
  }

  async createOrder(data: any) {
    return this.fetchApi("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateOrderStatus(id: string, status: string) {
    return this.fetchApi(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  // Dashboard
  async getDashboardStats(): Promise<{ stats: DashboardStats }> {
    const response = await this.fetchApi<{ success: boolean; stats: DashboardStats }>("/admin/dashboard")
    return { stats: response.stats }
  }

  // Cart
  async getCart(): Promise<{ cart: CartSummary }> {
    const response = await this.fetchApi<{ data?: any }>("/cart")
    const data = response.data || response
    return { cart: mapCart(data) }
  }

  async addToCart(payload: { productId: string; quantity?: number }) {
    return this.fetchApi("/cart", {
      method: "POST",
      body: JSON.stringify({ quantity: 1, ...payload }),
    })
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.fetchApi(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    })
  }

  async removeCartItem(itemId: string) {
    return this.fetchApi(`/cart/items/${itemId}`, {
      method: "DELETE",
    })
  }

  async clearCart() {
    return this.fetchApi("/cart/clear", {
      method: "DELETE",
    })
  }

  // Users
  async getUsers(): Promise<{ users: User[] }> {
    const response = await this.fetchApi<{ data?: any[] }>("/users")
    const payload = (response as any)?.data ?? response
    const users = Array.isArray(payload) ? payload.map(mapUser) : []
    return { users }
  }

  async updateUser(id: string, data: any) {
    return this.fetchApi(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: string) {
    return this.fetchApi(`/users/${id}`, {
      method: "DELETE",
    })
  }

  async getProfile(): Promise<{ profile: UserProfile }> {
    const response = await this.fetchApi<{ data?: any }>("/users/profile")
    const data = response.data || response
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
    return this.fetchApi("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async logout() {
    return this.fetchApi("/auth/logout", { method: "POST" })
  }
      
  // Wishlist
  async getWishlist() {
    const response = await this.fetchApi<{ data: Product[] }>("/wishlist")
    // Assuming backend returns products directly or wrapped
    const products = Array.isArray(response) ? response : (response.data || [])
    return { products: products.map(mapProduct) }
  }

  async addToWishlist(productId: string) {
    return this.fetchApi(`/wishlist/${productId}`, { method: "POST" })
  }

  async removeFromWishlist(productId: string) {
    return this.fetchApi(`/wishlist/${productId}`, { method: "DELETE" })
  }

  async checkWishlist(productId: string) {
    return this.fetchApi<{ inWishlist: boolean }>(`/wishlist/check/${productId}`)
  }

  // Notifications
  async getNotifications(unreadOnly = false) {
    const response = await this.fetchApi<{ data: any[] }>(`/notifications${unreadOnly ? "?unreadOnly=true" : ""}`)
    return { notifications: response.data || [] }
  }

  async markNotificationRead(id: string) {
    return this.fetchApi(`/notifications/${id}/read`, { method: "PATCH" })
  }

  async markAllNotificationsRead() {
    return this.fetchApi("/notifications/read-all", { method: "PATCH" })
  }

  // Reviews
  async getProductReviews(productId: string) {
    const response = await this.fetchApi<{ data: any[] }>(`/reviews/products/${productId}`)
    return { reviews: response.data || [] }
  }

  async addReview(productId: string, data: { rating: number; comment: string }) {
    return this.fetchApi(`/reviews/products/${productId}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteReview(reviewId: string) {
    return this.fetchApi(`/reviews/${reviewId}`, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()

