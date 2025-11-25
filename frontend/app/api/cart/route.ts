import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET() {
  try {
    const data = await backendFetch("/cart/summary", {}, { requireAuth: true })
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت سبد خرید", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const data = await backendFetch(
      "/cart/add",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      { requireAuth: true },
    )
    return NextResponse.json({ data, success: true }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در افزودن به سبد خرید", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}


