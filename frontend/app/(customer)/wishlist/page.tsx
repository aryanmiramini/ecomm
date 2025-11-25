"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import type { Product } from "@/lib/types"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { useCart } from "@/components/cart/cart-provider"
import { toast } from "sonner"

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    async function loadWishlist() {
      try {
        const response = await apiClient.getWishlist()
        setProducts(response.products)
      } catch (error) {
        console.error("Error loading wishlist:", error)
      } finally {
        setLoading(false)
      }
    }
    loadWishlist()
  }, [])

  const handleRemove = async (productId: string) => {
    try {
      await apiClient.removeFromWishlist(productId)
      setProducts(products.filter((p) => p.id !== productId))
      toast.success("محصول از علاقه‌مندی‌ها حذف شد")
    } catch (error: any) {
      toast.error(error.message || "خطا در حذف محصول")
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      await addItem(productId)
      toast.success("محصول به سبد خرید افزوده شد")
    } catch (error: any) {
      toast.error(error.message || "خطا در افزودن به سبد خرید")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Heart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-4 text-3xl font-bold">لیست علاقه‌مندی‌های شما خالی است</h1>
        <p className="mb-8 text-muted-foreground">محصولات مورد علاقه خود را برای دسترسی سریع‌تر ذخیره کنید.</p>
        <Button asChild size="lg">
          <Link href="/products">مشاهده محصولات</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">علاقه‌مندی‌ها</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.nameFa}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleRemove(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4">
              <h3 className="mb-2 font-semibold text-card-foreground line-clamp-1">{product.nameFa}</h3>
              <div className="mb-4 flex items-center justify-between">
                <span className="font-bold text-primary">
                  {(product.price / 1000000).toFixed(1)} میلیون تومان
                </span>
              </div>
              <Button className="w-full gap-2" onClick={() => handleAddToCart(product.id)}>
                <ShoppingCart className="h-4 w-4" />
                افزودن به سبد
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

