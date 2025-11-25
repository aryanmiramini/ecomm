"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import type { Order } from "@/lib/types"
import { toast } from "sonner"

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700",
  processing: "bg-blue-500/10 text-blue-700",
  shipped: "bg-purple-500/10 text-purple-700",
  delivered: "bg-green-500/10 text-green-700",
  cancelled: "bg-red-500/10 text-red-700",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      try {
        // Use my-orders endpoint for customer orders
        const response = await fetch("/api/orders/my-orders", {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        const data = await response.json()
        // Handle both array response and wrapped response
        const ordersArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : [])
        setOrders(ordersArray.map((order: any) => {
          // Map backend order to frontend Order type
          const user = order.user || {}
          const statusMap: Record<string, string> = {
            PENDING: "pending",
            PROCESSING: "processing",
            CONFIRMED: "processing",
            PAID: "processing",
            SHIPPED: "shipped",
            DELIVERED: "delivered",
            CANCELLED: "cancelled",
            RETURNED: "cancelled",
            REFUNDED: "cancelled",
          }
          return {
            id: order.id,
            customerName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "مشتری",
            customerEmail: user.email,
            customerPhone: user.phone,
            address: order.shippingAddress || user.shippingAddress || "",
            city: user.city || "",
            postalCode: user.postalCode || "",
            items: (order.items || []).map((item: any) => ({
              productId: item.productId,
              productName: item.product?.name || "محصول",
              productNameFa: item.product?.name || "محصول",
              quantity: item.quantity ?? 0,
              price: Number(item.total ?? item.subtotal ?? item.price ?? 0),
              image: item.product?.images?.[0] || "/placeholder.svg",
            })),
            totalAmount: Number(order.total || 0),
            status: (statusMap[order.status || "PENDING"] || "pending") as Order["status"],
            createdAt: order.createdAt || new Date().toISOString(),
            updatedAt: order.updatedAt || new Date().toISOString(),
          }
        }))
      } catch (error: any) {
        if (error?.message?.includes("Authentication")) {
          toast.error("لطفاً ابتدا وارد حساب کاربری شوید")
        } else {
          console.error("Error loading orders:", error)
          toast.error("خطا در بارگذاری سفارشات")
        }
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="mb-6 h-10 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold">سفارشی وجود ندارد</h1>
        <p className="text-muted-foreground">شما هنوز سفارشی ثبت نکرده‌اید.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">سفارشات من</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>سفارش #{order.id.slice(0, 8)}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">اقلام سفارش</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-lg border border-border p-3">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.productNameFa}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.productNameFa}</p>
                        <p className="text-sm text-muted-foreground">تعداد: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-primary">{(item.price / 1000000).toFixed(1)} میلیون تومان</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="text-sm text-muted-foreground">آدرس ارسال</div>
                <div className="text-left text-sm">
                  <p>{order.address}</p>
                  <p>{order.city}</p>
                  <p>کد پستی: {order.postalCode}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-lg font-semibold">مبلغ کل</span>
                <span className="text-2xl font-bold text-primary">
                  {(order.totalAmount / 1000000).toFixed(1)} میلیون تومان
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

