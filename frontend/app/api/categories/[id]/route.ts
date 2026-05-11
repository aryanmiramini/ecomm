import { type NextRequest, NextResponse } from "next/server"
import { backendFetch, BackendRequestError, unwrapNestData } from "@/lib/server-api"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const raw = await backendFetch(`/categories/${id}`)
    const data = unwrapNestData(raw)
    return NextResponse.json({ data, success: true })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در دریافت دسته‌بندی", 
        messageFa: "خطا در دریافت دسته‌بندی",
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
      `/categories/${id}`,
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
        message: error?.message || "خطا در بروزرسانی دسته‌بندی", 
        messageFa: "خطا در بروزرسانی دسته‌بندی",
        success: false 
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await backendFetch(`/categories/${id}`, { method: "DELETE" }, { requireAuth: true })
    return NextResponse.json({ success: true, message: "دسته‌بندی با موفقیت حذف شد" })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در حذف دسته‌بندی", 
        messageFa: "خطا در حذف دسته‌بندی",
        success: false 
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
