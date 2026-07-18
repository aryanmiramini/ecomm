import { NextResponse } from "next/server"
import { backendFetch, BackendRequestError, coerceArray, unwrapNestData } from "@/lib/server-api"

export async function GET() {
  try {
    const response = await backendFetch<any>("/orders/my-orders", {}, { requireAuth: true })
    const orders = coerceArray(unwrapNestData(response))
    return NextResponse.json({ success: true, data: orders })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت سفارش‌های شما", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}


