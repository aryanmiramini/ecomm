"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { apiEndpoints } from "@/lib/api"
import Link from "next/link"

export default function CategoriesPage() {
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
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{t("categories")}</h1>

      {loading ? (
        <div className="text-center py-12">{t("loading")}...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <div className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition cursor-pointer glass">
                <div className="text-5xl mb-4">{category.icon || "📦"}</div>
                <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500">
                  {category.productCount || 0} {t("products")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

