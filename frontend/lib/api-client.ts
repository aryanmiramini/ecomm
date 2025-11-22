import { mapCategory, mapOrder, mapProduct } from "./api-mappers"
import type { Category, DashboardStats, Order, Product } from "./types"

const API_BASE_URL = "/api"

type BackendListResponse<T> = {
  data: T[]
  total?: number
  page?: number
  limit?: number
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
  async getProducts(params: { featured?: boolean } = {}) {
    const search = new URLSearchParams()
    if (params.featured) search.set("featured", "true")

    const response = await this.fetchApi<BackendListResponse<any>>(`/products${search.size ? `?${search}` : ""}`)
    return {
      products: Array.isArray(response.data) ? response.data.map(mapProduct) : [],
      total: response.total ?? response.data?.length ?? 0,
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

  // Orders
  async getOrders() {
    const response = await this.fetchApi<BackendListResponse<any>>("/orders")
    return {
      orders: Array.isArray(response.data) ? response.data.map(mapOrder) : [],
      total: response.total ?? response.data?.length ?? 0,
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
}

export const apiClient = new ApiClient()
