"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { apiEndpoints } from "@/lib/api"
import ProductCard from "@/components/products/product-card"
import { ChevronDown } from "lucide-react"

export default function ProductsPage() {
  const { t } = useI18n()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          apiEndpoints.getCategories(),
          apiEndpoints.getProducts({
            page,
            limit: 12,
            categoryId: selectedCategory,
          }),
        ])

        setCategories(categoriesRes.data.data || [])
        setProducts(productsRes.data.data || [])
        setTotal(productsRes.data.total || 0)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, selectedCategory])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t("products")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          {/* Categories Filter */}
          <div className="mb-8">
            <h3 className="font-bold mb-4">{t("categories")}</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  selectedCategory === "" ? "bg-[rgb(159,31,92)] text-white" : "hover:bg-gray-100"
                }`}
              >
                {t("allCategories")}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    selectedCategory === category.id ? "bg-[rgb(159,31,92)] text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border appearance-none cursor-pointer"
              title={t("sortBy")}
            >
              <option value="newest">{t("newest") || "Newest"}</option>
              <option value="popular">{t("popular") || "Popular"}</option>
              <option value="price-low">{t("priceLow") || "Price: Low to High"}</option>
              <option value="price-high">{t("priceHigh") || "Price: High to Low"}</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 pointer-events-none text-gray-400" />
          </div>
        </aside>

        {/* Products */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-12">{t("loading")}...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">{t("noResults")}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {total > 12 && (
                <div className="flex justify-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-lg border disabled:opacity-50"
                  >
                    {t("previous") || "Previous"}
                  </button>
                  <span className="px-4 py-2">
                    {page} / {Math.ceil(total / 12)}
                  </span>
                  <button
                    disabled={page >= Math.ceil(total / 12)}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-lg border disabled:opacity-50"
                  >
                    {t("next") || "Next"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
