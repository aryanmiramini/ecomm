"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import type { Category } from "@/lib/types"

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
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مدیریت دسته‌بندی‌ها</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          افزودن دسته‌بندی
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.nameFa}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="space-y-3 p-4">
              <div>
                <h3 className="text-lg font-bold text-card-foreground">{category.nameFa}</h3>
                <p className="text-sm text-muted-foreground">{category.descriptionFa}</p>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">{category.productCount} محصول</span>
                <Button size="sm" variant="outline">
                  ویرایش
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
