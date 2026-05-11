import { NextResponse } from "next/server"
import { backendFetch } from "@/lib/server-api"

type PublicStatsPayload = {
  totalProducts: number
  totalCategories: number
  totalCustomers: number
  satisfactionRate: number
  totalApprovedReviews: number
  averageRating: number | null
  yearsInBusiness: number | null
}

const empty: PublicStatsPayload = {
  totalProducts: 0,
  totalCategories: 0,
  totalCustomers: 0,
  satisfactionRate: 0,
  totalApprovedReviews: 0,
  averageRating: null,
  yearsInBusiness: null,
}

export async function GET() {
  try {
    const res = await backendFetch<{ success?: boolean; data?: PublicStatsPayload }>("/public-stats")
    const stats = res && typeof res === "object" && "data" in res && res.data ? res.data : (res as PublicStatsPayload | null)
    if (!stats || typeof stats.totalProducts !== "number") {
      return NextResponse.json({ success: true, data: empty })
    }
    return NextResponse.json({
      success: true,
      data: {
        totalProducts: stats.totalProducts,
        totalCategories: stats.totalCategories,
        totalCustomers: stats.totalCustomers,
        satisfactionRate: stats.satisfactionRate,
        totalApprovedReviews: stats.totalApprovedReviews,
        averageRating: stats.averageRating,
        yearsInBusiness: stats.yearsInBusiness,
      },
    })
  } catch {
    return NextResponse.json({ success: true, data: empty })
  }
}
