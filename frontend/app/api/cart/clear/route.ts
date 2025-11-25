import { NextResponse } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function DELETE() {
  try {
    await backendFetch("/cart/clear", { method: "DELETE" }, { requireAuth: true })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در خالی کردن سبد خرید", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}


