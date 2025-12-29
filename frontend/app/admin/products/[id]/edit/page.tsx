"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductForm } from "@/components/admin/product-form"
import { apiClient } from "@/lib/api-client"
import type { Product } from "@/lib/types"
import { toast } from "sonner"

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = (params as { id?: string })?.id
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productId) return
    const load = async () => {
      try {
        const res = await apiClient.getProduct(productId as string)
        setProduct(res.product)
      } catch (error: any) {
        toast.error(error?.message || "خطا در بارگذاری محصول")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [productId])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    )
  }

  if (!product) {
    return <p className="text-muted-foreground">محصولی یافت نشد</p>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ویرایش محصول</h1>
      <Card>
        <CardHeader>
          <CardTitle>جزئیات محصول</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            product={product}
            onSuccess={() => router.push("/admin/products")}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  )
}
