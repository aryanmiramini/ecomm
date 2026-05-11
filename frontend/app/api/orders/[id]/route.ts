import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError, unwrapNestData } from "@/lib/server-api"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await backendFetch(`/orders/${id}`, {}, { requireAuth: true })
    const data = unwrapNestData(raw)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در دریافت سفارش", 
        messageFa: "خطا در دریافت سفارش",
        success: false 
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

// PATCH update order status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await request.json()
    const raw = await backendFetch(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, { requireAuth: true })
    const data = unwrapNestData(raw)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در بروزرسانی وضعیت سفارش", 
        messageFa: "خطا در بروزرسانی وضعیت سفارش",
        success: false 
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
