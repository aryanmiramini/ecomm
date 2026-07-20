"use client"

import type React from "react"
import { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"
import { apiClient } from "@/lib/api-client"
import { sanitizeRedirectPath } from "@/lib/auth-server"
import { isOtpEnabled, isPasswordResetEnabled } from "@/lib/feature-flags"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = sanitizeRedirectPath(searchParams.get("redirect"))
  const { login, isAuthenticated, loading: authLoading, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isLoggingIn = useRef(false)
  const otpEnabled = isOtpEnabled()
  const passwordResetEnabled = isPasswordResetEnabled()

  useEffect(() => {
    if (!authLoading && isAuthenticated && !isLoggingIn.current) {
      if (user?.role === "ADMIN") {
        router.push("/admin")
      } else {
        router.push(redirectUrl || "/")
      }
    }
  }, [authLoading, isAuthenticated, router, user, redirectUrl])

  const finishLogin = async (role?: string) => {
    await login()
    toast.success("ورود موفقیت‌آمیز بود")
    router.push(role === "ADMIN" ? "/admin" : redirectUrl || "/")
    router.refresh()
  }

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      toast.error("ایمیل را وارد کنید")
      return
    }
    setLoading(true)
    isLoggingIn.current = true

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
        credentials: "include",
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "ایمیل یا رمز عبور اشتباه است")
      }
      await finishLogin(data.user?.role)
    } catch (error: any) {
      toast.error(error.message || "خطا در ورود")
      isLoggingIn.current = false
    } finally {
      setLoading(false)
    }
  }

  const handleRequestOtp = async () => {
    if (!phone.trim()) {
      toast.error("شماره موبایل را وارد کنید")
      return
    }
    setLoading(true)
    try {
      const data = await apiClient.requestOtp(phone.trim())
      setOtpSent(true)
      toast.success(data.message || "کد ارسال شد")
    } catch (error: any) {
      toast.error(error.message || "خطا در ارسال کد")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) {
      toast.error("کد تایید را وارد کنید")
      return
    }
    setLoading(true)
    isLoggingIn.current = true
    try {
      const data = await apiClient.verifyOtp(phone.trim(), otp.trim())
      await finishLogin(data.user?.role)
    } catch (error: any) {
      toast.error(error.message || "کد نامعتبر است")
      isLoggingIn.current = false
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 mb-4">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">خوش آمدید</h1>
          <p className="text-muted-foreground mt-1">برای ادامه وارد حساب کاربری شوید</p>
        </div>

        <Card className="border-0 shadow-xl shadow-primary/5">
          <CardContent className="pt-6">
            <Tabs defaultValue="email" className="w-full">
              {otpEnabled ? (
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email">ایمیل</TabsTrigger>
                  <TabsTrigger value="phone">موبایل</TabsTrigger>
                </TabsList>
              ) : null}

              <TabsContent value="email">
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10 h-11"
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">رمز عبور</Label>
                      {passwordResetEnabled ? (
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                          فراموشی رمز عبور؟
                        </Link>
                      ) : null}
                    </div>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10 pl-10 h-11"
                        required
                        dir="ltr"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11" disabled={loading}>
                    {loading ? "در حال ورود..." : "ورود با ایمیل"}
                  </Button>
                </form>
              </TabsContent>

              {otpEnabled ? (
              <TabsContent value="phone">
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره موبایل</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="09123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pr-10 h-11"
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {!otpSent ? (
                    <Button type="button" className="w-full h-11" disabled={loading} onClick={handleRequestOtp}>
                      {loading ? "در حال ارسال..." : "دریافت کد تایید"}
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="otp">کد تایید</Label>
                        <Input
                          id="otp"
                          inputMode="numeric"
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="h-11 tracking-widest text-center"
                          dir="ltr"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full h-11" disabled={loading}>
                        {loading ? "در حال تایید..." : "ورود با کد"}
                      </Button>
                      <Button type="button" variant="ghost" className="w-full" onClick={handleRequestOtp} disabled={loading}>
                        ارسال مجدد کد
                      </Button>
                    </>
                  )}
                </form>
              </TabsContent>
              ) : null}
            </Tabs>

            <div className="text-center text-sm mt-6">
              <span className="text-muted-foreground">حساب کاربری ندارید؟ </span>
              <Link href="/register" className="text-primary font-medium hover:underline">
                ثبت نام کنید
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="text-sm text-muted-foreground">در حال بارگیری...</div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  )
}
