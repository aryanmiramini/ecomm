"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [devToken, setDevToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "خطا در درخواست بازیابی")
      }

      toast.success("درخواست بازیابی ثبت شد")
      if (data.token) {
        setDevToken(data.token)
      }
    } catch (error: any) {
      toast.error(error.message || "خطا در درخواست بازیابی")
    } finally {
      setLoading(false)
    }
  }

  if (devToken) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">توکن بازیابی (حالت توسعه)</CardTitle>
            <CardDescription>
              در محیط تولید، این توکن از طریق ایمیل/SMS ارسال می‌شود. اکنون می‌توانید رمز را تغییر دهید.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="break-all rounded-lg bg-muted p-3 font-mono text-xs" dir="ltr">
              {devToken}
            </p>
            <Button asChild className="w-full">
              <Link href={`/reset-password?token=${encodeURIComponent(devToken)}`}>
                ادامه به تنظیم رمز جدید
              </Link>
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
          <CardTitle className="text-2xl">فراموشی رمز عبور</CardTitle>
          <CardDescription>ایمیل خود را وارد کنید تا درخواست بازیابی ثبت شود</CardDescription>
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
                dir="ltr"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "در حال ارسال..." : "درخواست بازیابی"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
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
