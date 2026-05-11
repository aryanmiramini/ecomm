import { NextResponse, type NextRequest } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.toString()
    const response = await backendFetch<any>(`/products${search ? `?${search}` : ""}`)
    
    // Ensure consistent format
    const products = Array.isArray(response?.data) ? response.data : []
    
    return NextResponse.json({
      success: true,
      data: products,
      total: response?.total || products.length,
      page: response?.page || 1,
      limit: response?.limit || 10,
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در دریافت محصولات",
        messageFa: "خطا در دریافت محصولات",
        success: false,
        data: [],
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const data = await backendFetch("/products", { method: "POST", body: JSON.stringify(payload) }, { requireAuth: true })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در ایجاد محصول",
        messageFa: "خطا در ایجاد محصول",
        success: false,
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
