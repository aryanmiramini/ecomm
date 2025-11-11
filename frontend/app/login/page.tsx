"use client"

import { useI18n } from "@/i18n/provider"
import { useState } from "react"
import { useAuthStore } from "@/store/auth"
import { apiEndpoints } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await apiEndpoints.login(formData)
      const { access_token, user } = response.data
      setAuth(access_token, user)
      router.push("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent">
              {t("login") || "Login"}
            </h1>
            <p className="text-gray-600">
              {t("loginSubtitle") || "Welcome back! Please login to your account"}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(159,31,92)]"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{t("password") || "Password"}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(159,31,92)]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">{t("rememberMe") || "Remember me"}</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-[rgb(159,31,92)] hover:underline">
                {t("forgotPassword") || "Forgot password?"}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("loading") || "Loading..." : t("login") || "Login"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            {t("dontHaveAccount") || "Don't have an account?"}{" "}
            <Link href="/register" className="text-[rgb(159,31,92)] font-semibold hover:underline">
              {t("register") || "Register"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

