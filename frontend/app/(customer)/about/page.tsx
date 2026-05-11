"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import {
  ShoppingBag,
  Users,
  Award,
  Truck,
  Shield,
  Headphones,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  FolderTree,
} from "lucide-react"

interface SiteStats {
  totalProducts: number
  totalCategories: number
  totalCustomers: number
  satisfactionRate: number
  totalApprovedReviews: number
  averageRating: number | null
  yearsInBusiness: number | null
}

function toPersianNumber(num: number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)])
}

export default function AboutPage() {
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/stats")
        const data = await res.json()
        if (data.success && data.data) {
          setStats(data.data)
        }
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statsDisplay = useMemo(() => {
    const rows: { value: string | null; label: string; icon: typeof Users }[] = [
      {
        value: stats != null && stats.yearsInBusiness != null ? `${toPersianNumber(stats.yearsInBusiness)}+` : null,
        label: "سال تجربه",
        icon: Award,
      },
      {
        value: stats != null ? `${toPersianNumber(stats.totalCustomers)}+` : null,
        label: "مشتری",
        icon: Users,
      },
      {
        value: stats != null ? `${toPersianNumber(stats.totalProducts)}+` : null,
        label: "محصول",
        icon: ShoppingBag,
      },
      {
        value: stats != null ? `${toPersianNumber(stats.totalCategories)}+` : null,
        label: "دسته‌بندی",
        icon: FolderTree,
      },
      {
        value:
          stats != null && stats.totalApprovedReviews > 0 ? `${toPersianNumber(stats.satisfactionRate)}٪` : null,
        label: "رضایت از نظرات",
        icon: TrendingUp,
      },
    ]
    if (stats != null && stats.yearsInBusiness == null) {
      return rows.filter((r) => r.label !== "سال تجربه")
    }
    return rows
  }, [stats])

  const features = [
    {
      icon: Shield,
      title: "ضمانت اصالت کالا",
      description: "تمامی محصولات ما اصل و دارای گارانتی معتبر هستند",
    },
    {
      icon: Truck,
      title: "ارسال سریع",
      description: "ارسال به سراسر کشور در کمترین زمان ممکن",
    },
    {
      icon: Headphones,
      title: "پشتیبانی ۲۴/۷",
      description: "تیم پشتیبانی ما همواره آماده پاسخگویی به شماست",
    },
    {
      icon: TrendingUp,
      title: "بهترین قیمت",
      description: "تضمین بهترین قیمت در مقایسه با رقبا",
    },
  ]

  const advantages = [
    "محصولات اصل و با کیفیت بالا",
    "قیمت‌های رقابتی و مناسب",
    "ارسال سریع به سراسر کشور",
    "گارانتی اصالت کالا",
    "پشتیبانی ۲۴ ساعته",
    "امکان بازگشت کالا تا ۷ روز",
  ]

  const heroBadgeText =
    loading || !stats
      ? "در حال بارگیری..."
      : stats.yearsInBusiness != null
        ? `بیش از ${toPersianNumber(stats.yearsInBusiness)} سال تجربه`
        : "فروشگاه آنلاین معتبر"

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Award className="h-4 w-4 ml-2" />
              {heroBadgeText}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              درباره <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent">فروشگاه آنلاین</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              ما با هدف ارائه بهترین محصولات و خدمات به مشتریان عزیز فعالیت می‌کنیم. اعتماد هزاران مشتری، بزرگترین افتخار ماست.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className={`grid gap-4 ${statsDisplay.length >= 5 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 md:grid-cols-4"}`}>
          {statsDisplay.map((stat, i) => (
            <Card key={i} className="border-0 shadow-lg bg-card">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                {loading ? (
                  <Skeleton className="h-9 w-16 mx-auto mb-1" />
                ) : stat.value != null ? (
                  <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                ) : (
                  <p className="text-3xl font-bold text-muted-foreground mb-1">—</p>
                )}
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4" variant="secondary">
              داستان ما
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-6">سفری به سوی کیفیت و اعتماد</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                فروشگاه آنلاین ما با هدف ارائه بهترین محصولات و خدمات به مشتریان عزیز تاسیس شده است.
                {loading || !stats ? (
                  " ..."
                ) : stats.yearsInBusiness != null ? (
                  <> ما با بیش از {toPersianNumber(stats.yearsInBusiness)} سال تجربه در زمینه فروش آنلاین، </>
                ) : (
                  <> ما با تمرکز بر کیفیت و خدمات، </>
                )}
                توانسته‌ایم اعتماد {loading || !stats ? "..." : <>{toPersianNumber(stats.totalCustomers)}+</>} مشتری را جلب کنیم.
              </p>
              <p>
                تیم ما متشکل از متخصصان با تجربه است که همواره در تلاش برای بهبود کیفیت خدمات و رضایت مشتریان هستند. ما اعتقاد
                داریم که کیفیت، قیمت مناسب و خدمات پس از فروش عالی، کلیدهای موفقیت در این حوزه هستند.
              </p>
              <p>
                در حال حاضر ما {loading || !stats ? "..." : <>{toPersianNumber(stats.totalProducts)}+</>} محصول متنوع در{" "}
                {loading || !stats ? "..." : <>{toPersianNumber(stats.totalCategories)}</>} دسته‌بندی مختلف ارائه می‌دهیم.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-foreground mb-4">چرا ما را انتخاب کنید؟</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {advantages.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary to-accent p-1">
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <ShoppingBag className="w-32 h-32 text-white/80" />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              مزایای ما
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">چرا فروشگاه آنلاین؟</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-card">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-accent text-white">
          <CardContent className="relative py-12 md:py-16 text-center z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">آماده شروع خرید هستید؟</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              همین حالا به جمع {loading ? "..." : toPersianNumber(stats?.totalCustomers || 0)}+ مشتری راضی ما بپیوندید و از بهترین
              محصولات با بهترین قیمت‌ها بهره‌مند شوید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg font-semibold">
                <Link href="/products">
                  مشاهده محصولات
                  <ArrowLeft className="h-5 w-5 mr-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/50 text-white hover:bg-white/20 hover:border-white font-semibold"
              >
                <Link href="/contact">تماس با ما</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
