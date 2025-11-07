"use client"

import { useI18n } from "@/i18n/provider"
import Link from "next/link"

export default function Hero() {
  const { t, locale } = useI18n()

  return (
    <section className="min-h-screen flex items-center justify-center overflow-hidden relative">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgb(159, 31, 92) 0%, rgb(133, 30, 90) 50%, rgb(97, 74, 104) 100%)`,
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">{t("welcome")}</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">{t("subtitle")}</p>
        <Link
          href="/products"
          className="inline-block px-8 py-4 bg-white text-[rgb(159,31,92)] rounded-lg font-bold hover:bg-opacity-90 transition glass"
        >
          {t("exploreNow")}
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[rgb(159,31,92)]/20 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
    </section>
  )
}
