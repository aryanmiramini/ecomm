"use client"

import { useI18n } from "@/i18n/provider"

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
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-center">
          {locale === "fa" ? "نظرات مشتریان" : "Customer Reviews"}
        </h2>
        <p className="text-center text-gray-600 mb-12">
          {locale === "fa" ? "آنچه مشتریان ما می‌گویند" : "What our customers say"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-lg glass">
              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-xl">
                    ★
                  </span>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(159,31,92)] to-[rgb(133,30,90)] flex items-center justify-center text-white font-bold">
                  {testimonial.name[0]}
                </div>
                <div className={`${locale === "fa" ? "mr-3" : "ml-3"}`}>
                  <h4 className="font-semibold">{testimonial.name}</h4>
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