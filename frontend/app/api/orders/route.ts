import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

// GET all orders
export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.toString()
    const data = await backendFetch(`/orders/all${search ? `?${search}` : ""}`, {}, { requireAuth: true })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت سفارشات", success: false },
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
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در ثبت سفارش", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
