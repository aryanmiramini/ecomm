"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, AlertCircle, RefreshCw, ShoppingCart } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import type { Order } from "@/lib/types"

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  confirmed: "تایید شده",
  paid: "پرداخت شده",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  processing: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  confirmed: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  shipped: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  delivered: "bg-green-500/10 text-green-700 dark:text-green-400",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-400",
}

const formatPrice = (price: number) => {
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getOrders()
      setOrders(response.orders || [])
    } catch (error: any) {
      console.error("Error loading orders:", error)
      setError(error?.message || "خطا در بارگذاری سفارشات")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId)
      await apiClient.updateOrderStatus(orderId, newStatus)
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus as any } : order)))
      toast.success("وضعیت سفارش با موفقیت به‌روزرسانی شد")
    } catch (error: any) {
      toast.error(error?.message || "خطا در بروزرسانی وضعیت سفارش")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleViewOrder = async (orderId: string) => {
    try {
      const response = await apiClient.getOrder(orderId)
      setSelectedOrder(response.order)
      setDialogOpen(true)
    } catch (error: any) {
      toast.error(error?.message || "خطا در دریافت جزئیات سفارش")
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

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">مدیریت سفارشات</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadOrders} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          تلاش مجدد
        </Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">مدیریت سفارشات</h1>
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">سفارشی وجود ندارد</h3>
            <p className="text-sm text-muted-foreground">
              هنوز سفارشی ثبت نشده است. سفارشات جدید در اینجا نمایش داده می‌شوند.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مدیریت سفارشات</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} سفارش</p>
        </div>
        <Button onClick={loadOrders} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          بروزرسانی
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className={updatingStatus === order.id ? 'opacity-70' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">سفارش #{order.id?.slice(0, 8) || 'نامشخص'}</CardTitle>
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
                <Badge className={statusColors[order.status]}>{statusLabels[order.status] || order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-semibold">اطلاعات مشتری</h4>
                  <div className="space-y-1 text-sm">
                    <p>نام: {order.customerName || "نامشخص"}</p>
                    <p>ایمیل: {order.customerEmail || "نامشخص"}</p>
                    <p>تلفن: {order.customerPhone || "نامشخص"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">آدرس ارسال</h4>
                  <div className="space-y-1 text-sm">
                    <p>{order.address || "نامشخص"}</p>
                    <p>{order.city || ""}</p>
                    {order.postalCode && <p>کد پستی: {order.postalCode}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">اقلام سفارش ({order.items?.length || 0} قلم)</h4>
                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-lg border border-border p-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.productNameFa || item.productName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.productNameFa || item.productName || "محصول"}</p>
                        <p className="text-sm text-muted-foreground">تعداد: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-primary shrink-0">{formatPrice(item.price || 0)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">وضعیت سفارش:</span>
                  <Select 
                    value={order.status} 
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                    disabled={updatingStatus === order.id}
                  >
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
                      {formatPrice(order.totalAmount || 0)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewOrder(order.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>جزئیات سفارش #{selectedOrder?.id?.slice(0, 8) || 'نامشخص'}</DialogTitle>
            <DialogDescription>اطلاعات کامل سفارش</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(selectedOrder.createdAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <Badge className={statusColors[selectedOrder.status]}>
                  {statusLabels[selectedOrder.status] || selectedOrder.status}
                </Badge>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold">اطلاعات مشتری</h4>
                  <div className="space-y-1 text-sm">
                    <p>نام: {selectedOrder.customerName || "نامشخص"}</p>
                    <p>ایمیل: {selectedOrder.customerEmail || "نامشخص"}</p>
                    <p>تلفن: {selectedOrder.customerPhone || "نامشخص"}</p>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-semibold">آدرس ارسال</h4>
                  <div className="space-y-1 text-sm">
                    <p>{selectedOrder.address || "نامشخص"}</p>
                    <p>{selectedOrder.city || ""}</p>
                    {selectedOrder.postalCode && <p>کد پستی: {selectedOrder.postalCode}</p>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">اقلام سفارش</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-lg border border-border p-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.productNameFa || item.productName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.productNameFa || item.productName || "محصول"}</p>
                        <p className="text-sm text-muted-foreground">تعداد: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-primary">{formatPrice(item.price || 0)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-lg font-semibold">مبلغ کل</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(selectedOrder.totalAmount || 0)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
