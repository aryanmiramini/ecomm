import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

// GET all categories
export async function GET() {
  try {
    const data = await backendFetch<any>("/products/categories/all")
    // Backend returns array directly or wrapped in data property
    const categories = Array.isArray(data) ? data : (Array.isArray((data as any).data) ? (data as any).data : [])
    return NextResponse.json({ data: categories, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت دسته‌بندی‌ها", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const data = await backendFetch("/products/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }, { requireAuth: true })
    return NextResponse.json({ data, success: true }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در ایجاد دسته‌بندی", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
