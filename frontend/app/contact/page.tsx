"use client"

import { useI18n } from "@/i18n/provider"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const { locale } = useI18n()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert(locale === "fa" ? "پیام شما ارسال شد!" : "Your message has been sent!")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center">
        {locale === "fa" ? "تماس با ما" : "Contact Us"}
      </h1>
      <p className="text-gray-600 text-center mb-12">
        {locale === "fa"
          ? "ما همیشه آماده پاسخگویی به شما هستیم"
          : "We're always here to help you"}
      </p>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {locale === "fa" ? "اطلاعات تماس" : "Contact Information"}
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[rgb(159,31,92)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="text-[rgb(159,31,92)]" size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">{locale === "fa" ? "تلفن" : "Phone"}</h3>
                <p className="text-gray-600">+98 21 1234 5678</p>
                <p className="text-gray-600">+98 912 345 6789</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[rgb(159,31,92)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-[rgb(159,31,92)]" size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">{locale === "fa" ? "ایمیل" : "Email"}</h3>
                <p className="text-gray-600">info@roider.com</p>
                <p className="text-gray-600">support@roider.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[rgb(159,31,92)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="text-[rgb(159,31,92)]" size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">{locale === "fa" ? "آدرس" : "Address"}</h3>
                <p className="text-gray-600">
                  {locale === "fa"
                    ? "تهران، خیابان ولیعصر، پلاک 123"
                    : "Tehran, Valiasr Street, No. 123"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-[rgb(159,31,92)]/5 rounded-xl p-6">
            <h3 className="font-bold mb-2">
              {locale === "fa" ? "ساعات کاری" : "Working Hours"}
            </h3>
            <p className="text-gray-700">
              {locale === "fa"
                ? "شنبه تا پنجشنبه: 9:00 - 18:00"
                : "Saturday to Thursday: 9:00 AM - 6:00 PM"}
            </p>
            <p className="text-gray-700">
              {locale === "fa"
                ? "جمعه: تعطیل"
                : "Friday: Closed"}
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-8 glass">
          <h2 className="text-2xl font-bold mb-6">
            {locale === "fa" ? "فرم تماس" : "Contact Form"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                {locale === "fa" ? "نام" : "Name"}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(159,31,92)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                {locale === "fa" ? "ایمیل" : "Email"}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(159,31,92)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                {locale === "fa" ? "موضوع" : "Subject"}
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(159,31,92)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                {locale === "fa" ? "پیام" : "Message"}
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(159,31,92)]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[rgb(159,31,92)] text-white rounded-lg font-semibold hover:bg-[rgb(133,30,90)] transition flex items-center justify-center gap-2"
            >
              <Send size={20} />
              {locale === "fa" ? "ارسال پیام" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

