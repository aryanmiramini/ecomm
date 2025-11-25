import { NextResponse, type NextRequest } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

interface LoginResponse {
  access_token?: string
  user?: {
    id: string
    email: string | null
    phone: string | null
    firstName?: string | null
    lastName?: string | null
    role: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const data = await backendFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }) as LoginResponse

    // Set cookie with token
    const response = NextResponse.json(data, { status: 200 })
    
    if (data.access_token) {
      response.cookies.set("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })
    }

    return response
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در ورود" },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

