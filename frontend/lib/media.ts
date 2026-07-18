export const PLACEHOLDER_IMAGE = "/placeholder.svg"

/**
 * Canonical display URL for images.
 * Prefer same-origin /media paths (proxied by Next) so Docker works without exposing backend host to the browser.
 */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return PLACEHOLDER_IMAGE

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  if (url.startsWith("/media/")) {
    return url
  }

  if (url.startsWith("/")) {
    return url
  }

  return PLACEHOLDER_IMAGE
}

export function resolveMediaUrls(urls: string[] | undefined | null): string[] {
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return []
  }
  return urls.map(resolveMediaUrl)
}

/** Store canonical relative path in DB (strip host if absolute points at our /media). */
export function toStoredMediaPath(url: string): string {
  if (!url) return url
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const parsed = new URL(url)
      if (parsed.pathname.startsWith("/media/")) {
        return parsed.pathname
      }
    }
  } catch {
    // keep original
  }
  return url
}
