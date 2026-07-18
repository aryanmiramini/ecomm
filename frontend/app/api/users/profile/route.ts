import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError, unwrapNestData } from "@/lib/server-api"

export async function GET() {
  try {
    const raw = await backendFetch("/users/profile", {}, { requireAuth: true })
    const data = unwrapNestData(raw)
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت پروفایل کاربر", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json()
    const raw = await backendFetch(
      "/users/profile",
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      { requireAuth: true },
    )
    const data = unwrapNestData(raw)
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در بروزرسانی پروفایل کاربر", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
