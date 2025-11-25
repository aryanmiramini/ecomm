export interface Product {
  id: string
  name: string
  nameFa: string
  description: string
  descriptionFa: string
  price: number
  discountPrice?: number
  image: string
  images: string[]
  category: string
  categoryFa: string
  stock: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  nameFa: string
  description: string
  descriptionFa: string
  image: string
  productCount: number
}

export interface CartItem {
  id: string
  productId: string
  name: string
  nameFa: string
  image: string
  quantity: number
  price: number
  total: number
}

export interface CartSummary {
  items: CartItem[]
  subtotal: number
  itemCount: number
  totalQuantity: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
  postalCode: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  productNameFa: string
  quantity: number
  price: number
  image: string
}

export interface User {
  id: string
  email: string | null
  phone: string | null
  firstName?: string | null
  lastName?: string | null
  role: "ADMIN" | "CUSTOMER"
  isActive: boolean
  createdAt: string
}

export interface UserProfile {
  id: string
  email: string | null
  phone: string | null
  firstName?: string | null
  lastName?: string | null
  shippingAddress?: string | null
  billingAddress?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
  role: "ADMIN" | "CUSTOMER"
  createdAt: string
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  recentOrders: Order[]
  topProducts: Product[]
}
