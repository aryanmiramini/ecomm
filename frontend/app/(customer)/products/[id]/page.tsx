"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Star } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useCart } from "@/components/cart/cart-provider"
import { toast } from "sonner"
import type { Product } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const productRes = await apiClient.getProduct(params.id as string)
        setProduct(productRes.product)
        const relatedRes = await apiClient.getProducts({ categoryId: productRes.product.categoryId, limit: 4 })
        setRelatedProducts(relatedRes.products.filter(p => p.id !== params.id))
      } catch (error) {
        toast.error("خطا در بارگیری محصول")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params.id])

  const handleAddToCart = async () => {
    if (!product) return
    setAdding(true)
    try {
      await addItem(product.id)
      toast.success("به سبد خرید افزوده شد")
    } catch (error: any) {
      toast.error(error.message || "خطا در افزودن به سبد")
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <Skeleton className="h-[500px] w-full" />
  if (!product) return <p className="text-center py-16">محصول یافت نشد</p>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.nameFa} className="w-full rounded-lg object-cover" />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {product.images.map((img, i) => (
              <img key={i} src={img} alt={`${product.nameFa} ${i+1}`} className="rounded object-cover h-20" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.nameFa}</h1>
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />{" "}
            <span>{(product.rating ?? 0).toFixed(1)}</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            {(product.discountPrice ?? product.price) / 1000000 > 0
              ? ((product.discountPrice ?? product.price) / 1000000).toFixed(1)
              : "0"}{" "}
            میلیون تومان
          </p>
          {product.discountPrice && (
            <p className="text-sm text-muted-foreground line-through">
              {(product.price / 1000000).toFixed(1)} میلیون تومان
            </p>
          )}
          <p className="text-muted-foreground">{product.descriptionFa}</p>
          <p className="text-sm">موجودی: {product.stock} عدد</p>
          <Button onClick={handleAddToCart} disabled={adding || product.stock === 0} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            {adding ? "در حال افزودن..." : "افزودن به سبد خرید"}
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">محصولات مرتبط</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {relatedProducts.map(p => (
          <Card key={p.id}>
            <img src={p.image} alt={p.nameFa} className="h-32 w-full object-cover rounded-t-lg" />
            <CardContent className="p-4">
              <p className="font-semibold">{p.nameFa}</p>
              <p className="text-primary">{(p.price / 1000000).toFixed(1)} میلیون</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
