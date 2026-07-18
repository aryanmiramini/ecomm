export function isOtpEnabled(): boolean {
  return process.env.ENABLE_OTP === 'true' && Boolean(process.env.KAVENEGAR_API_KEY?.trim());
}

export function isPasswordResetEnabled(): boolean {
  return process.env.ENABLE_PASSWORD_RESET === 'true';
}
