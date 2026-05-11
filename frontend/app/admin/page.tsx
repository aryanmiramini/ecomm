"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, TrendingUp, Users, AlertCircle, RefreshCw } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  confirmed: "تایید شده",
  paid: "پرداخت شده",
  shipped: "ارسال شده",
  delivered: "تحویل داده شده",
  cancelled: "لغو شده",
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getDashboardStats()
      setStats(response.stats)
    } catch (error: any) {
      console.error("Error loading stats:", error)
      setError(error?.message || "خطا در بارگذاری آمار داشبورد")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">داشبورد</h1>
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-20" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">داشبورد</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadStats} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          تلاش مجدد
        </Button>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`
  }

  const statCards = [
    {
      title: "کل سفارشات",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      href: "/admin/orders",
    },
    {
      title: "درآمد کل",
      value: formatPrice(stats?.totalRevenue || 0),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      href: "/admin/orders",
    },
    {
      title: "تعداد محصولات",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
      href: "/admin/products",
    },
    {
      title: "تعداد مشتریان",
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
      href: "/admin/users",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">داشبورد</h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("fa-IR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>سفارشات اخیر</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">مشاهده همه</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.slice(0, 5).map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{order.customerName || "مشتری"}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-primary">{formatPrice(order.totalAmount || 0)}</p>
                      <p className="text-sm text-muted-foreground">{statusLabels[order.status] || order.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">سفارشی وجود ندارد</p>
                  <p className="text-sm text-muted-foreground/70">سفارشات جدید اینجا نمایش داده می‌شوند</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>محصولات برگزیده</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">مشاهده همه</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topProducts?.length > 0 ? (
                stats.topProducts.slice(0, 5).map((product: any) => (
                  <div key={product.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.nameFa || product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.nameFa || product.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{product.categoryFa || product.category || "بدون دسته‌بندی"}</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="font-bold text-primary">{formatPrice(product.price || 0)}</p>
                      <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
                        موجودی: {product.stock || 0}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">محصولی وجود ندارد</p>
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <Link href="/admin/products/new">افزودن محصول</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
