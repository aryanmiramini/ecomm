"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("رمز عبور و تکرار آن مطابقت ندارند")
      return
    }

    if (formData.password.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "خطا در ثبت نام")
      }

      toast.success("ثبت نام موفقیت‌آمیز بود")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "خطا در ثبت نام")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <ShoppingCart className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">ثبت نام</CardTitle>
          <CardDescription>حساب کاربری جدید ایجاد کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">نام</Label>
                <Input 
                  id="firstName" 
                  type="text" 
                  placeholder="نام" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">نام خانوادگی</Label>
                <Input 
                  id="lastName" 
                  type="text" 
                  placeholder="نام خانوادگی" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@email.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">شماره تماس</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="۰۹۱۲۳۴۵۶۷۸۹" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="رمز عبور خود را وارد کنید" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">تکرار رمز عبور</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="رمز عبور را مجدداً وارد کنید" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required 
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "در حال ثبت نام..." : "ثبت نام"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              قبلاً ثبت نام کرده‌اید؟{" "}
              <Link href="/login" className="text-primary hover:underline">
                وارد شوید
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
