"use client"

import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { useI18n } from "@/i18n/provider"
import { useState } from "react"

interface ProductCardProps {
  product: any
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useI18n()
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition group glass">
        {/* Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {product.images?.[0] && (
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition"
            />
          )}
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsWishlisted(!isWishlisted)
              }}
              className="p-2 rounded-lg glass-dark hover:bg-[rgb(159,31,92)]/20 transition"
            >
              <Heart
                size={20}
                fill={isWishlisted ? "rgb(159,31,92)" : "none"}
                color={isWishlisted ? "rgb(159,31,92)" : "white"}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-semibold">{product.rating}</span>
              <span className="text-xs text-gray-500">({product.reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[rgb(159,31,92)]">{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-sm line-through text-gray-400">{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {product.discountPercentage > 0 && (
              <span className="text-xs bg-red-500 text-white px-2 py-1 rounded mt-1 inline-block">
                {product.discountPercentage}% {t("off") || "OFF"}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              // Add to cart logic
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[rgb(159,31,92)] text-white hover:bg-[rgb(133,30,90)] transition font-semibold"
          >
            <ShoppingCart size={18} />
            {t("addToCart")}
          </button>
        </div>
      </div>
    </Link>
  )
}
