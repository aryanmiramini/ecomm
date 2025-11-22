"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await apiClient.getDashboardStats()
        setStats(response.stats)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">داشبورد</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "کل سفارشات",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "درآمد کل",
      value: `${((stats?.totalRevenue || 0) / 1000000).toFixed(1)} میلیون تومان`,
      icon: TrendingUp,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "تعداد محصولات",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "تعداد مشتریان",
      value: stats?.totalCustomers || 0,
      icon: Users,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
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
            <Card key={stat.title} className="overflow-hidden">
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
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>سفارشات اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                  >
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-primary">{(order.totalAmount / 1000000).toFixed(1)} میلیون تومان</p>
                      <p className="text-sm text-muted-foreground">{order.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">سفارشی وجود ندارد</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>محصولات برگزیده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.topProducts?.length > 0 ? (
                stats.topProducts.map((product: any) => (
                  <div key={product.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.nameFa}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{product.nameFa}</p>
                      <p className="text-sm text-muted-foreground">{product.categoryFa}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-primary">{(product.price / 1000000).toFixed(1)} میلیون</p>
                      <p className="text-sm text-muted-foreground">موجودی: {product.stock}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">محصولی وجود ندارد</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
