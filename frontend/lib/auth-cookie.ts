function parseDurationToSeconds(value: string): number {
  const trimmed = value.trim()
  const match = /^(\d+)([smhd])?$/.exec(trimmed)
  if (!match) return 3600

  const amount = Number.parseInt(match[1], 10)
  switch (match[2] ?? "s") {
    case "m":
      return amount * 60
    case "h":
      return amount * 3600
    case "d":
      return amount * 86400
    default:
      return amount
  }
}

export function getAuthCookieOptions() {
  const secure = process.env.COOKIE_SECURE === "true"
  const maxAge = parseDurationToSeconds(process.env.JWT_EXPIRATION || "1h")

  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  }
}
