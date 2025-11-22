"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import type { Order } from "@/lib/types"

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
        const response = await apiClient.getOrders()
        setOrders(response.orders)
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus)
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus as any } : order)))
      // Show success message (you can add toast here if needed)
    } catch (error: any) {
      console.error("Error updating order status:", error)
      alert(error.message || "خطا در بروزرسانی وضعیت سفارش")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">مدیریت سفارشات</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>سفارش #{order.id}</CardTitle>
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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">اطلاعات مشتری</h4>
                  <div className="space-y-1 text-sm">
                    <p>نام: {order.customerName}</p>
                    <p>ایمیل: {order.customerEmail}</p>
                    <p>تلفن: {order.customerPhone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">آدرس ارسال</h4>
                  <div className="space-y-1 text-sm">
                    <p>{order.address}</p>
                    <p>{order.city}</p>
                    <p>کد پستی: {order.postalCode}</p>
                  </div>
                </div>
              </div>

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
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">وضعیت سفارش:</span>
                  <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">مبلغ کل</p>
                    <p className="text-2xl font-bold text-primary">
                      {(order.totalAmount / 1000000).toFixed(1)} میلیون تومان
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
