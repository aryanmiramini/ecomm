"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/components/cart/cart-provider"
import { useAuth } from "@/components/auth/auth-provider"
import { apiClient } from "@/lib/api-client"
import { estimateOrderPricing } from "@/lib/order-pricing"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clear } = useCart()
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const submittingRef = useRef(false)
  const idempotencyKeyRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `checkout-${Date.now()}`,
  )
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    shippingAddress: "",
    city: "",
    postalCode: "",
    paymentMethod: "cash",
    notes: "",
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent("/checkout")}`)
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
        shippingAddress: user.shippingAddress || user.address || prev.shippingAddress,
        city: user.city || prev.city,
        postalCode: user.postalCode || prev.postalCode,
      }))
    }
  }, [user])

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">در حال بارگیری...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold">سبد خرید شما خالی است</h1>
        <p className="mb-8 text-muted-foreground">برای ثبت سفارش ابتدا محصولی به سبد خرید اضافه کنید.</p>
        <Button asChild>
          <Link href="/products">مشاهده محصولات</Link>
        </Button>
      </div>
    )
  }

  const pricing = estimateOrderPricing(cart.subtotal)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cart.items.length === 0 || submittingRef.current) return

    submittingRef.current = true
    setLoading(true)
    try {
      const createdOrder = await apiClient.createOrder(
        {
          items: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.shippingAddress,
          shippingFirstName: formData.firstName,
          shippingLastName: formData.lastName,
          shippingPhone: formData.phone,
          shippingEmail: formData.email,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        },
        idempotencyKeyRef.current,
      )
      toast.success("سفارش با موفقیت ثبت شد")
      await clear()
      const orderId = createdOrder?.id || ""
      const orderNumber = createdOrder?.orderNumber || ""
      const query = new URLSearchParams()
      if (orderId) query.set("orderId", orderId)
      if (orderNumber) query.set("orderNumber", orderNumber)
      query.set("paymentMethod", formData.paymentMethod)
      router.push(`/orders/success${query.toString() ? `?${query.toString()}` : ""}`)
    } catch (error: any) {
      submittingRef.current = false
      setLoading(false)
      toast.error(error?.message || "خطا در ثبت سفارش")
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات ارسال</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">نام</Label>
                  <Input
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">نام خانوادگی</Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">شماره تماس</Label>
                  <Input
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingAddress">آدرس کامل</Label>
                <Textarea
                  id="shippingAddress"
                  required
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">شهر</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">کد پستی</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>روش پرداخت</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب روش پرداخت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">نقدی در محل</SelectItem>
                    <SelectItem value="pos">دستگاه کارتخوان</SelectItem>
                    <SelectItem value="bank_transfer">کارت به کارت</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">توضیحات تکمیلی</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "در حال ثبت سفارش..." : "ثبت سفارش"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>خلاصه سفارش</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span>
                  {item.nameFa} × {item.quantity}
                </span>
                <span className="font-medium">{item.total.toLocaleString("fa-IR")} تومان</span>
              </div>
            ))}
            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span>جمع جزء</span>
                <span>{pricing.subtotal.toLocaleString("fa-IR")} تومان</span>
              </div>
              <div className="flex justify-between">
                <span>مالیات</span>
                <span>{pricing.tax.toLocaleString("fa-IR")} تومان</span>
              </div>
              <div className="flex justify-between">
                <span>هزینه ارسال</span>
                <span>{pricing.shipping.toLocaleString("fa-IR")} تومان</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2">
                <span>مبلغ کل</span>
                <span className="text-primary">{pricing.total.toLocaleString("fa-IR")} تومان</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
