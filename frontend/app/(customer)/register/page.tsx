"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ShoppingBag, User, Mail, Phone, Lock, Eye, EyeOff, Check } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"

export default function RegisterPage() {
  const router = useRouter()
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/")
    }
  }, [authLoading, isAuthenticated, router])

  const passwordStrength = {
    length: formData.password.length >= 6,
    hasNumber: /\d/.test(formData.password),
    hasLetter: /[a-zA-Z]/.test(formData.password),
  }

  const isPasswordValid = passwordStrength.length && passwordStrength.hasNumber && passwordStrength.hasLetter

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const normalizedEmail = formData.email.trim().toLowerCase()
    const normalizedPhone = formData.phone.trim()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("رمز عبور و تکرار آن مطابقت ندارند")
      return
    }

    if (!isPasswordValid) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر، شامل حرف و عدد باشد")
      return
    }
    if (!normalizedEmail || !normalizedPhone) {
      toast.error("ایمیل و شماره تماس الزامی هستند")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: normalizedEmail,
          password: formData.password,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: normalizedPhone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "خطا در ثبت نام")
      }

      // Fallback login for deployments where register response has no token.
      if (!data?.access_token) {
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: normalizedEmail,
            password: formData.password,
          }),
        })

        const loginData = await loginResponse.json()
        if (!loginResponse.ok) {
          throw new Error(loginData.message || "ثبت نام انجام شد اما ورود خودکار ناموفق بود")
        }
      }

      await login()
      toast.success("ثبت نام موفقیت‌آمیز بود! خوش آمدید")
      router.push("/")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "خطا در ثبت نام")
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 mb-4">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">ایجاد حساب کاربری</h1>
          <p className="text-muted-foreground mt-1">عضو خانواده فروشگاه ما شوید</p>
        </div>

        <Card className="border-0 shadow-xl shadow-primary/5">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">نام</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="firstName" 
                      type="text" 
                      placeholder="نام" 
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="pr-10 h-11"
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">نام خانوادگی</Label>
                  <Input 
                    id="lastName" 
                    type="text" 
                    placeholder="نام خانوادگی" 
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className="h-11"
                    required 
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">ایمیل</Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="example@email.com" 
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="pr-10 h-11"
                    required 
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">شماره تماس</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="09123456789" 
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="pr-10 h-11"
                    required 
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">رمز عبور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور خود را وارد کنید" 
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
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
                
                {/* Password Strength Indicators */}
                {formData.password && (
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Check className={`h-3 w-3 ${passwordStrength.length ? "text-green-500" : "text-muted-foreground"}`} />
                      <span className={passwordStrength.length ? "text-green-600" : "text-muted-foreground"}>
                        حداقل ۶ کاراکتر
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Check className={`h-3 w-3 ${passwordStrength.hasLetter ? "text-green-500" : "text-muted-foreground"}`} />
                      <span className={passwordStrength.hasLetter ? "text-green-600" : "text-muted-foreground"}>
                        شامل حرف انگلیسی
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Check className={`h-3 w-3 ${passwordStrength.hasNumber ? "text-green-500" : "text-muted-foreground"}`} />
                      <span className={passwordStrength.hasNumber ? "text-green-600" : "text-muted-foreground"}>
                        شامل عدد
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium">تکرار رمز عبور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirm-password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور را مجدداً وارد کنید" 
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    className="pr-10 h-11"
                    required 
                    dir="ltr"
                  />
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">رمز عبور و تکرار آن مطابقت ندارند</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium" 
                disabled={loading || !isPasswordValid || formData.password !== formData.confirmPassword}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    در حال ثبت نام...
                  </span>
                ) : "ایجاد حساب کاربری"}
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
              <span className="text-muted-foreground">قبلاً ثبت نام کرده‌اید؟ </span>
              <Link href="/login" className="text-primary font-medium hover:underline">
                وارد شوید
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Terms Notice */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          با ثبت نام، شما{" "}
          <Link href="/terms" className="text-primary hover:underline">
            قوانین و مقررات
          </Link>{" "}
          سایت را می‌پذیرید.
        </p>
      </div>
    </div>
  )
}
