"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { apiEndpoints } from "@/lib/api"
import ProductCard from "@/components/products/product-card"
import { ChevronDown, Loader2, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProductsPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [categoriesRes, productsRes] = await Promise.all([
          apiEndpoints.getCategories(),
          apiEndpoints.getProducts({
            page,
            limit: 12,
            categoryId: selectedCategory || undefined,
            search: searchQuery || undefined,
          }),
        ])

        setCategories(categoriesRes.data.data || categoriesRes.data || [])
        const productsData = productsRes.data.data || productsRes.data || []
        setProducts(productsData)
        setTotal(productsRes.data.total || productsData.length)
      } catch (error: any) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, selectedCategory, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    // Search is handled by useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent">
          {t("products") || "Products"}
        </h1>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mb-6">
          <div className="relative flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:ring-2 focus-within:ring-[rgb(159,31,92)]/50 focus-within:border-[rgb(159,31,92)]">
            <Search size={20} className="text-gray-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === "fa" ? "جستجو محصولات..." : "Search products..."}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          {/* Categories Filter */}
          <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-gray-900">{t("categories") || "Categories"}</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedCategory("")
                  setPage(1)
                }}
                className={`w-full text-right px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  selectedCategory === ""
                    ? "bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {t("allCategories") || "All Categories"}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setPage(1)
                  }}
                  className={`w-full text-right px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="relative bg-white rounded-2xl p-6 border border-gray-100">
            <label className="block text-sm font-semibold mb-3 text-gray-900">
              {t("sortBy") || "Sort By"}
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 appearance-none cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-[rgb(159,31,92)]/50 text-gray-700"
                title={t("sortBy") || "Sort By"}
              >
                <option value="newest">{t("newest") || "Newest"}</option>
                <option value="popular">{t("popular") || "Popular"}</option>
                <option value="price-low">{t("priceLow") || "Price: Low to High"}</option>
                <option value="price-high">{t("priceHigh") || "Price: High to Low"}</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 pointer-events-none text-gray-400" size={20} />
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 size={48} className="text-[rgb(159,31,92)] animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">{t("noResults") || "No results found"}</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("")
                  setPage(1)
                }}
                className="px-6 py-2 bg-[rgb(159,31,92)] text-white rounded-lg hover:bg-[rgb(133,30,90)] transition"
              >
                {t("clearFilters") || "Clear Filters"}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {total > 12 && (
                <div className="flex justify-center items-center gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-6 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-gray-700 font-medium"
                  >
                    {t("previous") || "Previous"}
                  </button>
                  <span className="px-6 py-2 text-gray-700 font-medium">
                    {page} / {Math.ceil(total / 12)}
                  </span>
                  <button
                    disabled={page >= Math.ceil(total / 12)}
                    onClick={() => setPage(page + 1)}
                    className="px-6 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-gray-700 font-medium"
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
