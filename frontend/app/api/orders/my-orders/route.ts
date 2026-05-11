import { NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET() {
  try {
    const response = await backendFetch<any>("/orders/my-orders", {}, { requireAuth: true })
    const orders = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : []

    return NextResponse.json({ success: true, data: orders })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت سفارش‌های شما", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}


