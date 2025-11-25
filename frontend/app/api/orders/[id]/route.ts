import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

// GET single order
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await backendFetch(`/orders/${id}`, {}, { requireAuth: true })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت سفارش", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

// PATCH update order status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await request.json()
    const data = await backendFetch(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, { requireAuth: true })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در بروزرسانی وضعیت سفارش", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
