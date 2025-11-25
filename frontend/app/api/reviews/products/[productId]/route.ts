import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET(_: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params
    const data = await backendFetch(`/reviews/products/${productId}`)
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در دریافت نظرات", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params
    const payload = await request.json()
    const data = await backendFetch(
      `/reviews/products/${productId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      { requireAuth: true },
    )
    return NextResponse.json({ data, success: true }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در ثبت نظر", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
