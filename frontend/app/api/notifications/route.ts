import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.toString()
    const data = await backendFetch(`/notifications${search ? `?${search}` : ""}`, {}, { requireAuth: true })
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت اعلان‌ها", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

