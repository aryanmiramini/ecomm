import { cookies } from "next/headers"

const DEFAULT_BASE_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

class BackendRequestError extends Error {
  status: number
  payload?: unknown
  constructor(message: string, status: number, payload?: unknown) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

function coerceMessage(value: unknown): string | undefined {
  if (typeof value === "string") return value
  if (Array.isArray(value)) {
    const parts = value.map((v) => (typeof v === "string" ? v : "")).filter(Boolean)
    return parts.length ? parts.join("، ") : undefined
  }
  return undefined
}

export async function backendFetch<T>(
  path: string,
  init: RequestInit = {},
  { requireAuth = false }: { requireAuth?: boolean } = {},
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (requireAuth && !token) {
    throw new BackendRequestError("نیاز به ورود دارید", 401, {
      code: "UNAUTHORIZED",
      messageFa: "نیاز به ورود دارید",
      messageEn: "Authentication required",
    })
  }

  const headers = new Headers(init.headers)
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(joinUrl(DEFAULT_BASE_URL, path), {
    ...init,
    headers,
    cache: "no-store",
  })

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "")
    const parsed = (bodyText ? safeJsonParse(bodyText) : undefined) as any

    const message =
      coerceMessage(parsed?.messageFa) ||
      coerceMessage(parsed?.message) ||
      coerceMessage(parsed?.messageEn) ||
      `Backend request failed (${response.status})`

    throw new BackendRequestError(message, response.status, parsed ?? bodyText)
  }

  // Some backend endpoints legitimately return an empty body (204/200 with no content).
  const bodyText = await response.text().catch(() => "")
  if (!bodyText) return undefined as T
  const parsed = safeJsonParse(bodyText)
  return (parsed as T) ?? (undefined as T)
}

export { BackendRequestError }

