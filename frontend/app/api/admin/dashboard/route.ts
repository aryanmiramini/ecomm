import { NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"
import { mapOrder, mapProduct } from "@/lib/api-mappers"

export async function GET() {
  try {
    // Fetch stats from orders endpoint
    const orderStats = await backendFetch<{ totalOrders?: number; totalRevenue?: number }>("/orders/stats/overview", {}, { requireAuth: true })
    
    // Fetch products count and featured products
    const productsResponse = await backendFetch<{ data?: any[]; total?: number }>("/products?limit=100&page=1")
    const totalProducts = productsResponse.total || 0
    const featuredProducts = Array.isArray(productsResponse.data) 
      ? productsResponse.data.filter((p: any) => p.isFeatured).slice(0, 5).map(mapProduct)
      : []

    // Fetch recent orders
    const ordersResponse = await backendFetch<{ data?: any[] }>("/orders/all?limit=5&page=1", {}, { requireAuth: true })
    const recentOrders = Array.isArray(ordersResponse.data)
      ? ordersResponse.data.map(mapOrder)
      : []

    // Fetch users count (admin only)
    let totalCustomers = 0
    try {
      const usersResponse = await backendFetch<any>("/users", {}, { requireAuth: true })
      if (Array.isArray(usersResponse)) {
        totalCustomers = usersResponse.filter((u: any) => u.role === "CUSTOMER").length
      } else if (usersResponse.data && Array.isArray(usersResponse.data)) {
        totalCustomers = usersResponse.data.filter((u: any) => u.role === "CUSTOMER").length
      }
    } catch (error) {
      // If users endpoint fails, just set to 0
      console.warn("Could not fetch users count:", error)
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders: orderStats.totalOrders || 0,
        totalRevenue: orderStats.totalRevenue || 0,
        totalProducts,
        totalCustomers,
        recentOrders,
        topProducts: featuredProducts,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت آمار داشبورد", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
