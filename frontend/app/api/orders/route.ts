import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

// GET all orders
export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.toString()
    const response = await backendFetch<any>(`/orders/all${search ? `?${search}` : ""}`, {}, { requireAuth: true })
    
    // Ensure consistent response format
    const orders = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []
    
    return NextResponse.json({
      success: true,
      data: orders,
      total: response?.total || orders.length,
      page: response?.page || 1,
      limit: response?.limit || 10,
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در دریافت سفارشات", 
        messageFa: "خطا در دریافت سفارشات",
        success: false,
        data: [],
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

// POST create new order
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const data = await backendFetch("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }, { requireAuth: true })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در ثبت سفارش", 
        messageFa: "خطا در ثبت سفارش",
        success: false 
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
