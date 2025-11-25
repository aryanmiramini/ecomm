import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json().catch(() => ({}))
    // Basic validation
    if (!payload?.name || !payload?.email || !payload?.subject || !payload?.message) {
      return NextResponse.json({ message: "اطلاعات ناقص است" }, { status: 400 })
    }

    // In a full implementation, forward to a ticketing/email service or persist to DB.
    // For now, acknowledge receipt.
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ message: "خطا در پردازش درخواست" }, { status: 500 })
  }
}


