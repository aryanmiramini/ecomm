"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Package, ArrowLeft, ShoppingBag } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const orderNumberFromQuery = searchParams.get("orderNumber")
  const paymentMethod = searchParams.get("paymentMethod")
  const [randomOrderNumber] = useState(() => `ORD-${Date.now().toString(36).toUpperCase()}`)

  const fallbackOrderNumber = orderId
    ? `#${orderId.slice(0, 8).toUpperCase()}`
    : randomOrderNumber

  const orderNumber = orderNumberFromQuery || fallbackOrderNumber

  const paymentMethodLabel =
    paymentMethod === "pos"
      ? "پرداخت کارتخوان"
      : paymentMethod === "bank_transfer"
        ? "کارت به کارت"
        : "پرداخت در محل"

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg border-0 shadow-xl">
        <CardContent className="pt-12 pb-8 text-center">
          {/* Success Animation */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-green-500/20 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            سفارش شما با موفقیت ثبت شد!
          </h1>
          <p className="text-muted-foreground mb-6">
            از خرید شما متشکریم. سفارش شما در حال پردازش است.
          </p>

          {/* Order Number */}
          <div className="bg-muted/50 rounded-xl p-4 mb-8">
            <p className="text-sm text-muted-foreground mb-1">شماره سفارش</p>
            <p className="text-xl font-bold font-mono text-primary">{orderNumber}</p>
          </div>

          {/* Order Status Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">ثبت سفارش</span>
            </div>
            <div className="w-8 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">پردازش</span>
            </div>
            <div className="w-8 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">ارسال</span>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-right">
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">زمان تحویل تخمینی</p>
              <p className="font-semibold text-blue-700 dark:text-blue-300">۳ تا ۵ روز کاری</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4">
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">وضعیت پرداخت</p>
              <p className="font-semibold text-purple-700 dark:text-purple-300">{paymentMethodLabel}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/orders" className="gap-2">
                <Package className="h-4 w-4" />
                پیگیری سفارش
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/products" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                ادامه خرید
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground mt-6">
            ایمیل تأیید سفارش به آدرس شما ارسال شده است.
            <br />
            برای هرگونه سوال با پشتیبانی تماس بگیرید.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function OrderSuccessFallback() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg border-0 shadow-xl">
        <CardContent className="py-12 text-center text-muted-foreground">در حال بارگیری اطلاعات سفارش...</CardContent>
      </Card>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<OrderSuccessFallback />}>
      <OrderSuccessContent />
    </Suspense>
  )
}
