"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/components/cart/cart-provider"
import { toast } from "sonner"

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, clear } = useCart()
  const [pendingItemId, setPendingItemId] = useState<string | null>(null)

  const handleQuantityChange = async (itemId: string, nextQuantity: number) => {
    if (nextQuantity < 1) {
      await handleRemove(itemId)
      return
    }
    try {
      setPendingItemId(itemId)
      await updateItem(itemId, nextQuantity)
      toast.success("تعداد به‌روزرسانی شد")
    } catch (error: any) {
      toast.error(error?.message || "خطا در بروزرسانی تعداد")
    } finally {
      setPendingItemId(null)
    }
  }

  const handleRemove = async (itemId: string) => {
    try {
      setPendingItemId(itemId)
      await removeItem(itemId)
      toast.success("محصول از سبد حذف شد")
    } catch (error: any) {
      toast.error(error?.message || "خطا در حذف محصول")
    } finally {
      setPendingItemId(null)
    }
  }

  const handleClearCart = async () => {
    try {
      await clear()
      toast.success("سبد خرید خالی شد")
    } catch (error: any) {
      toast.error(error?.message || "خطا در خالی کردن سبد")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="mb-6 h-10 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold">سبد خرید شما خالی است</h1>
        <p className="mb-8 text-muted-foreground">برای افزودن محصول به سبد خرید، به صفحه محصولات بروید.</p>
        <Button asChild>
          <Link href="/products">مشاهده محصولات</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img src={item.image || "/placeholder.svg"} alt={item.nameFa} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.nameFa}</h3>
                      <p className="text-sm text-muted-foreground">شناسه محصول: {item.productId}</p>
                    </div>
                    <p className="text-xl font-bold text-primary">
                      {(item.total / 1000000).toFixed(2)} میلیون تومان
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">تعداد:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={pendingItemId === item.id}
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          className="w-20 text-center"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={pendingItemId === item.id}
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10"
                      disabled={pendingItemId === item.id}
                      onClick={() => handleRemove(item.id)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="w-full lg:w-96">
          <Card>
            <CardHeader>
              <CardTitle>خلاصه سفارش</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>تعداد اقلام</span>
                <span>{cart.itemCount} محصول</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>تعداد کل</span>
                <span>{cart.totalQuantity} عدد</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4 text-lg font-bold">
                <span>مبلغ قابل پرداخت</span>
                <span className="text-primary">{(cart.subtotal / 1000000).toFixed(2)} میلیون تومان</span>
              </div>

              <div className="space-y-3 pt-2">
                <Button className="w-full" asChild>
                  <Link href="/checkout">ادامه فرآیند خرید</Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={handleClearCart}>
                  خالی کردن سبد خرید
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


