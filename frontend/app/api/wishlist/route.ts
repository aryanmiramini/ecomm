import { NextResponse } from "next/server"
import { backendFetch, BackendRequestError, coerceArray, unwrapNestData } from "@/lib/server-api"

export async function GET() {
  try {
    const response = await backendFetch<any>("/wishlist", {}, { requireAuth: true })
    const items = coerceArray(unwrapNestData(response))
    return NextResponse.json({ success: true, data: items })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت لیست علاقه‌مندی‌ها", success: false, data: [] },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

