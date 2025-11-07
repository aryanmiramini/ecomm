"use client"

import { useI18n } from "@/i18n/provider"
import { Award, Users, Heart, TrendingUp } from "lucide-react"

export default function AboutPage() {
  const { t, locale } = useI18n()

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          {locale === "fa" ? "درباره روایدر" : "About ROIDER"}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {locale === "fa"
            ? "بزرگترین فروشگاه آنلاین با بیش از 10 سال تجربه در ارائه بهترین محصولات"
            : "The largest online store with over 10 years of experience in providing the best products"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="text-center p-6 bg-white rounded-xl glass">
          <div className="text-4xl font-bold text-[rgb(159,31,92)] mb-2">10+</div>
          <div className="text-gray-600">{locale === "fa" ? "سال تجربه" : "Years Experience"}</div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl glass">
          <div className="text-4xl font-bold text-[rgb(159,31,92)] mb-2">500K+</div>
          <div className="text-gray-600">{locale === "fa" ? "مشتری راضی" : "Happy Customers"}</div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl glass">
          <div className="text-4xl font-bold text-[rgb(159,31,92)] mb-2">10K+</div>
          <div className="text-gray-600">{locale === "fa" ? "محصول" : "Products"}</div>
        </div>
        <div className="text-center p-6 bg-white rounded-xl glass">
          <div className="text-4xl font-bold text-[rgb(159,31,92)] mb-2">99%</div>
          <div className="text-gray-600">{locale === "fa" ? "رضایت مشتری" : "Satisfaction"}</div>
        </div>
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-[rgb(159,31,92)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="text-[rgb(159,31,92)]" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">{locale === "fa" ? "کیفیت برتر" : "Top Quality"}</h3>
          <p className="text-gray-600">
            {locale === "fa"
              ? "تضمین کیفیت و اصالت کالا"
              : "Guaranteed quality and authenticity"}
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-[rgb(159,31,92)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-[rgb(159,31,92)]" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">{locale === "fa" ? "پشتیبانی 24/7" : "24/7 Support"}</h3>
          <p className="text-gray-600">
            {locale === "fa"
              ? "پشتیبانی همیشگی در خدمت شما"
              : "Always here to help you"}
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-[rgb(159,31,92)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-[rgb(159,31,92)]" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">{locale === "fa" ? "رضایت مشتری" : "Customer Satisfaction"}</h3>
          <p className="text-gray-600">
            {locale === "fa"
              ? "رضایت شما اولویت ماست"
              : "Your satisfaction is our priority"}
          </p>
        </div>
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-[rgb(159,31,92)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-[rgb(159,31,92)]" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">{locale === "fa" ? "رشد مستمر" : "Continuous Growth"}</h3>
          <p className="text-gray-600">
            {locale === "fa"
              ? "همیشه در حال بهبود خدمات"
              : "Always improving our services"}
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="bg-white rounded-2xl p-8 glass">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {locale === "fa" ? "داستان ما" : "Our Story"}
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            {locale === "fa"
              ? "روایدر در سال 2013 با هدف ارائه بهترین تجربه خرید آنلاین به مشتریان ایرانی تاسیس شد. ما با تمرکز بر کیفیت محصولات، قیمت‌های مناسب و خدمات پس از فروش عالی، توانسته‌ایم اعتماد بیش از 500 هزار مشتری را جلب کنیم."
              : "ROIDER was founded in 2013 with the goal of providing the best online shopping experience to Iranian customers. By focusing on product quality, fair prices, and excellent after-sales service, we have earned the trust of over 500,000 customers."}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {locale === "fa"
              ? "امروز، روایدر یکی از بزرگترین فروشگاه‌های آنلاین در ایران است که طیف گسترده‌ای از محصولات با کیفیت را با بهترین قیمت‌ها ارائه می‌دهد. ما به رشد و توسعه خود ادامه می‌دهیم تا همیشه در خدمت شما باشیم."
              : "Today, ROIDER is one of the largest online stores in Iran, offering a wide range of quality products at the best prices. We continue to grow and develop to always serve you better."}
          </p>
        </div>
      </div>
    </div>
  )
}

