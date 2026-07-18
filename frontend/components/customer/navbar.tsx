"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, LogOut, Package, Heart, Settings, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/components/cart/cart-provider"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "sonner"
import { useState } from "react"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()
  const { cart } = useCart()
  const { user, logout, loading: authLoading } = useAuth()

  const isAdmin = user?.role === "ADMIN"
  const displayName = user?.firstName || user?.email || user?.phone || "کاربر"

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    setMobileMenuOpen(false)
    try {
      await logout()
      toast.success("با موفقیت خارج شدید")
    } catch (error: any) {
      toast.error(error?.message || "خطا در خروج")
    } finally {
      setLoggingOut(false)
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
        <div className="flex h-16 items-center justify-between gap-2">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary">
              <ShoppingCart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="truncate text-lg font-bold text-foreground sm:text-xl">فروشگاه آنلاین</span>
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

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {isAdmin && (
              <Button
                variant="default"
                size="sm"
                asChild
                className="hidden lg:flex gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md"
              >
                <Link href="/admin">
                  <Shield className="h-4 w-4" />
                  پنل مدیریت
                </Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" aria-label="جستجو" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart" aria-label="سبد خرید">
                <ShoppingCart className="h-5 w-5" />
                {!!cart?.totalQuantity && cart.totalQuantity > 0 && (
                  <span className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cart.totalQuantity}
                  </span>
                )}
              </Link>
            </Button>

            {authLoading ? (
              <div className="hidden h-9 w-24 animate-pulse rounded-md bg-muted sm:block" />
            ) : user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden gap-2 sm:inline-flex"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "..." : "خروج"}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden gap-2 md:inline-flex">
                      <User className="h-4 w-4" />
                      <span className="max-w-[120px] truncate">{displayName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{displayName}</span>
                          {isAdmin && (
                            <Badge variant="secondary" className="text-xs bg-violet-100 text-violet-700">
                              مدیر
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{user.email || user.phone}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer text-violet-600">
                            <Shield className="ml-2 h-4 w-4" />
                            پنل مدیریت
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <Settings className="ml-2 h-4 w-4" />
                        حساب کاربری
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer">
                        <Package className="ml-2 h-4 w-4" />
                        سفارشات من
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="cursor-pointer">
                        <Heart className="ml-2 h-4 w-4" />
                        علاقه‌مندی‌ها
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="ml-2 h-4 w-4" />
                      خروج از حساب
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" className="md:hidden" asChild>
                  <Link href="/profile" aria-label="حساب کاربری">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href="/login">ورود</Link>
                </Button>
                <Button variant="default" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href="/register">ثبت‌نام</Link>
                </Button>
                <Button variant="ghost" size="icon" asChild className="sm:hidden">
                  <Link href="/login" aria-label="ورود">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="منو"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="flex flex-col gap-3 border-t border-border py-4 md:hidden">
            <Link href="/" className="text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
              صفحه اصلی
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
              محصولات
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
              دسته‌بندی‌ها
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
              درباره ما
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
              تماس با ما
            </Link>

            <div className="my-1 border-t border-border pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground px-1">سلام، {displayName}</p>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-violet-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4" />
                      پنل مدیریت
                    </Link>
                  )}
                  <Link href="/profile" className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                    حساب کاربری
                  </Link>
                  <Link href="/orders" className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                    سفارشات من
                  </Link>
                  <Link href="/wishlist" className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                    علاقه‌مندی‌ها
                  </Link>
                  <Button
                    variant="destructive"
                    className="mt-1 w-full justify-start gap-2"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "در حال خروج..." : "خروج از حساب"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      ورود
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      ثبت‌نام
                    </Link>
                  </Button>
                </div>
              )}
            </div>
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
