import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function POST(_: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params
    const data = await backendFetch(`/wishlist/${productId}`, { method: "POST" }, { requireAuth: true })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در افزودن به علاقه‌مندی‌ها", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params
    const data = await backendFetch(`/wishlist/${productId}`, { method: "DELETE" }, { requireAuth: true })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در حذف از علاقه‌مندی‌ها", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
