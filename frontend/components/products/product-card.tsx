"use client"

import Link from "next/link"
import { Heart, ShoppingCart, Loader2 } from "lucide-react"
import { useI18n } from "@/i18n/provider"
import { useState, useEffect } from "react"
import { useCartStore } from "@/store/cart"
import { useAuthStore } from "@/store/auth"
import { apiEndpoints } from "@/lib/api"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: any
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const { addItem, isLoading: cartLoading } = useCartStore()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false)

  useEffect(() => {
    // Check if product is in wishlist
    if (user && product.id) {
      apiEndpoints.checkWishlist(product.id.toString())
        .then((response) => {
          setIsWishlisted(response.data.data || false)
        })
        .catch(() => {
          // Silently fail if not authenticated or other error
        })
    }
  }, [user, product.id])

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      router.push("/login")
      return
    }

    setIsAddingToCart(true)
    try {
      await addItem(product.id.toString(), 1)
      // Show success feedback (you could add a toast here)
    } catch (error: any) {
      console.error("Failed to add to cart:", error)
      // Show error feedback
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      router.push("/login")
      return
    }

    setIsTogglingWishlist(true)
    try {
      if (isWishlisted) {
        await apiEndpoints.removeFromWishlist(product.id.toString())
        setIsWishlisted(false)
      } else {
        await apiEndpoints.addToWishlist(product.id.toString())
        setIsWishlisted(true)
      }
    } catch (error: any) {
      console.error("Failed to toggle wishlist:", error)
    } finally {
      setIsTogglingWishlist(false)
    }
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:border-[rgb(159,31,92)]/20">
        {/* Image */}
        <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart size={48} />
            </div>
          )}
          
          {/* Wishlist Button */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={handleToggleWishlist}
              disabled={isTogglingWishlist}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${
                isWishlisted
                  ? "bg-[rgb(159,31,92)]/90 text-white"
                  : "bg-white/90 text-gray-600 hover:bg-white"
              } ${isTogglingWishlist ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isTogglingWishlist ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Heart
                  size={18}
                  fill={isWishlisted ? "currentColor" : "none"}
                  className={isWishlisted ? "text-white" : ""}
                />
              )}
            </button>
          </div>

          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {product.discountPercentage}% {t("off") || "OFF"}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-[rgb(159,31,92)] transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
              {product.reviewCount > 0 && (
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-bold text-[rgb(159,31,92)]">
                {product.price?.toLocaleString() || "0"}
              </span>
              <span className="text-sm text-gray-500">{t("currency") || "Toman"}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm line-through text-gray-400">
                  {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          {product.quantity !== undefined && (
            <div className="mb-4">
              {product.quantity > 0 ? (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                  {t("inStock") || "In Stock"}
                </span>
              ) : (
                <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">
                  {t("outOfStock") || "Out of Stock"}
                </span>
              )}
            </div>
          )}

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || cartLoading || (product.quantity !== undefined && product.quantity === 0)}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all duration-200 ${
              product.quantity === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white hover:shadow-lg hover:scale-[1.02]"
            } ${isAddingToCart || cartLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isAddingToCart || cartLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>{t("loading") || "Loading..."}</span>
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>{t("addToCart") || "Add to Cart"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}
