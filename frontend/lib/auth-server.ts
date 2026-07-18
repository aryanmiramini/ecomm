import { jwtVerify } from "jose"

export type SessionPayload = {
  sub?: string
  role?: string
  email?: string
  phone?: string
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const secret = process.env.JWT_SECRET
  if (!secret) return null

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    return payload as SessionPayload
  } catch {
    return null
  }
}

export function sanitizeRedirectPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return null
  }
  return path
}
