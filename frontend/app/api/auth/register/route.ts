import { NextResponse, type NextRequest } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const data = await backendFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در ثبت نام" },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

