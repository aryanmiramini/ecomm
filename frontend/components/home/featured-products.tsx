"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { apiEndpoints } from "@/lib/api"
import ProductCard from "@/components/products/product-card"
import { Loader2 } from "lucide-react"

export default function FeaturedProducts() {
  const { t } = useI18n()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await apiEndpoints.getProducts({ limit: 8 })
        setProducts(response.data.data || response.data || [])
        setError(null)
      } catch (error: any) {
        console.error("Failed to fetch products:", error)
        setError(error.response?.data?.message || "Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent">
          {t("featuredProducts") || "Featured Products"}
        </h2>
        <p className="text-gray-600 text-lg">
          {t("featuredProductsSubtitle") || "Discover our handpicked selection of premium products"}
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
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">{t("noProducts") || "No products available"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
