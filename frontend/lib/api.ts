import axios from "axios"
import Cookies from "js-cookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token")
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export const apiEndpoints = {
  // Auth
  login: (data: any) => api.post("/auth/login", data),
  register: (data: any) => api.post("/auth/register", data),
  forgotPassword: (data: any) => api.post("/auth/forgot-password", data),
  resetPassword: (data: any) => api.post("/auth/reset-password", data),

  // Users
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: any) => api.patch("/users/profile", data),

  // Products
  getProducts: (params?: any) => api.get("/products", { params }),
  getProductById: (id: string) => api.get(`/products/${id}`),
  getCategories: () => api.get("/products/categories/all"),
  getCategoryById: (id: string) => api.get(`/products/categories/${id}`),

  // Cart
  addToCart: (data: any) => api.post("/cart/add", data),
  getCart: () => api.get("/cart/summary"),
  updateCartItem: (itemId: string, data: any) => api.patch(`/cart/items/${itemId}`, data),
  removeCartItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete("/cart/clear"),

  // Orders
  createOrder: (data: any) => api.post("/orders", data),
  getMyOrders: (params?: any) => api.get("/orders/my-orders", { params }),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
  cancelOrder: (id: string) => api.patch(`/orders/${id}/cancel`),

  // Reviews
  getProductReviews: (productId: string) => api.get(`/reviews/products/${productId}`),
  createReview: (productId: string, data: any) => api.post(`/reviews/products/${productId}`, data),
  getMyReviews: () => api.get("/reviews/my-reviews"),
  updateReview: (reviewId: string, data: any) => api.patch(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId: string) => api.delete(`/reviews/${reviewId}`),

  // Wishlist
  addToWishlist: (productId: string) => api.post(`/wishlist/${productId}`),
  getWishlist: () => api.get("/wishlist"),
  removeFromWishlist: (productId: string) => api.delete(`/wishlist/${productId}`),
  checkWishlist: (productId: string) => api.get(`/wishlist/check/${productId}`),

  // Notifications
  getNotifications: (params?: any) => api.get("/notifications", { params }),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/notifications/read-all"),

  // Admin endpoints
  // Products
  createProduct: (data: any) => api.post("/products", data),
  updateProduct: (id: string, data: any) => api.patch(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  updateProductInventory: (id: string, quantity: number) => api.patch(`/products/${id}/inventory`, { quantity }),
  
  // Categories
  createCategory: (data: any) => api.post("/products/categories", data),
  updateCategory: (id: string, data: any) => api.patch(`/products/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/products/categories/${id}`),
  
  // Orders
  getAllOrders: (params?: any) => api.get("/orders/all", { params }),
  updateOrderStatus: (id: string, data: any) => api.patch(`/orders/${id}/status`, data),
  deleteOrder: (id: string) => api.delete(`/orders/${id}`),
  getOrderStats: () => api.get("/orders/stats/overview"),
  
  // Users
  getAllUsers: () => api.get("/users"),
  getUserById: (id: string) => api.get(`/users/${id}`),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
}

export default api
