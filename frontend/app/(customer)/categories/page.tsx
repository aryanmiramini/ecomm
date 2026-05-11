"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Layers, Package } from "lucide-react"
import { apiClient } from "@/lib/api-client"
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
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
          <Layers className="h-7 w-7 text-primary" />
          دسته‌بندی محصولات
        </h1>
        <p className="text-muted-foreground mt-1">
          {categories.length} دسته‌بندی موجود
        </p>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="group relative h-64 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                {/* Background Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80">
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.nameFa}
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 z-10">
                  <Badge className="w-fit mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Package className="h-3 w-3 ml-1" />
                    {category.productCount} محصول
                  </Badge>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.nameFa}
                  </h3>
                  
                  <p className="text-white/80 text-sm line-clamp-2 mb-4">
                    {category.descriptionFa || `محصولات دسته‌بندی ${category.nameFa}`}
                  </p>
                  
                  <div className="flex items-center gap-2 text-white/90 text-sm group-hover:text-white transition-colors">
                    <span>مشاهده محصولات</span>
                    <ArrowLeft className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Layers className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">دسته‌بندی موجود نیست</h2>
          <p className="text-muted-foreground">دسته‌بندی محصولات به زودی اضافه خواهد شد.</p>
        </div>
      )}
    </div>
  )
}
