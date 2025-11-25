import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ reviewId: string }> }) {
  try {
    const { reviewId } = await params
    const data = await backendFetch(`/reviews/${reviewId}`, { method: "DELETE" }, { requireAuth: true })
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در حذف نظر", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
