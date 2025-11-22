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

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "خطا در ورود")
      }

      // Token is stored in cookie by the API route
      toast.success("ورود موفقیت‌آمیز بود")
      
      // Redirect based on user role
      if (data.user?.role === "ADMIN") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      toast.error(error.message || "خطا در ورود")
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
          <CardTitle className="text-2xl">ورود به حساب کاربری</CardTitle>
          <CardDescription>برای دسترسی به پنل کاربری خود وارد شوید</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="example@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">رمز عبور</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  فراموشی رمز عبور؟
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="رمز عبور خود را وارد کنید" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "در حال ورود..." : "ورود"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              حساب کاربری ندارید؟{" "}
              <Link href="/register" className="text-primary hover:underline">
                ثبت نام کنید
              </Link>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">یا</span>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/admin">ورود به پنل مدیریت</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
