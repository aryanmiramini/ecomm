import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError, unwrapNestData } from "@/lib/server-api"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await backendFetch(`/users/${id}`, {}, { requireAuth: true })
    const data = unwrapNestData(raw)
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در دریافت کاربر", 
        messageFa: "خطا در دریافت کاربر",
        success: false 
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await request.json()
    const raw = await backendFetch(
      `/users/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      { requireAuth: true },
    )
    const data = unwrapNestData(raw)
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در بروزرسانی کاربر", 
        messageFa: "خطا در بروزرسانی کاربر",
        success: false 
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await backendFetch(`/users/${id}`, { method: "DELETE" }, { requireAuth: true })
    return NextResponse.json({ success: true, message: "کاربر با موفقیت حذف شد" })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در حذف کاربر", 
        messageFa: "خطا در حذف کاربر",
        success: false 
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
