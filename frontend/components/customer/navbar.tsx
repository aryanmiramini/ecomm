"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, LogOut, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/components/cart/cart-provider"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { UserProfile } from "@/lib/types"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const router = useRouter()
  const { cart } = useCart()

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await apiClient.getProfile()
        setProfile(response.profile)
      } catch (error) {
        // User not logged in
        setProfile(null)
      }
    }
    loadProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await apiClient.logout()
      toast.success("با موفقیت خارج شدید")
      setProfile(null)
      router.push("/")
    } catch (error: any) {
      toast.error(error?.message || "خطا در خروج")
    }
  }

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!searchTerm.trim()) return
    const query = new URLSearchParams({ search: searchTerm.trim() })
    router.push(`/products?${query.toString()}`)
    setSearchOpen(false)
  }

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
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {!!cart?.totalQuantity && cart.totalQuantity > 0 && (
                  <span className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cart.totalQuantity}
                  </span>
                )}
              </Link>
            </Button>
            {profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{profile.email || "کاربر"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="ml-2 h-4 w-4" />
                      سفارشات من
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="ml-2 h-4 w-4" />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}
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

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>جستجوی محصولات</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              autoFocus
              placeholder="نام محصول یا دسته‌بندی را وارد کنید..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit">جستجو</Button>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  )
}
