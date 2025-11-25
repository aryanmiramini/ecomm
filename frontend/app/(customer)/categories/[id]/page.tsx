"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import type { Category, Product } from "@/lib/types"
import { useCart } from "@/components/cart/cart-provider"
import { toast } from "sonner"

export default function CategoryDetailsPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingProductId, setAddingProductId] = useState<string | null>(null)
  const router = useRouter()
  const { addItem } = useCart()

  useEffect(() => {
    async function loadCategory() {
      setLoading(true)
      try {
        const [categoryRes, productsRes] = await Promise.all([
          apiClient.getCategory(params.id),
          apiClient.getProducts({ categoryId: params.id }),
        ])
        setCategory(categoryRes.category)
        setProducts(productsRes.products)
      } catch (error) {
        router.push("/categories")
      } finally {
        setLoading(false)
      }
    }
    loadCategory()
  }, [params.id, router])

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingProductId(productId)
      await addItem(productId)
      toast.success("محصول به سبد اضافه شد")
    } catch (error: any) {
      toast.error(error?.message || "خطا در افزودن محصول")
    } finally {
      setAddingProductId(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="mb-6 h-10 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!category) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 rounded-3xl border border-border bg-card p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="h-32 w-32 overflow-hidden rounded-2xl bg-muted">
            <img src={category.image || "/placeholder.svg"} alt={category.nameFa} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 space-y-3">
            <Badge variant="outline" className="text-base">
              دسته‌بندی
            </Badge>
            <h1 className="text-4xl font-bold">{category.nameFa}</h1>
            <p className="text-muted-foreground">{category.descriptionFa}</p>
            <p className="text-sm text-muted-foreground">{category.productCount} محصول در این دسته موجود است.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden border border-border/70">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img src={product.image || "/placeholder.svg"} alt={product.nameFa} className="h-full w-full object-cover" />
              {product.featured && <Badge className="absolute right-2 top-2">ویژه</Badge>}
            </div>
            <CardContent className="space-y-3 p-4">
              <h3 className="text-lg font-semibold">{product.nameFa}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.descriptionFa}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">{(product.price / 1000000).toFixed(2)} میلیون</span>
                  {product.discountPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {(product.discountPrice / 1000000).toFixed(2)} میلیون
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  className="gap-2"
                  disabled={addingProductId === product.id}
                  onClick={() => handleAddToCart(product.id)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {addingProductId === product.id ? "در حال افزودن..." : "افزودن"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


