import { NextResponse, type NextRequest } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

interface RegisterResponse {
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
    const registerData = (await backendFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    })) as RegisterResponse
    let data: RegisterResponse = registerData

    if (!data?.access_token && payload?.email && payload?.password) {
      try {
        data = (await backendFetch("/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
          }),
        })) as RegisterResponse
      } catch {
        //
      }
    }

    const response = NextResponse.json(data, { status: 201 })

    if (data?.access_token) {
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
      { message: error?.message || "خطا در ثبت نام" },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
