import { NextResponse, type NextRequest } from "next/server"
import { backendFetch, BackendRequestError, coerceArray, unwrapNestData } from "@/lib/server-api"

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.toString()
    const response = await backendFetch<any>(`/products${search ? `?${search}` : ""}`)
    const payload = unwrapNestData(response) as { data?: unknown[]; total?: number; page?: number; limit?: number }
    const products = coerceArray(payload?.data ?? payload)

    return NextResponse.json({
      success: true,
      data: products,
      total: response?.total ?? payload?.total ?? products.length,
      page: response?.page ?? payload?.page ?? 1,
      limit: response?.limit ?? payload?.limit ?? 10,
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
    const raw = await backendFetch("/products", { method: "POST", body: JSON.stringify(payload) }, { requireAuth: true })
    const data = unwrapNestData(raw)
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
