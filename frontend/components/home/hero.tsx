"use client"

import { useI18n } from "@/i18n/provider"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function Hero() {
  const { t, locale } = useI18n()

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[rgb(159,31,92)] via-[rgb(133,30,90)] to-[rgb(97,74,104)]"
      >
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {t("welcome") || "Welcome to ROIDER"}
        </h1>
        <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed">
          {t("subtitle") || "Best products with best prices"}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[rgb(159,31,92)] rounded-xl font-bold hover:bg-opacity-95 transition-all duration-200 hover:scale-105 hover:shadow-2xl text-lg"
        >
          {t("exploreNow") || "Explore Now"}
          <ArrowLeft className={locale === "fa" ? "rotate-180" : ""} size={20} />
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  )
}
