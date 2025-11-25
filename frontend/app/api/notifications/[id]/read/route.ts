import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function PATCH(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await backendFetch(`/notifications/${id}/read`, { method: "PATCH" }, { requireAuth: true })
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در خواندن اعلان", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
