"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { apiEndpoints } from "@/lib/api"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function Categories() {
  const { t } = useI18n()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await apiEndpoints.getCategories()
        setCategories(response.data.data || response.data || [])
        setError(null)
      } catch (error: any) {
        console.error("Failed to fetch categories:", error)
        setError(error.response?.data?.message || "Failed to load categories")
        // Use mock data if API fails
        setCategories([
          { id: 1, name: "Electronics", slug: "electronics", icon: "📱" },
          { id: 2, name: "Fashion", slug: "fashion", icon: "👕" },
          { id: 3, name: "Home & Garden", slug: "home-garden", icon: "🏠" },
          { id: 4, name: "Sports", slug: "sports", icon: "⚽" },
          { id: 5, name: "Books", slug: "books", icon: "📚" },
          { id: 6, name: "Toys", slug: "toys", icon: "🧸" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent">
          {t("allCategories") || "All Categories"}
        </h2>
        <p className="text-gray-600 text-lg">
          {t("browseCategories") || "Browse our wide range of product categories"}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={48} className="text-[rgb(159,31,92)] animate-spin" />
        </div>
      ) : error && categories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug || category.id}`}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[rgb(159,31,92)]/20 hover:scale-105">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon || "📦"}
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-[rgb(159,31,92)] transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
