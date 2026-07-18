export function unwrapNestedEnvelope<T = unknown>(body: unknown): T {
  let current = body

  for (let depth = 0; depth < 5; depth++) {
    if (
      current !== null &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      !("access_token" in current) &&
      "success" in current &&
      (current as { success: unknown }).success === true &&
      "data" in current &&
      (current as { data: unknown }).data !== undefined
    ) {
      current = (current as { data: unknown }).data
      continue
    }
    break
  }

  return current as T
}

export function coerceArray<T = unknown>(value: unknown): T[] {
  const unwrapped = unwrapNestedEnvelope(value)
  return Array.isArray(unwrapped) ? (unwrapped as T[]) : []
}
