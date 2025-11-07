"use client"

import { useI18n } from "@/i18n/provider"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function HelpPage() {
  const { locale } = useI18n()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = locale === "fa" ? [
    {
      question: "چگونه می‌توانم سفارش دهم؟",
      answer: "برای ثبت سفارش، ابتدا محصول مورد نظر را انتخاب کنید، سپس به سبد خرید اضافه کرده و مراحل پرداخت را تکمیل کنید."
    },
    {
      question: "روش‌های پرداخت چیست؟",
      answer: "ما پرداخت آنلاین، پرداخت در محل و پرداخت اقساطی را پشتیبانی می‌کنیم."
    },
    {
      question: "چقدر طول می‌کشد تا سفارشم برسد؟",
      answer: "معمولاً سفارشات در عرض 2 تا 5 روز کاری به دست شما می‌رسد."
    },
    {
      question: "آیا امکان بازگشت کالا وجود دارد؟",
      answer: "بله، شما می‌توانید تا 7 روز پس از دریافت کالا، آن را بازگرداندید."
    },
    {
      question: "چگونه می‌توانم وضعیت سفارشم را پیگیری کنم؟",
      answer: "با ورود به حساب کاربری خود، می‌توانید وضعیت سفارش را در بخش 'سفارش‌های من' مشاهده کنید."
    }
  ] : [
    {
      question: "How can I place an order?",
      answer: "To place an order, select the desired product, add it to your cart, and complete the payment process."
    },
    {
      question: "What are the payment methods?",
      answer: "We support online payment, cash on delivery, and installment payment."
    },
    {
      question: "How long does delivery take?",
      answer: "Orders typically arrive within 2 to 5 business days."
    },
    {
      question: "Can I return products?",
      answer: "Yes, you can return products within 7 days of receipt."
    },
    {
      question: "How can I track my order?",
      answer: "Log in to your account and check the status in the 'My Orders' section."
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center">
        {locale === "fa" ? "مرکز راهنما" : "Help Center"}
      </h1>
      <p className="text-gray-600 text-center mb-12">
        {locale === "fa"
          ? "پاسخ سوالات متداول شما"
          : "Answers to frequently asked questions"}
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl glass overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-lg">{faq.question}</span>
              <ChevronDown
                className={`transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                size={24}
              />
            </button>
            {openFaq === index && (
              <div className="px-6 pb-6 text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[rgb(159,31,92)]/5 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {locale === "fa" ? "نیاز به کمک بیشتر دارید؟" : "Need more help?"}
        </h2>
        <p className="text-gray-600 mb-6">
          {locale === "fa"
            ? "با تیم پشتیبانی ما تماس بگیرید"
            : "Contact our support team"}
        </p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 bg-[rgb(159,31,92)] text-white rounded-lg font-semibold hover:bg-[rgb(133,30,90)] transition"
        >
          {locale === "fa" ? "تماس با پشتیبانی" : "Contact Support"}
        </a>
      </div>
    </div>
  )
}

