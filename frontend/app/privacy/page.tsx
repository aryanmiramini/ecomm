"use client"

import { useI18n } from "@/i18n/provider"

export default function PrivacyPage() {
  const { locale } = useI18n()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center">
        {locale === "fa" ? "حریم خصوصی" : "Privacy Policy"}
      </h1>
      <p className="text-gray-600 text-center mb-12">
        {locale === "fa"
          ? "سیاست حفظ حریم خصوصی روایدر"
          : "ROIDER's Privacy Policy"}
      </p>

      <div className="bg-white rounded-xl p-8 glass prose max-w-none">
        <h2>{locale === "fa" ? "مقدمه" : "Introduction"}</h2>
        <p>
          {locale === "fa"
            ? "روایدر به حریم خصوصی کاربران خود احترام می‌گذارد و متعهد به محافظت از اطلاعات شخصی شماست."
            : "ROIDER respects the privacy of its users and is committed to protecting your personal information."}
        </p>

        <h2>{locale === "fa" ? "جمع‌آوری اطلاعات" : "Information Collection"}</h2>
        <p>
          {locale === "fa"
            ? "ما اطلاعات زیر را از شما جمع‌آوری می‌کنیم:"
            : "We collect the following information from you:"}
        </p>
        <ul>
          <li>{locale === "fa" ? "نام و نام خانوادگی" : "First and last name"}</li>
          <li>{locale === "fa" ? "آدرس ایمیل" : "Email address"}</li>
          <li>{locale === "fa" ? "شماره تلفن" : "Phone number"}</li>
          <li>{locale === "fa" ? "آدرس پستی" : "Postal address"}</li>
          <li>{locale === "fa" ? "اطلاعات پرداخت" : "Payment information"}</li>
        </ul>

        <h2>{locale === "fa" ? "استفاده از اطلاعات" : "Use of Information"}</h2>
        <p>
          {locale === "fa"
            ? "اطلاعات شما برای موارد زیر استفاده می‌شود:"
            : "Your information is used for:"}
        </p>
        <ul>
          <li>{locale === "fa" ? "پردازش سفارشات" : "Processing orders"}</li>
          <li>{locale === "fa" ? "ارسال اطلاعیه‌ها" : "Sending notifications"}</li>
          <li>{locale === "fa" ? "بهبود خدمات" : "Improving services"}</li>
          <li>{locale === "fa" ? "پشتیبانی از مشتریان" : "Customer support"}</li>
        </ul>

        <h2>{locale === "fa" ? "امنیت اطلاعات" : "Data Security"}</h2>
        <p>
          {locale === "fa"
            ? "ما از روش‌های امنیتی پیشرفته برای محافظت از اطلاعات شما استفاده می‌کنیم."
            : "We use advanced security methods to protect your information."}
        </p>

        <h2>{locale === "fa" ? "اشتراک‌گذاری اطلاعات" : "Information Sharing"}</h2>
        <p>
          {locale === "fa"
            ? "ما اطلاعات شخصی شما را با شخص ثالث به اشتراک نمی‌گذاریم، مگر در موارد زیر:"
            : "We do not share your personal information with third parties, except in the following cases:"}
        </p>
        <ul>
          <li>{locale === "fa" ? "برای پردازش پرداخت" : "For payment processing"}</li>
          <li>{locale === "fa" ? "برای ارسال سفارشات" : "For order delivery"}</li>
          <li>{locale === "fa" ? "در صورت الزام قانونی" : "When legally required"}</li>
        </ul>

        <h2>{locale === "fa" ? "کوکی‌ها" : "Cookies"}</h2>
        <p>
          {locale === "fa"
            ? "ما از کوکی‌ها برای بهبود تجربه کاربری استفاده می‌کنیم. شما می‌توانید استفاده از کوکی‌ها را در تنظیمات مرورگر خود غیرفعال کنید."
            : "We use cookies to improve user experience. You can disable cookies in your browser settings."}
        </p>

        <h2>{locale === "fa" ? "حقوق کاربران" : "User Rights"}</h2>
        <p>
          {locale === "fa"
            ? "شما حق دارید:"
            : "You have the right to:"}
        </p>
        <ul>
          <li>{locale === "fa" ? "دسترسی به اطلاعات خود" : "Access your information"}</li>
          <li>{locale === "fa" ? "ویرایش اطلاعات خود" : "Edit your information"}</li>
          <li>{locale === "fa" ? "حذف اطلاعات خود" : "Delete your information"}</li>
          <li>{locale === "fa" ? "درخواست کپی از اطلاعات خود" : "Request a copy of your information"}</li>
        </ul>

        <h2>{locale === "fa" ? "تغییرات" : "Changes"}</h2>
        <p>
          {locale === "fa"
            ? "ما ممکن است این سیاست را بروزرسانی کنیم. تغییرات در این صفحه منتشر خواهد شد."
            : "We may update this policy. Changes will be posted on this page."}
        </p>

        <div className="bg-[rgb(159,31,92)]/5 rounded-lg p-6 mt-8">
          <h3>{locale === "fa" ? "تماس با ما" : "Contact Us"}</h3>
          <p>
            {locale === "fa"
              ? "در صورت سوال درباره حریم خصوصی، با ما تماس بگیرید:"
              : "If you have questions about privacy, contact us:"}
          </p>
          <p className="font-semibold">privacy@roider.com</p>
        </div>
      </div>
    </div>
  )
}

