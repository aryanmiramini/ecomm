"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import type { Category } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await apiClient.getCategories()
        setCategories(response.categories)
      } catch (error) {
        console.error("Error loading categories:", error)
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">دسته‌بندی محصولات</h1>
        <p className="mt-2 text-muted-foreground">انتخاب کنید از میان {categories.length} دسته‌بندی</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.nameFa}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 right-4 left-4">
                  <h3 className="text-2xl font-bold text-white">{category.nameFa}</h3>
                  <p className="mt-1 text-sm text-white/90">{category.productCount} محصول</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4">
                <p className="text-sm text-muted-foreground">{category.descriptionFa}</p>
                <ArrowLeft className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-x-1 rtl:mirror" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
