"use client"

import { useI18n } from "@/i18n/provider"
import { useState } from "react"
import { apiEndpoints } from "@/lib/api"
import { Mail, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await apiEndpoints.forgotPassword({ email })
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4 text-gray-900">
                {t("resetEmailSent") || "Reset Email Sent"}
              </h1>
              <p className="text-gray-600 mb-8">
                {t("resetEmailMessage") || "Please check your email for password reset instructions."}
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                {t("backToLogin") || "Back to Login"}
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent">
                  {t("forgotPassword") || "Forgot Password"}
                </h1>
                <p className="text-gray-600">
                  {t("forgotPasswordSubtitle") || "Enter your email to receive reset instructions"}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">{t("email") || "Email"}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(159,31,92)]"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="inline animate-spin mr-2" />
                      {t("sending") || "Sending..."}
                    </>
                  ) : (
                    t("sendResetLink") || "Send Reset Link"
                  )}
                </button>
              </form>

              <p className="text-center text-gray-600 mt-6">
                <Link href="/login" className="text-[rgb(159,31,92)] font-semibold hover:underline">
                  {t("backToLogin") || "Back to Login"}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

