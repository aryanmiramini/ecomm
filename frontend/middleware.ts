import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protect admin routes (in production, check for actual auth token)
  if (pathname.startsWith("/admin")) {
    // For demo purposes, allow access
    // In production: check for valid session/token
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
