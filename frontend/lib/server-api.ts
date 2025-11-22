import { cookies } from "next/headers"

const DEFAULT_BASE_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

const joinUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

class BackendRequestError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function backendFetch<T>(
  path: string,
  init: RequestInit = {},
  { requireAuth = false }: { requireAuth?: boolean } = {},
): Promise<T> {
  const token = cookies().get("access_token")?.value

  if (requireAuth && !token) {
    throw new Error("Authentication required")
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
    const error = await response.json().catch(() => ({}))
    throw new BackendRequestError(error.message || `Backend request failed (${response.status})`, response.status)
  }

  return response.json()
}

export { BackendRequestError }

