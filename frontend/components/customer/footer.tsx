import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-foreground">درباره فروشگاه</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              فروشگاه آنلاین ما با ارائه بهترین محصولات و خدمات، همواره در کنار شما عزیزان است.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-foreground">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary">
                  قوانین و مقررات
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-foreground">خدمات مشتریان</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" className="hover:text-primary">
                  شیوه‌های ارسال
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary">
                  بازگشت کالا
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-primary">
                  گارانتی محصولات
                </Link>
              </li>
              <li>
                <Link href="/payment" className="hover:text-primary">
                  روش‌های پرداخت
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold text-foreground">ما را دنبال کنید</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} فروشگاه آنلاین. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  )
}
