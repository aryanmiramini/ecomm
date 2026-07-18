import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

async function verifyJwtPayload(token: string): Promise<{ role?: string; id?: string } | null> {
  const secret = process.env.JWT_SECRET
  if (!secret) return null

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    return payload as { role?: string; id?: string }
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get("access_token")?.value

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const payload = await verifyJwtPayload(token)
    if (!payload || payload.role !== "ADMIN") {
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

    const payload = await verifyJwtPayload(token)
    if (!payload?.id) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/orders/:path*", "/wishlist", "/checkout"],
}
