"use client"

import { useI18n } from "@/i18n/provider"
import { Star } from "lucide-react"

export default function Testimonials() {
  const { t, locale } = useI18n()

  const testimonials = [
    {
      id: 1,
      name: locale === "fa" ? "علی احمدی" : "Ali Ahmadi",
      role: locale === "fa" ? "مشتری وفادار" : "Loyal Customer",
      content:
        locale === "fa"
          ? "خرید از ROIDER همیشه تجربه‌ای عالی است. کیفیت محصولات و سرعت ارسال بی‌نظیر است."
          : "Shopping from ROIDER is always an excellent experience. Product quality and delivery speed are unmatched.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 2,
      name: locale === "fa" ? "مریم کریمی" : "Maryam Karimi",
      role: locale === "fa" ? "خریدار" : "Shopper",
      content:
        locale === "fa"
          ? "تنوع محصولات و قیمت‌های مناسب باعث شده که ROIDER اولین انتخاب من برای خرید آنلاین باشد."
          : "Product variety and reasonable prices make ROIDER my first choice for online shopping.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
    },
    {
      id: 3,
      name: locale === "fa" ? "رضا محمدی" : "Reza Mohammadi",
      role: locale === "fa" ? "کاربر جدید" : "New User",
      content:
        locale === "fa"
          ? "پشتیبانی عالی و پاسخگویی سریع. واقعاً احساس می‌کنم برایشان مهم هستم."
          : "Excellent support and quick response. I really feel that I matter to them.",
      rating: 5,
      avatar: "/placeholder-user.jpg",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent">
            {locale === "fa" ? "نظرات مشتریان" : "Customer Reviews"}
          </h2>
          <p className="text-gray-600 text-lg">
            {locale === "fa" ? "آنچه مشتریان ما می‌گویند" : "What our customers say"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[rgb(159,31,92)]/20"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed text-base">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(159,31,92)] to-[rgb(133,30,90)] flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
