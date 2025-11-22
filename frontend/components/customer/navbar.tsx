"use client"

import Link from "next/link"
import { Search, ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">فروشگاه آنلاین</span>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              صفحه اصلی
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary">
              محصولات
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary">
              دسته‌بندی‌ها
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              درباره ما
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              تماس با ما
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                0
              </span>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="flex flex-col gap-4 pb-4 md:hidden">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              صفحه اصلی
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary">
              محصولات
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary">
              دسته‌بندی‌ها
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              درباره ما
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              تماس با ما
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
