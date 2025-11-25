import { NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET() {
  try {
    const data = await backendFetch("/wishlist", {}, { requireAuth: true })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت لیست علاقه‌مندی‌ها", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

