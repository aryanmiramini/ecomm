"use client"

import { useI18n } from "@/i18n/provider"
import { Package, Truck, Home, CheckCircle } from "lucide-react"

export default function ShippingPage() {
  const { locale } = useI18n()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center">
        {locale === "fa" ? "اطلاعات ارسال" : "Shipping Information"}
      </h1>
      <p className="text-gray-600 text-center mb-12">
        {locale === "fa"
          ? "همه چیز درباره ارسال سفارشات"
          : "Everything about order delivery"}
      </p>

      <div className="space-y-8">
        {/* Shipping Process */}
        <div className="bg-white rounded-xl p-8 glass">
          <h2 className="text-2xl font-bold mb-6">
            {locale === "fa" ? "فرآیند ارسال" : "Shipping Process"}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgb(159,31,92)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="text-[rgb(159,31,92)]" size={28} />
              </div>
              <h3 className="font-bold mb-2">{locale === "fa" ? "پردازش" : "Processing"}</h3>
              <p className="text-sm text-gray-600">
                {locale === "fa" ? "1-2 روز کاری" : "1-2 business days"}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgb(159,31,92)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="text-[rgb(159,31,92)]" size={28} />
              </div>
              <h3 className="font-bold mb-2">{locale === "fa" ? "در حال ارسال" : "Shipping"}</h3>
              <p className="text-sm text-gray-600">
                {locale === "fa" ? "2-3 روز کاری" : "2-3 business days"}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgb(159,31,92)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Home className="text-[rgb(159,31,92)]" size={28} />
              </div>
              <h3 className="font-bold mb-2">{locale === "fa" ? "تحویل" : "Delivery"}</h3>
              <p className="text-sm text-gray-600">
                {locale === "fa" ? "در آدرس شما" : "To your address"}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgb(159,31,92)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-[rgb(159,31,92)]" size={28} />
              </div>
              <h3 className="font-bold mb-2">{locale === "fa" ? "تحویل داده شد" : "Delivered"}</h3>
              <p className="text-sm text-gray-600">
                {locale === "fa" ? "موفق" : "Success"}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="bg-white rounded-xl p-8 glass">
          <h2 className="text-2xl font-bold mb-6">
            {locale === "fa" ? "روش‌های ارسال" : "Shipping Methods"}
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-bold mb-2">
                {locale === "fa" ? "ارسال عادی (رایگان)" : "Standard Shipping (Free)"}
              </h3>
              <p className="text-gray-600 text-sm">
                {locale === "fa"
                  ? "تحویل در عرض 3-5 روز کاری - برای سفارشات بالای 500 هزار تومان"
                  : "Delivery within 3-5 business days - For orders over 500,000 Toman"}
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-bold mb-2">
                {locale === "fa" ? "ارسال سریع (50 هزار تومان)" : "Express Shipping (50,000 Toman)"}
              </h3>
              <p className="text-gray-600 text-sm">
                {locale === "fa"
                  ? "تحویل در عرض 1-2 روز کاری"
                  : "Delivery within 1-2 business days"}
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-bold mb-2">
                {locale === "fa" ? "ارسال فوری (100 هزار تومان)" : "Same-Day Shipping (100,000 Toman)"}
              </h3>
              <p className="text-gray-600 text-sm">
                {locale === "fa"
                  ? "تحویل در همان روز (فقط تهران)"
                  : "Same-day delivery (Tehran only)"}
              </p>
            </div>
          </div>
        </div>

        {/* Coverage */}
        <div className="bg-white rounded-xl p-8 glass">
          <h2 className="text-2xl font-bold mb-4">
            {locale === "fa" ? "پوشش ارسال" : "Shipping Coverage"}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {locale === "fa"
              ? "ما به تمام شهرهای ایران ارسال می‌کنیم. برای شهرستان‌ها، زمان تحویل ممکن است 1-2 روز بیشتر طول بکشد."
              : "We ship to all cities in Iran. For provinces, delivery may take 1-2 days longer."}
          </p>
        </div>
      </div>
    </div>
  )
}

