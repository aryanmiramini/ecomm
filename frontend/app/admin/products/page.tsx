"use client"

import { Suspense, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import type { Product } from "@/lib/types"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const activeSearch = searchParams.get("search") ?? ""

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await apiClient.getProducts({
          search: activeSearch || undefined,
          limit: 50,
        })
        setProducts(response.products)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [activeSearch])

  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف این محصول مطمئن هستید؟")) {
      try {
        await apiClient.deleteProduct(id)
        setProducts(products.filter((p) => p.id !== id))
      } catch (error: any) {
        console.error("Error deleting product:", error)
        alert(error.message || "خطا در حذف محصول")
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مدیریت محصولات</h1>
        <Button className="gap-2" asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            افزودن محصول
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.nameFa}
                className="h-full w-full object-cover"
              />
              {product.featured && (
                <div className="absolute left-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  ویژه
                </div>
              )}
            </div>
            <CardContent className="space-y-3 p-4">
              <div>
                <h3 className="font-bold text-card-foreground">{product.nameFa}</h3>
                <p className="text-sm text-muted-foreground">{product.categoryFa}</p>
              </div>

              <div className="flex items-baseline gap-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-lg font-bold text-primary">
                      {(product.discountPrice / 1000000).toFixed(1)} میلیون تومان
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {(product.price / 1000000).toFixed(1)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {(product.price / 1000000).toFixed(1)} میلیون تومان
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">موجودی: {product.stock}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
