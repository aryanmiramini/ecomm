import { NextResponse } from "next/server"
import { backendFetch, BackendRequestError, unwrapNestData } from "@/lib/server-api"

export async function PATCH() {
  try {
    const raw = await backendFetch("/notifications/read-all", { method: "PATCH" }, { requireAuth: true })
    const data = unwrapNestData(raw)
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "خطا در خواندن همه اعلان‌ها", success: false },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

