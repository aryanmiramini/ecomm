import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError, coerceArray, unwrapNestData } from "@/lib/server-api"

// GET all orders
export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.toString()
    const response = await backendFetch<any>(`/orders/all${search ? `?${search}` : ""}`, {}, { requireAuth: true })
    const payload = unwrapNestData(response) as { data?: unknown[]; total?: number; page?: number; limit?: number }
    const orders = coerceArray(payload?.data ?? payload)
    
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
    const idempotencyKey = request.headers.get("idempotency-key") || undefined
    const headers: HeadersInit = {}
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey
    }
    const raw = await backendFetch("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
      headers,
    }, { requireAuth: true })
    const data = unwrapNestData(raw)
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
