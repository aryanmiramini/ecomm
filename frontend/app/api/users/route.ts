import { NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET() {
  try {
    const data = await backendFetch("/users", {}, { requireAuth: true })
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت کاربران", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}


