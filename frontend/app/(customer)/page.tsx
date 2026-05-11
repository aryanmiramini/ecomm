"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ShoppingCart, Star, TrendingUp, Zap, Truck, Shield, Headphones, ChevronLeft } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import type { Product, Category } from "@/lib/types"
import { useCart } from "@/components/cart/cart-provider"
import { toast } from "sonner"

interface SiteStats {
  totalProducts: number
  totalCategories: number
  totalCustomers: number
  satisfactionRate: number
  totalApprovedReviews: number
  averageRating: number | null
  yearsInBusiness: number | null
}

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
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
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
          <h3 className="font-semibold text-card-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {product.nameFa}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
            {product.descriptionFa}
          </p>
        </Link>

        <div className="flex items-center justify-between">
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
      </CardContent>
    </Card>
  )
}

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

function toPersianNumber(num: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)])
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingProductId, setAddingProductId] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, categoriesRes, statsRes] = await Promise.all([
          apiClient.getProducts({ limit: 20 }),
          apiClient.getCategories(),
          fetch('/api/stats').then(res => res.json()),
        ])
        setFeaturedProducts(productsRes.products.filter((p: Product) => p.featured).slice(0, 4))
        setNewProducts(productsRes.products.slice(0, 8))
        setCategories(categoriesRes.categories.slice(0, 6))
        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingProductId(productId)
      const product = [...featuredProducts, ...newProducts].find(p => p.id === productId)
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
      toast.error(error?.message || "خطا در افزودن به سبد خرید")
    } finally {
      setAddingProductId(null)
    }
  }

  return (
    <div className="space-y-0">
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-right space-y-6">
              <Badge className="inline-flex gap-2 bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
                <Zap className="h-4 w-4" />
                تا ۵۰٪ تخفیف ویژه
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">بهترین تجربه</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent">
                  خرید آنلاین
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                با بهترین قیمت‌ها و کیفیت برتر، محصولات مورد نیاز خود را با اطمینان از فروشگاه ما تهیه کنید. ارسال سریع و رایگان!
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/25 h-12 px-8">
                  <Link href="/products">
                    مشاهده محصولات
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8">
                  <Link href="/categories">دسته‌بندی‌ها</Link>
                </Button>
              </div>

              <div className="flex justify-center lg:justify-start gap-8 pt-8">
                <div className="text-center">
                  {loading || !stats ? (
                    <Skeleton className="h-9 w-16 mx-auto mb-1" />
                  ) : (
                    <p className="text-3xl font-bold text-primary">
                      {toPersianNumber(stats.totalProducts)}+
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">محصول</p>
                </div>
                <div className="text-center">
                  {loading || !stats ? (
                    <Skeleton className="h-9 w-16 mx-auto mb-1" />
                  ) : (
                    <p className="text-3xl font-bold text-primary">
                      {toPersianNumber(stats.totalCustomers)}+
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">مشتری</p>
                </div>
                <div className="text-center">
                  {loading || !stats ? (
                    <Skeleton className="h-9 w-16 mx-auto mb-1" />
                  ) : stats.totalApprovedReviews > 0 ? (
                    <p className="text-3xl font-bold text-primary">
                      {toPersianNumber(stats.satisfactionRate)}٪
                    </p>
                  ) : (
                    <p className="text-3xl font-bold text-muted-foreground">—</p>
                  )}
                  <p className="text-sm text-muted-foreground">رضایت</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl rotate-6" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl shadow-2xl shadow-primary/20 flex items-center justify-center">
                  <ShoppingCart className="w-32 h-32 text-white/90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-x-reverse divide-border">
            {[
              { icon: Truck, title: "ارسال رایگان", desc: "سفارش بالای ۵۰۰ هزار" },
              { icon: Shield, title: "ضمانت اصالت", desc: "کالای ۱۰۰٪ اصل" },
              { icon: Headphones, title: "پشتیبانی ۲۴/۷", desc: "پاسخگوی شما هستیم" },
              { icon: TrendingUp, title: "بهترین قیمت", desc: "تضمین قیمت" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 py-6 px-4 justify-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <p className="font-semibold text-foreground text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">محصولات ویژه</h2>
            <p className="text-muted-foreground mt-1">پرفروش‌ترین و محبوب‌ترین محصولات</p>
          </div>
          <Button asChild variant="ghost" className="gap-1 hidden sm:flex">
            <Link href="/products?featured=true">
              مشاهده همه
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isAdding={addingProductId === product.id}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-12">
              محصول ویژه‌ای یافت نشد
            </p>
          )}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/products?featured=true">مشاهده همه محصولات ویژه</Link>
          </Button>
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">دسته‌بندی محصولات</h2>
              <p className="text-muted-foreground mt-1">از میان دسته‌بندی‌های متنوع انتخاب کنید</p>
            </div>
            <Button asChild variant="ghost" className="gap-1 hidden sm:flex">
              <Link href="/categories">
                همه دسته‌ها
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-2xl" />
              ))
            ) : categories.length > 0 ? (
              categories.slice(0, 8).map((category, index) => {
                const gradients = [
                  "from-blue-600 to-cyan-500",
                  "from-purple-600 to-pink-500",
                  "from-orange-500 to-red-500",
                  "from-green-600 to-teal-500",
                  "from-indigo-600 to-violet-500",
                  "from-rose-500 to-pink-600",
                  "from-amber-500 to-yellow-500",
                  "from-emerald-500 to-green-600",
                ]
                const gradient = gradients[index % gradients.length]
                
                return (
                  <Link key={category.id} href={`/categories/${category.id}`}>
                    <Card className={`group relative h-36 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${gradient}`}>
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.nameFa}
                          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      )}
                      <div className="relative h-full flex flex-col items-center justify-center text-center p-4 z-10">
                        <h3 className="text-lg font-bold text-white mb-1 drop-shadow-md">{category.nameFa}</h3>
                        <p className="text-white/90 text-sm">{category.productCount || 0} محصول</p>
                        <ChevronLeft className="h-5 w-5 text-white/70 mt-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    </Card>
                  </Link>
                )
              })
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-12">
                دسته‌بندی یافت نشد
              </p>
            )}
          </div>
          
          <div className="sm:hidden mt-6 text-center">
            <Button asChild variant="outline">
              <Link href="/categories">مشاهده همه دسته‌بندی‌ها</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">جدیدترین محصولات</h2>
            <p className="text-muted-foreground mt-1">تازه‌ترین محصولات اضافه شده</p>
          </div>
          <Button asChild variant="ghost" className="gap-1 hidden sm:flex">
            <Link href="/products?sort=newest">
              مشاهده همه
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : newProducts.length > 0 ? (
            newProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isAdding={addingProductId === product.id}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-12">
              محصولی یافت نشد
            </p>
          )}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/products">مشاهده همه محصولات</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-accent text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')]" />
          </div>
          <CardContent className="relative py-12 md:py-16 text-center z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              همین حالا ثبت‌نام کنید و ۱۰٪ تخفیف بگیرید!
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              با عضویت در فروشگاه ما، از آخرین تخفیف‌ها و پیشنهادات ویژه باخبر شوید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold">
                <Link href="/register">ثبت نام رایگان</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="border-2 border-white/50 text-white bg-transparent hover:bg-white/20 hover:border-white hover:text-white font-semibold">
                <Link href="/about">درباره ما</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
