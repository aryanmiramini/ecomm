"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { apiEndpoints } from "@/lib/api"
import Link from "next/link"

export default function Categories() {
  const { t } = useI18n()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiEndpoints.getCategories()
        setCategories(response.data.data || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
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
    <section className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold mb-12 text-center">{t("allCategories")}</h2>

      {loading ? (
        <div className="text-center py-12">{t("loading")}...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <div className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition cursor-pointer glass">
                <div className="text-4xl mb-3">{category.icon || "📦"}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}