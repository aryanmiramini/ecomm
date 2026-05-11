"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { 
  User, Mail, Phone, MapPin, Save, Package, Heart, 
  Settings, Bell, Shield, LogOut, ChevronLeft 
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"

export default function ProfilePage() {
  const { user, refreshProfile, loading: authLoading, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    state: "",
    postalCode: "",
    shippingAddress: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        city: user.city || "",
        state: user.state || "",
        postalCode: user.postalCode || "",
        shippingAddress: user.shippingAddress || "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.updateProfile(formData)
      await refreshProfile()
      toast.success("اطلاعات حساب کاربری با موفقیت بروزرسانی شد")
    } catch (error: any) {
      toast.error(error.message || "خطا در بروزرسانی اطلاعات")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("با موفقیت خارج شدید")
    } catch (error) {
      toast.error("خطا در خروج از حساب")
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">حساب کاربری</h1>
        <p className="text-muted-foreground">مدیریت اطلاعات و تنظیمات حساب کاربری</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* User Info Card */}
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold mb-3">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "ک"}
              </div>
              <h3 className="font-semibold">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{user?.email || user?.phone}</p>
              <Badge variant="secondary" className="mt-2">
                {user?.role === "ADMIN" ? "مدیر" : "کاربر"}
              </Badge>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-2">
              <nav className="space-y-1">
                <Link 
                  href="/orders" 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">سفارشات من</span>
                  <ChevronLeft className="h-4 w-4 mr-auto text-muted-foreground" />
                </Link>
                <Link 
                  href="/wishlist" 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">علاقه‌مندی‌ها</span>
                  <ChevronLeft className="h-4 w-4 mr-auto text-muted-foreground" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors w-full text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">خروج از حساب</span>
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              اطلاعات شخصی
            </CardTitle>
            <CardDescription>
              اطلاعات شخصی و آدرس تحویل خود را مدیریت کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">اطلاعات شناسایی</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">نام</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className="pr-10"
                        placeholder="نام خود را وارد کنید"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">نام خانوادگی</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        value={user?.email || ""} 
                        disabled 
                        className="pr-10 bg-muted" 
                        dir="ltr"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">ایمیل قابل تغییر نیست</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره موبایل</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="pr-10"
                        placeholder="09123456789"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Info */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  آدرس تحویل
                </h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="state">استان</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      placeholder="تهران"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">شهر</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="تهران"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">کد پستی</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => updateField("postalCode", e.target.value)}
                      placeholder="1234567890"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">آدرس کامل</Label>
                  <Textarea
                    id="address"
                    value={formData.shippingAddress}
                    onChange={(e) => updateField("shippingAddress", e.target.value)}
                    placeholder="خیابان، کوچه، پلاک، واحد..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
