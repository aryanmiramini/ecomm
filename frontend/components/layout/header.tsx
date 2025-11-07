"use client"

import Link from "next/link"
import { useState } from "react"
import { useI18n } from "@/i18n/provider"
import { useAuthStore } from "@/store/auth"
import { ShoppingCart, Menu, X, Search } from "lucide-react"

export default function Header() {
  const { locale, t } = useI18n()
  const { user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg glass-dark flex items-center justify-center">
              <span className="text-2xl font-bold text-white">R</span>
            </div>
            <span className="text-2xl font-bold hidden sm:inline">ROIDER</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/" className="hover:text-[rgb(159,31,92)] transition">
              {t("home")}
            </Link>
            <Link href="/products" className="hover:text-[rgb(159,31,92)] transition">
              {t("products")}
            </Link>
            <Link href="/categories" className="hover:text-[rgb(159,31,92)] transition">
              {t("categories")}
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden sm:flex items-center bg-white rounded-lg px-3 py-2 w-48">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder={locale === "fa" ? "جستجو..." : "Search..."}
                className="flex-1 outline-none ml-2"
              />
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-white/50 rounded-lg transition">
              <ShoppingCart size={24} />
              <span className="absolute top-0 right-0 bg-[rgb(159,31,92)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={logout} className="px-4 py-2 rounded-lg hover:bg-[rgb(159,31,92)]/10 transition">
                  {t("logout")}
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Link href="/login" className="px-4 py-2 rounded-lg hover:bg-white/50 transition">
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-[rgb(159,31,92)] text-white hover:bg-[rgb(133,30,90)] transition"
                >
                  {t("register")}
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t">
            <nav className="flex flex-col gap-3 mt-3">
              <Link href="/" className="py-2 hover:text-[rgb(159,31,92)]">
                {t("home")}
              </Link>
              <Link href="/products" className="py-2 hover:text-[rgb(159,31,92)]">
                {t("products")}
              </Link>
              <Link href="/categories" className="py-2 hover:text-[rgb(159,31,92)]">
                {t("categories")}
              </Link>
              {!user && (
                <>
                  <Link href="/login" className="py-2 hover:text-[rgb(159,31,92)]">
                    {t("login")}
                  </Link>
                  <Link href="/register" className="py-2 hover:text-[rgb(159,31,92)]">
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
