import { NextResponse } from "next/server"
import { getAuthCookieOptions } from "@/lib/auth-cookie"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set("access_token", "", { ...getAuthCookieOptions(), maxAge: 0 })
  return response
}
