import { NextResponse } from "next/server"

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set("access_token", "", { ...cookieOptions, maxAge: 0 })
  return response
}
