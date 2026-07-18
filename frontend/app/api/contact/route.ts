import { NextResponse, type NextRequest } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const data = await backendFetch("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در ارسال پیام" },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
