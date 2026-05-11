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
import { apiClient } from "@/lib/api-client"
import type { Product } from "@/lib/types"
import { useCart } from "@/components/cart/cart-provider"
import { toast } from "sonner"

function ProductCard({ product, onAddToCart, isAdding }: { 
  product: Product
  onAddToCart: (id: string) => void
  isAdding: boolean 
}) {
  const displayPrice = product.discountPrice || product.price
  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0

  return (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.nameFa}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {hasDiscount && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white shadow-lg">
                {discountPercent}% تخفیف
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                ویژه
              </Badge>
            )}
          </div>
          
          {/* Quick Add Overlay */}
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
            <Button
              size="sm"
              className="w-full gap-2 shadow-lg"
              disabled={isAdding || product.stock === 0}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAddToCart(product.id)
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              {product.stock === 0 ? "ناموجود" : isAdding ? "در حال افزودن..." : "افزودن به سبد"}
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <Badge variant="secondary" className="mb-2 text-xs">{product.categoryFa}</Badge>
          <h3 className="font-semibold text-card-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {product.nameFa}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
            {product.descriptionFa}
          </p>
        </Link>

        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">
              {displayPrice.toLocaleString('fa-IR')} تومان
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {product.price.toLocaleString('fa-IR')} تومان
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-full">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
              {(product.rating ?? 0).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          {product.stock > 0 ? (
            <span className="text-green-600">موجود ({product.stock} عدد)</span>
          ) : (
            <span className="text-red-500">ناموجود</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

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
          limit: 24,
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
  }, [activeSearch, activeSort, activeCategory])

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
