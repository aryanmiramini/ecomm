"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { apiEndpoints } from "@/lib/api"
import ProductCard from "@/components/products/product-card"

export default function FeaturedProducts() {
  const { t } = useI18n()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiEndpoints.getProducts({ limit: 8 })
        setProducts(response.data.data || [])
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold mb-12">{t("featuredProducts")}</h2>

      {loading ? (
        <div className="text-center py-12">{t("loading")}...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
