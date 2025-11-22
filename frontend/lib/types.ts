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
  email: string
  name: string
  role: "admin" | "customer"
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
