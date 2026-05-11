import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    const formData = await request.formData()
    
    const response = await fetch(`${BACKEND_URL}/uploads/image`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { 
          message: errorData.message || errorData.messageFa || "خطا در آپلود تصویر", 
          success: false 
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { message: error?.message || "خطا در آپلود تصویر", success: false },
      { status: 500 },
    )
  }
}

