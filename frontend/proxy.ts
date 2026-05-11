import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Decode JWT payload without verification (verification happens on backend)
function decodeJwtPayload(token: string): { role?: string; id?: string } | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    // Decode base64url to base64
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const padding = "=".repeat((4 - (base64.length % 4)) % 4)
    const decoded = atob(base64 + padding)

    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get("access_token")?.value

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Decode token and check admin role
    const payload = decodeJwtPayload(token)
    if (!payload || payload.role !== "ADMIN") {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
  }

  if (
    pathname.startsWith("/profile") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/checkout")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*", "/wishlist", "/checkout"],
}
