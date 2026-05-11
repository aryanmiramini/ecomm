import { NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET() {
  try {
    const response = await backendFetch<any>("/wishlist", {}, { requireAuth: true })
    // Backend may return { data: [...] } or just [...] - normalize it
    const items = Array.isArray(response) ? response : (response?.data || response?.items || [])
    return NextResponse.json({ success: true, data: items })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت لیست علاقه‌مندی‌ها", success: false, data: [] },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

