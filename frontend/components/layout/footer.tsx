"use client"

import Link from "next/link"
import { useI18n } from "@/i18n/provider"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const { t, locale } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[rgb(159,31,92)] flex items-center justify-center">
                <span className="text-2xl font-bold text-white">R</span>
              </div>
              <span className="text-2xl font-bold">ROIDER</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {locale === "fa" 
                ? "بهترین تجربه خرید آنلاین با کیفیت‌ترین محصولات و بهترین قیمت‌ها"
                : "The best online shopping experience with quality products and best prices"}
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-[rgb(159,31,92)] transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-[rgb(159,31,92)] transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-[rgb(159,31,92)] transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-[rgb(159,31,92)] transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {locale === "fa" ? "دسترسی سریع" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[rgb(159,31,92)] transition">
                  {locale === "fa" ? "درباره ما" : "About Us"}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-[rgb(159,31,92)] transition">
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-[rgb(159,31,92)] transition">
                  {t("categories")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[rgb(159,31,92)] transition">
                  {locale === "fa" ? "تماس با ما" : "Contact Us"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {locale === "fa" ? "خدمات مشتریان" : "Customer Service"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-[rgb(159,31,92)] transition">
                  {locale === "fa" ? "راهنما" : "Help Center"}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-[rgb(159,31,92)] transition">
                  {locale === "fa" ? "اطلاعات ارسال" : "Shipping Info"}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-[rgb(159,31,92)] transition">
                  {locale === "fa" ? "بازگشت کالا" : "Returns"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-[rgb(159,31,92)] transition">
                  {locale === "fa" ? "حریم خصوصی" : "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {locale === "fa" ? "اطلاعات تماس" : "Contact Info"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[rgb(159,31,92)]" />
                <span className="text-gray-400">+98 21 1234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[rgb(159,31,92)]" />
                <span className="text-gray-400">info@roider.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[rgb(159,31,92)]" />
                <span className="text-gray-400">
                  {locale === "fa" ? "تهران، ایران" : "Tehran, Iran"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            © {currentYear} ROIDER. {locale === "fa" ? "تمامی حقوق محفوظ است" : "All rights reserved"}.
          </p>
        </div>
      </div>
    </footer>
  )
}