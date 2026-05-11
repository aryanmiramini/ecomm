import { NextResponse, type NextRequest } from "next/server"
import { backendFetch, BackendRequestError } from "@/lib/server-api"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await backendFetch(`/products/${id}`)
    return NextResponse.json({ success: true, data: product })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در دریافت محصول",
        messageFa: "خطا در دریافت محصول",
        success: false,
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = await request.json()
    const product = await backendFetch(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, { requireAuth: true })
    return NextResponse.json({ success: true, data: product })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در بروزرسانی محصول",
        messageFa: "خطا در بروزرسانی محصول",
        success: false,
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await backendFetch(`/products/${id}`, { method: "DELETE" }, { requireAuth: true })
    return NextResponse.json({ success: true, message: "محصول با موفقیت حذف شد" })
  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error?.message || "خطا در حذف محصول",
        messageFa: "خطا در حذف محصول",
        success: false,
      },
      { status: error instanceof BackendRequestError ? error.status : 500 },
    )
  }
}
