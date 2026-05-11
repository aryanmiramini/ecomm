"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Package, ShoppingBag, Clock, Truck, CheckCircle2, 
  XCircle, ChevronLeft, CalendarDays, MapPin
} from "lucide-react"
import type { Order } from "@/lib/types"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "در انتظار تأیید", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  processing: { label: "در حال پردازش", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Package },
  confirmed: { label: "تأیید شده", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400", icon: CheckCircle2 },
  paid: { label: "پرداخت شده", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 },
  shipped: { label: "ارسال شده", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Truck },
  delivered: { label: "تحویل داده شده", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  cancelled: { label: "لغو شده", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await apiClient.getMyOrders()
        setOrders(response.orders)
      } catch (error: any) {
        if (error?.message?.includes("Authentication")) {
          toast.error("لطفاً ابتدا وارد حساب کاربری شوید")
        } else {
          console.error("Error loading orders:", error)
        }
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-32 mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10">
          <Package className="h-12 w-12 text-primary" />
        </div>
        <h1 className="mb-3 text-2xl font-bold">هنوز سفارشی ثبت نکرده‌اید</h1>
        <p className="mb-8 text-muted-foreground max-w-md mx-auto">
          برای مشاهده سفارشات خود، ابتدا از فروشگاه خرید کنید.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/products">
            مشاهده محصولات
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Package className="h-7 w-7 text-primary" />
          سفارشات من
        </h1>
        <p className="text-muted-foreground mt-1">{orders.length} سفارش ثبت شده</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending
          const StatusIcon = status.icon

          return (
            <Card key={order.id} className="border-0 shadow-md overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                      سفارش #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge className={`${status.color} gap-1 py-1.5`}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Order Items */}
                <div>
                  <h4 className="mb-3 font-medium text-sm text-muted-foreground">اقلام سفارش ({order.items.length} کالا)</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.productNameFa}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.productNameFa}</p>
                          <p className="text-sm text-muted-foreground">تعداد: {item.quantity} عدد</p>
                        </div>
                        <p className="font-bold text-primary whitespace-nowrap">
                          {item.price.toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {order.address && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">آدرس تحویل</p>
                      <p className="text-muted-foreground">{order.address}</p>
                      {order.city && <p className="text-muted-foreground">{order.city} - کد پستی: {order.postalCode}</p>}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-lg font-medium">مبلغ کل سفارش</span>
                  <span className="text-2xl font-bold text-primary">
                    {order.totalAmount.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
