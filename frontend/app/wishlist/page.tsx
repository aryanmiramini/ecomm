"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { apiEndpoints } from "@/lib/api"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import ProductCard from "@/components/products/product-card"
import { Loader2, Heart } from "lucide-react"

export default function WishlistPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const [wishlist, setWishlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true)
        const response = await apiEndpoints.getWishlist()
        setWishlist(response.data.data || response.data || [])
        setError(null)
      } catch (error: any) {
        console.error("Failed to fetch wishlist:", error)
        setError(error.response?.data?.message || "Failed to load wishlist")
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent flex items-center gap-3">
          <Heart className="text-[rgb(159,31,92)]" size={40} />
          {t("wishlist") || "My Wishlist"}
        </h1>
        <p className="text-gray-600 text-lg">
          {t("wishlistSubtitle") || "Your favorite products"}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={48} className="text-[rgb(159,31,92)] animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[rgb(159,31,92)] text-white rounded-lg hover:bg-[rgb(133,30,90)] transition"
          >
            {t("retry") || "Retry"}
          </button>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Heart size={64} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {t("emptyWishlist") || "Your wishlist is empty"}
          </h2>
          <p className="text-gray-600 mb-8">
            {t("emptyWishlistMessage") || "Start adding products to your wishlist"}
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            {t("browseProducts") || "Browse Products"}
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item: any) => (
            <ProductCard key={item.productId || item.id} product={item.product || item} />
          ))}
        </div>
      )}
    </div>
  )
}

