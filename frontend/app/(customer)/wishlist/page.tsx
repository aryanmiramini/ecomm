"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import type { Product } from "@/lib/types"
import { Heart, ShoppingCart, Trash2, Star, ArrowLeft } from "lucide-react"
import { useCart } from "@/components/cart/cart-provider"
import { toast } from "sonner"

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingId, setAddingId] = useState<string | null>(null)
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
      setRemovingId(productId)
      await apiClient.removeFromWishlist(productId)
      setProducts(products.filter((p) => p.id !== productId))
      toast.success("محصول از علاقه‌مندی‌ها حذف شد")
    } catch (error: any) {
      toast.error(error.message || "خطا در حذف محصول")
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingId(productId)
      // Find product to pass product data for guest cart
      const product = products.find(p => p.id === productId)
      if (product) {
        await addItem(productId, 1, {
          nameFa: product.nameFa,
          image: product.image || "/placeholder.svg",
          price: product.discountPrice || product.price,
        })
      } else {
        await addItem(productId)
      }
      toast.success("محصول به سبد خرید افزوده شد")
    } catch (error: any) {
      toast.error(error?.message || "خطا در افزودن به سبد خرید")
    } finally {
      setAddingId(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-32 mb-8" />
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-0 shadow-md">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-950/30 dark:to-red-950/30">
          <Heart className="h-12 w-12 text-pink-500" />
        </div>
        <h1 className="mb-3 text-2xl font-bold">لیست علاقه‌مندی‌های شما خالی است</h1>
        <p className="mb-8 text-muted-foreground max-w-md mx-auto">
          محصولات مورد علاقه خود را با کلیک روی آیکون قلب ذخیره کنید تا بعداً به راحتی به آن‌ها دسترسی داشته باشید.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/products">
            مشاهده محصولات
            <ArrowLeft className="h-4 w-4" />
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
          <Heart className="h-7 w-7 text-pink-500 fill-pink-500" />
          علاقه‌مندی‌ها
        </h1>
        <p className="text-muted-foreground mt-1">{products.length} محصول در لیست شما</p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
        {products.map((product) => {
          const displayPrice = product.discountPrice || product.price
          const hasDiscount = product.discountPrice && product.discountPrice < product.price
          const discountPercent = hasDiscount 
            ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
            : 0

          return (
            <Card key={product.id} className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.nameFa}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {hasDiscount && (
                    <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white">
                      {discountPercent}% تخفیف
                    </Badge>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute left-3 top-3 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleRemove(product.id)
                    }}
                    disabled={removingId === product.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
              
              <CardContent className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-card-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                    {product.nameFa}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-primary">
                      {displayPrice.toLocaleString('fa-IR')} تومان
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {product.price.toLocaleString('fa-IR')} تومان
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                      {(product.rating ?? 0).toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full gap-2" 
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingId === product.id || product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {product.stock === 0 ? "ناموجود" : addingId === product.id ? "در حال افزودن..." : "افزودن به سبد"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
