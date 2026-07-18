export function isOtpEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_OTP === "true"
}

export function isPasswordResetEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_PASSWORD_RESET === "true"
}
