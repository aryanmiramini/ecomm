import { NextResponse, type NextRequest } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const data = (await backendFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    })) as { access_token?: string; user?: unknown }

    const response = NextResponse.json(data)
    if (data.access_token) {
      response.cookies.set("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      })
    }
    return response
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "کد نامعتبر است" },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
