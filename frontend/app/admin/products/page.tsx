"use client"

import { Suspense, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, AlertCircle, Package, Check, X } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-lg border">
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
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
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">محصولی یافت نشد</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {activeSearch 
              ? "محصولی با این عبارت جستجو یافت نشد"
              : "هنوز محصولی اضافه نشده است"}
          </p>
          {!activeSearch && (
            <Button asChild className="mt-4">
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                اولین محصول را اضافه کنید
              </Link>
            </Button>
          )}
        </div>
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

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">تصویر</TableHead>
              <TableHead>نام محصول</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>قیمت</TableHead>
              <TableHead className="text-center">موجودی</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              <TableHead className="text-center">ویژه</TableHead>
              <TableHead className="w-24">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product.id}
                className={deleting === product.id ? 'opacity-50' : ''}
              >
                <TableCell>
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.nameFa}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium line-clamp-1">{product.nameFa}</p>
                    <p className="text-xs text-muted-foreground">{product.sku || '-'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{product.categoryFa || "بدون دسته‌بندی"}</span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {product.discountPrice ? (
                      <>
                        <p className="font-semibold text-primary">
                          {formatPrice(product.discountPrice)} ت
                        </p>
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.price)} ت
                        </p>
                      </>
                    ) : (
                      <p className="font-semibold">
                        {formatPrice(product.price)} ت
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {product.isActive !== false ? (
                    <Check className="h-4 w-4 text-green-600 mx-auto" />
                  ) : (
                    <X className="h-4 w-4 text-destructive mx-auto" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {product.featured ? (
                    <Check className="h-4 w-4 text-amber-500 mx-auto" />
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      asChild
                      disabled={deleting === product.id}
                    >
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDelete(product.id, product.nameFa)}
                      disabled={deleting === product.id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
        <div className="rounded-lg border">
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
