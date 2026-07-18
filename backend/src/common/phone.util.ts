/**
 * Normalize Iranian phone numbers to E.164 (+98...) for consistent lookup/storage.
 */
export function normalizePhone(phone: string): string {
  if (!phone) return phone

  let digits = phone.replace(/[\s\-()]/g, "")

  if (digits.startsWith("+")) {
    digits = digits.slice(1)
  }

  if (digits.startsWith("0098")) {
    digits = digits.slice(2)
  }

  if (digits.startsWith("98") && digits.length >= 12) {
    return `+${digits}`
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `+98${digits.slice(1)}`
  }

  if (digits.startsWith("9") && digits.length === 10) {
    return `+98${digits}`
  }

  return phone.trim()
}
