import Link from "next/link"
import { Instagram, Phone, Mail, MapPin, ShoppingBag } from "lucide-react"
import { storeConfig } from "@/lib/store-config"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">فروشگاه آنلاین</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              فروشگاه آنلاین ما با ارائه بهترین محصولات و خدمات، همواره در کنار شما عزیزان است.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">دسترسی سریع</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  محصولات
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  دسته‌بندی‌ها
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  سوالات متداول
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">خدمات مشتریان</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  شیوه‌های ارسال
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                  بازگشت کالا
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-muted-foreground hover:text-primary transition-colors">
                  گارانتی محصولات
                </Link>
              </li>
              <li>
                <Link href="/payment" className="text-muted-foreground hover:text-primary transition-colors">
                  روش‌های پرداخت
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  قوانین و مقررات
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">تماس با ما</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">تلفن پشتیبانی</p>
                  <p className="font-medium text-foreground" dir="ltr">{storeConfig.phone}</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ایمیل</p>
                  <p className="font-medium text-foreground" dir="ltr">{storeConfig.email}</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">آدرس</p>
                  <p className="font-medium text-foreground text-sm">{storeConfig.address}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} فروشگاه آنلاین. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  )
}
