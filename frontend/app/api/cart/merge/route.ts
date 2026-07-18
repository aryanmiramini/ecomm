import { NextResponse, type NextRequest } from "next/server"
import { backendFetch, BackendRequestError, unwrapNestData } from "@/lib/server-api"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const raw = await backendFetch(
      "/cart/merge",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      { requireAuth: true },
    )
    const data = unwrapNestData(raw)
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در ادغام سبد خرید", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
