"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import { apiEndpoints } from "@/lib/api"
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { t } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "ADMIN") {
      router.push("/")
      return
    }

    const fetchStats = async () => {
      try {
        setLoading(true)
        const [ordersRes, productsRes, usersRes, orderStatsRes] = await Promise.all([
          apiEndpoints.getAllOrders({ limit: 1 }),
          apiEndpoints.getProducts({ limit: 1 }),
          apiEndpoints.getAllUsers().catch(() => ({ data: [] })),
          apiEndpoints.getOrderStats().catch(() => ({ data: {} })),
        ])

        const orders = ordersRes.data.data || ordersRes.data || []
        const products = productsRes.data.data || productsRes.data || []
        const users = usersRes.data.data || usersRes.data || []
        const orderStats = orderStatsRes.data.data || orderStatsRes.data || {}

        setStats({
          totalOrders: ordersRes.data.total || 0,
          totalProducts: productsRes.data.total || products.length,
          totalUsers: users.length,
          totalRevenue: orderStats.totalRevenue || 0,
          pendingOrders: orderStats.pendingOrders || 0,
          completedOrders: orderStats.completedOrders || 0,
        })
        setError(null)
      } catch (err: any) {
        console.error("Failed to fetch stats:", err)
        setError(err.response?.data?.message || "Failed to load dashboard stats")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user, router])

  if (!user || user.role !== "ADMIN") {
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 size={48} className="text-[rgb(159,31,92)] animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={24} />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      link: "/admin/orders",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "from-green-500 to-green-600",
      link: "/admin/products",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      link: "/admin/users",
    },
    {
      title: "Total Revenue",
      value: `${(stats?.totalRevenue || 0).toLocaleString()} ${t("currency") || "Toman"}`,
      icon: DollarSign,
      color: "from-[rgb(159,31,92)] to-[rgb(133,30,90)]",
      link: "/admin/orders",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage your e-commerce platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-[rgb(159,31,92)]/20 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <TrendingUp className="text-gray-400 group-hover:text-[rgb(159,31,92)] transition-colors" size={20} />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-[rgb(159,31,92)]/20 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Products</h3>
              <p className="text-sm text-gray-600">Add, edit, or delete products</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-[rgb(159,31,92)]/20 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingCart className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Orders</h3>
              <p className="text-sm text-gray-600">View and update order status</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-[rgb(159,31,92)]/20 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="text-white" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage user accounts</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

