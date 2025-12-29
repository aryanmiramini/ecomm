"use client"

import { Suspense, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, AlertCircle, Package } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Product } from "@/lib/types"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const activeSearch = searchParams.get("search") ?? ""

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getProducts({
        search: activeSearch || undefined,
        limit: 50,
      })
      setProducts(response.products)
    } catch (error: any) {
      console.error("Error loading products:", error)
      setError(error.message || "خطا در بارگذاری محصولات")
      toast.error(error.message || "خطا در بارگذاری محصولات")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [activeSearch])

  const handleDelete = async (id: string, name: string) => {
    const confirmed = confirm(`آیا از حذف محصول "${name}" مطمئن هستید؟`)
    if (!confirmed) return

    try {
      setDeleting(id)
      await apiClient.deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
      toast.success("محصول با موفقیت حذف شد")
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast.error(error.message || "خطا در حذف محصول")
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square" />
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadProducts}>تلاش مجدد</Button>
      </div>
    )
  }

  if (products.length === 0) {
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
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">محصولی یافت نشد</h3>
            <p className="text-sm text-muted-foreground">
              {activeSearch 
                ? "محصولی با این عبارت جستجو یافت نشد"
                : "هنوز محصولی اضافه نشده است"}
            </p>
            {!activeSearch && (
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  اولین محصول را اضافه کنید
                </Link>
              </Button>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مدیریت محصولات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} محصول
          </p>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            افزودن محصول
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className={`overflow-hidden transition-opacity ${
              deleting === product.id ? 'opacity-50' : ''
            }`}
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.nameFa}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
              {product.featured && (
                <div className="absolute left-2 top-2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  ویژه
                </div>
              )}
              {!product.isActive && (
                <div className="absolute right-2 top-2 rounded-full bg-destructive px-3 py-1 text-xs font-medium text-destructive-foreground">
                  غیرفعال
                </div>
              )}
            </div>
            <CardContent className="space-y-3 p-4">
              <div>
                <h3 className="font-bold text-card-foreground line-clamp-1">
                  {product.nameFa}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.categoryFa || "بدون دسته‌بندی"}
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-lg font-bold text-primary">
                      {new Intl.NumberFormat('fa-IR').format(product.discountPrice)} تومان
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {new Intl.NumberFormat('fa-IR').format(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className={`text-sm ${
                  product.stock > 0 ? 'text-green-600' : 'text-destructive'
                }`}>
                  موجودی: {product.stock}
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    asChild
                    disabled={deleting === product.id}
                  >
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(product.id, product.nameFa)}
                    disabled={deleting === product.id}
                  >
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
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square" />
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}