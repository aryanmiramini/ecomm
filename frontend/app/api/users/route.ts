import { NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET() {
  try {
    const response = await backendFetch<any>("/users", {}, { requireAuth: true })
    
    // Ensure consistent format - backend returns array directly
    const users = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : []
    
    return NextResponse.json({ data: users, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در دریافت کاربران", 
        messageFa: "خطا در دریافت کاربران",
        success: false,
        data: [],
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
