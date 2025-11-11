"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/i18n/provider"
import { useAuthStore } from "@/store/auth"
import { useCartStore } from "@/store/cart"
import { ShoppingCart, Menu, X, Search, User, Heart } from "lucide-react"

export default function Header() {
  const { locale, t } = useI18n()
  const { user, logout } = useAuthStore()
  const { items, fetchCart } = useCartStore()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCart()
    }
  }, [user, fetchCart])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(159,31,92)] to-[rgb(133,30,90)] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-2xl font-bold text-white">R</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent hidden sm:inline">
              ROIDER
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-[rgb(159,31,92)] transition-colors duration-200 font-medium"
            >
              {t("home")}
            </Link>
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-[rgb(159,31,92)] transition-colors duration-200 font-medium"
            >
              {t("products")}
            </Link>
            <Link 
              href="/categories" 
              className="text-gray-700 hover:text-[rgb(159,31,92)] transition-colors duration-200 font-medium"
            >
              {t("categories")}
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className={`relative flex items-center bg-gray-50 rounded-xl px-4 py-2.5 transition-all duration-200 ${
                isSearchFocused ? 'ring-2 ring-[rgb(159,31,92)]/50 bg-white shadow-md' : 'hover:bg-gray-100'
              }`}>
                <Search size={20} className="text-gray-400 ml-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder={locale === "fa" ? "جستجو محصولات..." : "Search products..."}
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                />
              </div>
            </form>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search size={22} className="text-gray-600" />
            </button>

            {/* Wishlist */}
            <Link 
              href="/wishlist" 
              className="hidden sm:flex p-2.5 rounded-lg hover:bg-gray-100 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={22} className="text-gray-600" />
            </Link>

            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={22} className="text-gray-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium transition-colors text-sm"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User size={20} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName || user.email?.split('@')[0] || t("account")}
                  </span>
                </Link>
                <button 
                  onClick={logout} 
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors text-sm"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium text-sm"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white hover:shadow-lg transition-all duration-200 font-medium text-sm"
                >
                  {t("register")}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X size={24} className="text-gray-600" /> : <Menu size={24} className="text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 pt-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative flex items-center bg-gray-50 rounded-xl px-4 py-3">
                <Search size={20} className="text-gray-400 ml-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === "fa" ? "جستجو محصولات..." : "Search products..."}
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 pt-4">
            <nav className="flex flex-col gap-2">
              <Link 
                href="/" 
                className="px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t("home")}
              </Link>
              <Link 
                href="/products" 
                className="px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t("products")}
              </Link>
              <Link 
                href="/categories" 
                className="px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t("categories")}
              </Link>
              {user ? (
                <>
                  {user.role === "ADMIN" && (
                    <Link 
                      href="/admin" 
                      className="px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link 
                    href="/profile" 
                    className="px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("account")}
                  </Link>
                  <button 
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }} 
                    className="px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors text-right"
                  >
                    {t("logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("login")}
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-3 rounded-lg bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white font-medium transition-colors text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("register")}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
