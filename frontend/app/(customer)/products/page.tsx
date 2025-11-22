"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Star } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import type { Product } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await apiClient.getProducts()
        setProducts(response.products)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">تمام محصولات</h1>
          <p className="mt-2 text-muted-foreground">{products.length} محصول یافت شد</p>
        </div>

        <div className="flex gap-3">
          <Select defaultValue="newest">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="مرتب‌سازی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="price-low">ارزان‌ترین</SelectItem>
              <SelectItem value="price-high">گران‌ترین</SelectItem>
              <SelectItem value="popular">محبوب‌ترین</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.nameFa}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
              {product.discountPrice && (
                <Badge className="absolute left-2 top-2 bg-destructive text-destructive-foreground">
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% تخفیف
                </Badge>
              )}
              {product.featured && <Badge className="absolute right-2 top-2 bg-primary">ویژه</Badge>}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Button size="sm" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  افزودن به سبد
                </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <Badge variant="secondary" className="mb-2">
                {product.categoryFa}
              </Badge>
              <h3 className="mb-2 font-semibold text-card-foreground">{product.nameFa}</h3>
              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{product.descriptionFa}</p>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex flex-col">
                  {product.discountPrice ? (
                    <>
                      <span className="text-lg font-bold text-primary">
                        {(product.discountPrice / 1000000).toFixed(1)} میلیون
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {(product.price / 1000000).toFixed(1)} میلیون
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {(product.price / 1000000).toFixed(1)} میلیون تومان
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.5</span>
                </div>
              </div>

              <div className="mt-2 text-xs text-muted-foreground">موجودی: {product.stock} عدد</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
