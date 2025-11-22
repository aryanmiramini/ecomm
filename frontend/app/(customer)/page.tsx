"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Star, TrendingUp, Zap } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import type { Product, Category } from "@/lib/types"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([apiClient.getProducts(), apiClient.getCategories()])
        setFeaturedProducts(productsRes.products.filter((p: Product) => p.featured))
        setCategories(categoriesRes.categories)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 gap-2 bg-primary/20 text-primary hover:bg-primary/30">
              <Zap className="h-3 w-3" />
              فروش ویژه
            </Badge>
            <h1 className="mb-6 text-5xl font-bold leading-tight text-foreground">تجربه خرید آنلاین بی‌نظیر</h1>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              با بهترین قیمت‌ها و کیفیت برتر، محصولات مورد نیاز خود را از فروشگاه ما تهیه کنید
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/products">
                  مشاهده محصولات
                  <ArrowLeft className="h-5 w-5 rtl:mirror" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/categories">دسته‌بندی‌ها</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">محصولات ویژه</h2>
            <p className="mt-2 text-muted-foreground">پرفروش‌ترین و محبوب‌ترین محصولات</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">مشاهده همه</Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.nameFa}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
                {product.discountPrice && (
                  <Badge className="absolute left-2 top-2 bg-destructive text-destructive-foreground">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% تخفیف
                  </Badge>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button size="sm" className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    افزودن به سبد
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="mb-2 font-semibold text-card-foreground">{product.nameFa}</h3>
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{product.descriptionFa}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-primary">
                          {(product.discountPrice / 1000000).toFixed(1)} میلیون
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {(product.price / 1000000).toFixed(1)} میلیون
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary">
                        {(product.price / 1000000).toFixed(1)} میلیون
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground">دسته‌بندی محصولات</h2>
          <p className="mt-2 text-muted-foreground">انتخاب از میان دسته‌بندی‌های متنوع</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                <div className="flex items-center gap-6 p-6">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.nameFa}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-card-foreground">{category.nameFa}</h3>
                    <p className="mb-3 text-sm text-muted-foreground">{category.descriptionFa}</p>
                    <p className="text-sm font-medium text-primary">{category.productCount} محصول موجود</p>
                  </div>
                  <ArrowLeft className="h-6 w-6 text-muted-foreground transition-transform group-hover:-translate-x-1 rtl:mirror" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">کیفیت برتر</h3>
              <p className="text-muted-foreground">محصولات با بالاترین کیفیت و گارانتی اصالت</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">ارسال سریع</h3>
              <p className="text-muted-foreground">ارسال رایگان برای سفارش‌های بالای ۵ میلیون تومان</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">خرید آسان</h3>
              <p className="text-muted-foreground">فرآیند خرید ساده و امن با پشتیبانی ۲۴ ساعته</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
