"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StoreImage } from "@/components/store-image"
import type { Product } from "@/lib/types"

type ProductCardProps = {
  product: Product
  onAddToCart: (id: string) => void
  isAdding?: boolean
  showDescription?: boolean
}

export function ProductCard({ product, onAddToCart, isAdding = false, showDescription = true }: ProductCardProps) {
  const displayPrice = product.discountPrice || product.price
  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0

  return (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <StoreImage src={product.image} alt={product.nameFa} />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {hasDiscount && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white shadow-lg">
                {discountPercent}% تخفیف
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                ویژه
              </Badge>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 hidden p-4 md:block md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-300">
            <div className="bg-gradient-to-t from-black/60 via-transparent to-transparent absolute inset-0 pointer-events-none" />
            <Button
              size="sm"
              className="relative w-full gap-2 shadow-lg"
              disabled={isAdding || product.stock === 0}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart(product.id)
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              {product.stock === 0 ? "ناموجود" : isAdding ? "در حال افزودن..." : "افزودن به سبد"}
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        <Link href={`/products/${product.id}`}>
          {product.categoryFa && (
            <Badge variant="secondary" className="mb-2 text-xs">
              {product.categoryFa}
            </Badge>
          )}
          <h3 className="font-semibold text-card-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {product.nameFa}
          </h3>
          {showDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-1 h-10">
              {product.descriptionFa}
            </p>
          )}
        </Link>

        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-primary">
              {displayPrice.toLocaleString("fa-IR")} تومان
            </p>
            {hasDiscount && (
              <p className="text-sm text-muted-foreground line-through">
                {product.price.toLocaleString("fa-IR")} تومان
              </p>
            )}
          </div>
          <Button
            size="sm"
            className="gap-1 md:hidden shrink-0"
            disabled={isAdding || product.stock === 0}
            onClick={() => onAddToCart(product.id)}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock === 0 ? "ناموجود" : isAdding ? "..." : "افزودن"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
