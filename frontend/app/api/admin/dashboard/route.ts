import { NextResponse } from "next/server"
import { backendFetch, BackendRequestError, coerceArray, unwrapNestData } from "@/lib/server-api"
import { mapOrder, mapProduct } from "@/lib/api-mappers"

export async function GET() {
  try {
    // Initialize default values
    let orderStats = { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, deliveredOrders: 0 }
    let totalProducts = 0
    let featuredProducts: any[] = []
    let recentOrders: any[] = []
    let totalCustomers = 0

    // Fetch stats from orders endpoint
    try {
      const raw = await backendFetch<any>("/orders/stats/overview", {}, { requireAuth: true })
      const stats = unwrapNestData(raw) as typeof orderStats & { totalRevenue?: unknown }
      orderStats = {
        totalOrders: Number(stats?.totalOrders ?? 0),
        totalRevenue: Number(stats?.totalRevenue ?? 0),
        pendingOrders: Number(stats?.pendingOrders ?? 0),
        deliveredOrders: Number(stats?.deliveredOrders ?? 0),
      }
    } catch (error) {
      console.warn("Could not fetch order stats:", error)
    }
    
    // Fetch products count and featured products
    try {
      const productsResponse = await backendFetch<{ data?: any[]; total?: number }>("/products?limit=100&page=1")
      const productsPayload = unwrapNestData(productsResponse) as { data?: any[]; total?: number }
      const productList = coerceArray(productsPayload?.data ?? productsPayload)
      totalProducts = productsResponse?.total ?? productsPayload?.total ?? productList.length
      featuredProducts = productList.filter((p: any) => p.isFeatured).slice(0, 5).map(mapProduct)
    } catch (error) {
      console.warn("Could not fetch products:", error)
    }

    // Fetch recent orders
    try {
      const ordersResponse = await backendFetch<{ data?: any[] }>("/orders/all?limit=5&page=1", {}, { requireAuth: true })
      const ordersPayload = unwrapNestData(ordersResponse) as { data?: any[] }
      recentOrders = coerceArray(ordersPayload?.data ?? ordersPayload).map(mapOrder)
    } catch (error) {
      console.warn("Could not fetch recent orders:", error)
    }

    // Fetch users count (admin only)
    try {
      const usersResponse = await backendFetch<any>("/users", {}, { requireAuth: true })
      const users = coerceArray(unwrapNestData(usersResponse))
      totalCustomers = users.filter((u: any) => u.role === "CUSTOMER").length
    } catch (error) {
      console.warn("Could not fetch users count:", error)
    }

    return NextResponse.json({
      success: true,
      data: {
        totalOrders: orderStats.totalOrders,
        totalRevenue: orderStats.totalRevenue,
        pendingOrders: orderStats.pendingOrders,
        deliveredOrders: orderStats.deliveredOrders,
        totalProducts,
        totalCustomers,
        recentOrders,
        topProducts: featuredProducts,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در دریافت آمار داشبورد", 
        messageFa: "خطا در دریافت آمار داشبورد",
        success: false 
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
