"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Star, Search, SlidersHorizontal, Grid3X3, LayoutList, Package } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { apiClient } from "@/lib/api-client"
import type { Product } from "@/lib/types"
import { useCart } from "@/components/cart/cart-provider"
import { toast } from "sonner"

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-3 border-t">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  const [addingProductId, setAddingProductId] = useState<string | null>(null)
  const [totalProducts, setTotalProducts] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addItem } = useCart()

  const activeSearch = searchParams.get("search") ?? ""
  const activeSort = (searchParams.get("sort") as "newest" | "price-low" | "price-high" | "popular" | null) ?? "newest"
  const activeCategory = searchParams.get("categoryId") ?? ""
  const activePage = Number(searchParams.get("page") ?? "1")
  const pageSize = 24
  const totalPages = Math.max(1, Math.ceil(totalProducts / pageSize))

  useEffect(() => {
    setSearchValue(activeSearch)
  }, [activeSearch])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const response = await apiClient.getProducts({
          search: activeSearch || undefined,
          sort: activeSort,
          categoryId: activeCategory || undefined,
          page: activePage,
          limit: pageSize,
        })
        setProducts(response.products)
        setTotalProducts(response.total)
      } catch (error) {
        console.error("Error loading products:", error)
        toast.error("خطا در بارگیری محصولات")
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [activeSearch, activeSort, activeCategory, activePage])

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const next = new URLSearchParams(searchParams.toString())
    if (searchValue.trim()) {
      next.set("search", searchValue.trim())
    } else {
      next.delete("search")
    }
    router.push(`/products?${next.toString()}`)
  }

  const handleSortChange = (value: string) => {
    const next = new URLSearchParams(searchParams.toString())
    if (value === "newest") {
      next.delete("sort")
    } else {
      next.set("sort", value)
    }
    next.delete("page")
    router.push(`/products?${next.toString()}`)
  }

  const goToPage = (page: number) => {
    const next = new URLSearchParams(searchParams.toString())
    if (page <= 1) next.delete("page")
    else next.set("page", String(page))
    router.push(`/products?${next.toString()}`)
  }

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingProductId(productId)
      // Find product to pass product data for guest cart
      const product = products.find(p => p.id === productId)
      if (product) {
        await addItem(productId, 1, {
          nameFa: product.nameFa,
          image: product.image || "/placeholder.svg",
          price: product.discountPrice || product.price,
        })
      } else {
        await addItem(productId)
      }
      toast.success("محصول به سبد خرید افزوده شد")
    } catch (error: any) {
      toast.error(error?.message || "خطا در افزودن محصول")
    } finally {
      setAddingProductId(null)
    }
  }

  const clearFilters = () => {
    router.push("/products")
    setSearchValue("")
  }

  const hasActiveFilters = activeSearch || activeSort !== "newest" || activeCategory

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">محصولات</h1>
        <p className="text-muted-foreground mt-1">
          {loading ? "در حال بارگیری..." : `${totalProducts} محصول یافت شد`}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-muted/30 rounded-xl p-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجو در محصولات..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button type="submit">جستجو</Button>
          </form>

          {/* Sort & Filter Options */}
          <div className="flex items-center gap-3">
            <Select value={activeSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-44">
                <SlidersHorizontal className="h-4 w-4 ml-2" />
                <SelectValue placeholder="مرتب‌سازی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">جدیدترین</SelectItem>
                <SelectItem value="price-low">ارزان‌ترین</SelectItem>
                <SelectItem value="price-high">گران‌ترین</SelectItem>
                <SelectItem value="popular">محبوب‌ترین</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                پاک کردن فیلترها
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {activeSearch && (
              <Badge variant="secondary" className="gap-1">
                جستجو: {activeSearch}
              </Badge>
            )}
            {activeSort !== "newest" && (
              <Badge variant="secondary" className="gap-1">
                مرتب‌سازی: {
                  activeSort === "price-low" ? "ارزان‌ترین" :
                  activeSort === "price-high" ? "گران‌ترین" :
                  activeSort === "popular" ? "محبوب‌ترین" : activeSort
                }
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              isAdding={addingProductId === product.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">محصولی یافت نشد</h2>
          <p className="text-muted-foreground mb-6">
            {activeSearch 
              ? `نتیجه‌ای برای "${activeSearch}" یافت نشد` 
              : "محصولی در این دسته‌بندی وجود ندارد"}
          </p>
          <Button onClick={clearFilters}>مشاهده همه محصولات</Button>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <Button variant="outline" disabled={activePage <= 1} onClick={() => goToPage(activePage - 1)}>
            قبلی
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحه {activePage.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}
          </span>
          <Button variant="outline" disabled={activePage >= totalPages} onClick={() => goToPage(activePage + 1)}>
            بعدی
          </Button>
        </div>
      )}
    </div>
  )
}

function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-48 mb-2" />
      <Skeleton className="h-5 w-32 mb-8" />
      <Skeleton className="h-16 w-full rounded-xl mb-8" />
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  )
}
