import { NextResponse, type NextRequest } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.toString()
    const data = await backendFetch(`/products${search ? `?${search}` : ""}`)
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت محصولات" },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const data = await backendFetch("/products", { method: "POST", body: JSON.stringify(payload) }, { requireAuth: true })
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در ایجاد محصول" },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
