import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET() {
  try {
    const data = await backendFetch("/users/profile", {}, { requireAuth: true })
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
    const data = await backendFetch(
      "/users/profile",
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      { requireAuth: true },
    )
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در بروزرسانی پروفایل کاربر", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}


