"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { isPasswordResetEnabled } from "@/lib/feature-flags"

export default function ResetPasswordForm() {
  const passwordResetEnabled = isPasswordResetEnabled()
  const searchParams = useSearchParams()
  const tokenFromUrl = searchParams.get("token") || ""
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(tokenFromUrl)
  const [password, setPassword] = useState("")
  const [done, setDone] = useState(false)

  if (!passwordResetEnabled) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">تنظیم رمز عبور</CardTitle>
            <CardDescription>بازیابی رمز عبور فعلاً غیرفعال است.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">بازگشت به ورود</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "خطا در تغییر رمز عبور")
      }
      toast.success("رمز عبور با موفقیت تغییر کرد")
      setDone(true)
    } catch (error: any) {
      toast.error(error.message || "خطا در تغییر رمز عبور")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">رمز عبور تغییر کرد</CardTitle>
            <CardDescription>اکنون می‌توانید با رمز جدید وارد شوید.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">ورود</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">تنظیم رمز عبور جدید</CardTitle>
          <CardDescription>توکن بازیابی و رمز جدید را وارد کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">توکن بازیابی</Label>
              <Input id="token" value={token} onChange={(e) => setToken(e.target.value)} required dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور جدید</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                dir="ltr"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "در حال ذخیره..." : "تغییر رمز عبور"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                بازگشت به ورود
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
