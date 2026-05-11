"use client"

import type React from "react"
import { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ShoppingBag, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect")
  const { login, isAuthenticated, loading: authLoading, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  // Track if login is in progress to prevent redirect interference
  const isLoggingIn = useRef(false)

  useEffect(() => {
    if (!authLoading && isAuthenticated && !isLoggingIn.current) {
      if (user?.role === "ADMIN") {
        router.push("/admin")
      } else {
        // Redirect to the original page if redirect parameter exists
        router.push(redirectUrl || "/")
      }
    }
  }, [authLoading, isAuthenticated, router, user, redirectUrl])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      // Refresh auth context to pick up the new cookie
      await login()
      
      toast.success("ورود موفقیت‌آمیز بود")
      
      if (data.user?.role === "ADMIN") {
        router.push("/admin")
      } else {
        router.push(redirectUrl || "/")
      }
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "خطا در ورود")
      isLoggingIn.current = false
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 mb-4">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">خوش آمدید</h1>
          <p className="text-muted-foreground mt-1">برای ادامه وارد حساب کاربری شوید</p>
        </div>

        <Card className="border-0 shadow-xl shadow-primary/5">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">ایمیل</Label>
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
                  <Label htmlFor="password" className="text-sm font-medium">رمز عبور</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    فراموشی رمز عبور؟
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور خود را وارد کنید" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 pl-10 h-11"
                    required 
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    در حال ورود...
                  </span>
                ) : "ورود به حساب"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-xs text-muted-foreground">یا</span>
              </div>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">حساب کاربری ندارید؟ </span>
              <Link href="/register" className="text-primary font-medium hover:underline">
                ثبت نام کنید
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials hint */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground text-center">
            برای تست: <span className="font-mono text-foreground">admin@example.com</span> / <span className="font-mono text-foreground">admin123</span>
          </p>
        </div>
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
