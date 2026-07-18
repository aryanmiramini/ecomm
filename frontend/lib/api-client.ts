import { mapCart, mapCategory, mapOrder, mapProduct } from "./api-mappers"
import { coerceArray, unwrapNestedEnvelope } from "./api-unwrap"
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
  private async fetchApi<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers = new Headers(options?.headers)
    const isFormData = options?.body instanceof FormData
    if (!headers.has("Content-Type") && !isFormData) {
      headers.set("Content-Type", "application/json")
    }
    if (!headers.has("Accept-Language")) {
      headers.set("Accept-Language", "fa")
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", 
    })

    const responseText = await response.text()
    let responseData: any = null
    
    try {
      responseData = responseText ? JSON.parse(responseText) : null
    } catch (e) {
      responseData = responseText
    }

    if (!response.ok) {
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
    const payload: any = {}

    // Copy only valid fields
    if (data.name) payload.name = data.name
    if (data.description) payload.description = data.description
    if (data.sku) payload.sku = data.sku
    if (data.categoryId) payload.categoryId = data.categoryId
    if (data.quantity !== undefined) payload.quantity = Number(data.quantity)
    if (data.images && Array.isArray(data.images)) payload.images = data.images
    if (data.isActive !== undefined) payload.isActive = Boolean(data.isActive)
    if (data.isFeatured !== undefined) payload.isFeatured = Boolean(data.isFeatured)

    // Handle price and discount
    const basePrice = Number(data.price ?? 0)
    const discountPrice = data.discountPrice !== undefined && data.discountPrice !== null && data.discountPrice !== ""
      ? Number(data.discountPrice)
      : NaN

    if (!Number.isNaN(discountPrice) && discountPrice > 0 && basePrice > discountPrice) {
      // Has discount: originalPrice is the higher price, price is the discounted price
      payload.originalPrice = basePrice
      payload.price = discountPrice
      payload.discountPercentage = Number(
        (((basePrice - discountPrice) / basePrice) * 100).toFixed(2),
      )
    } else if (basePrice > 0) {
      payload.price = basePrice
      // Clear discount fields if no discount
      payload.originalPrice = undefined
      payload.discountPercentage = undefined
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
    
    const products = coerceArray(response.data ?? response).map(mapProduct)
    
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
    const productData = response.data || response
    return { product: mapProduct(productData) }
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
    const categories = coerceArray(response.data ?? response).map(mapCategory)
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
    const categoryData = response.data || response
    return {
      category: mapCategory(categoryData),
      products: Array.isArray(categoryData?.products) 
        ? categoryData.products.map(mapProduct) 
        : [],
    }
  }

  // Orders
  async getOrders() {
    const response = await this.fetchApi<ApiResponse>("/orders")
    return {
      orders: coerceArray(response.data ?? response).map(mapOrder),
      total: response.total ?? 0,
      page: response.page ?? 1,
      limit: response.limit ?? 10,
    }
  }

  async getMyOrders() {
    const response = await this.fetchApi<ApiResponse | any[]>("/orders/my-orders")
    const ordersData = Array.isArray(response) ? response : response?.data
    return {
      orders: coerceArray(ordersData).map(mapOrder),
    }
  }

  async getOrder(id: string) {
    const response = await this.fetchApi<ApiResponse>(`/orders/${id}`)
    const orderData = response.data || response
    return { order: mapOrder(orderData) }
  }

  async createOrder(data: any, idempotencyKey?: string) {
    const headers: Record<string, string> = {}
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey
    }
    const response = await this.fetchApi<ApiResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
      headers,
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
    const data = unwrapNestedEnvelope<Record<string, unknown>>(response.data ?? response)
    return {
      stats: {
        totalOrders: Number(data.totalOrders ?? 0),
        totalRevenue: Number(data.totalRevenue ?? 0),
        totalProducts: Number(data.totalProducts ?? 0),
        totalCustomers: Number(data.totalCustomers ?? 0),
        recentOrders: coerceArray(data.recentOrders).map(mapOrder),
        topProducts: coerceArray(data.topProducts).map(mapProduct),
      },
    }
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

  async mergeCart(items: Array<{ productId: string; quantity: number }>) {
    const response = await this.fetchApi<ApiResponse>("/cart/merge", {
      method: "POST",
      body: JSON.stringify({ items }),
    })
    return response.data
  }

  async requestOtp(phone: string) {
    return this.fetchApi<any>("/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    })
  }

  async verifyOtp(phone: string, code: string) {
    return this.fetchApi<any>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, code }),
    })
  }

  // Users
  async getUsers(): Promise<{ users: User[] }> {
    const response = await this.fetchApi<ApiResponse>("/users")
    const users = coerceArray(response.data).map(mapUser)
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
    const data = unwrapNestedEnvelope<any>(response.data ?? response)

    if (!data?.id) {
      throw new Error("پروفایل کاربر یافت نشد")
    }
    
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

  // Auth - token is managed via httpOnly cookies, no localStorage needed
  async login(email: string, password: string) {
    const response = await this.fetchApi<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    return response
  }

  async register(data: any) {
    const response = await this.fetchApi<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response
  }

  async logout() {
    await this.fetchApi("/auth/logout", { method: "POST" })
  }
      
  // Wishlist
  async getWishlist() {
    const response = await this.fetchApi<ApiResponse>("/wishlist")
    const products = coerceArray(response.data)
      .map((item: any) => mapProduct(item?.product ?? item))
      .filter((item: Product) => Boolean(item.id))
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
    if (typeof response.data === "boolean") {
      return { inWishlist: response.data }
    }
    return response.data as { inWishlist: boolean }
  }

  // Notifications
  async getNotifications(unreadOnly = false) {
    const response = await this.fetchApi<ApiResponse>(
      `/notifications${unreadOnly ? "?unreadOnly=true" : ""}`
    )
    const notifications = coerceArray(response.data ?? response).map((n: any) => ({
      ...n,
      isRead: n.isRead ?? n.read ?? false,
    }))
    return { notifications }
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
    return { reviews: coerceArray(response.data ?? response) }
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

  // Uploads
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append("file", file)
    const response = await this.fetchApi<ApiResponse<any>>("/uploads/image", {
      method: "POST",
      body: formData,
    })
    const data = response.data?.url ? response.data : response.data?.data || response.data
    return { url: data?.url || "" }
  }

  async uploadImages(files: File[]): Promise<{ urls: string[] }> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append("files", file)
    })
    const response = await this.fetchApi<ApiResponse<any>>("/uploads/images", {
      method: "POST",
      body: formData,
    })
    const data = response.data?.urls ? response.data : response.data?.data || response.data
    return { urls: data?.urls || [] }
  }
}

export const apiClient = new ApiClient()