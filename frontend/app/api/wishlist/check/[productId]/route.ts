import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET(_: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params
    const data = await backendFetch(`/wishlist/check/${productId}`, {}, { requireAuth: true })
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در بررسی وضعیت علاقه‌مندی", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
