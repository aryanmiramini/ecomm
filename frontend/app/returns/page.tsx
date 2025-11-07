"use client"

import { useI18n } from "@/i18n/provider"

export default function ReturnsPage() {
  const { locale } = useI18n()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center">
        {locale === "fa" ? "شرایط بازگشت کالا" : "Return Policy"}
      </h1>
      <p className="text-gray-600 text-center mb-12">
        {locale === "fa"
          ? "همه چیز درباره بازگشت محصولات"
          : "Everything about product returns"}
      </p>

      <div className="bg-white rounded-xl p-8 glass prose max-w-none">
        <h2>{locale === "fa" ? "مدت زمان بازگشت" : "Return Period"}</h2>
        <p>
          {locale === "fa"
            ? "شما می‌توانید تا 7 روز پس از دریافت کالا، آن را بازگرداندید."
            : "You can return products within 7 days of receipt."}
        </p>

        <h2>{locale === "fa" ? "شرایط بازگشت" : "Return Conditions"}</h2>
        <ul>
          <li>{locale === "fa" ? "کالا نباید استفاده شده باشد" : "Product must be unused"}</li>
          <li>{locale === "fa" ? "بسته‌بندی اصلی محصول باید سالم باشد" : "Original packaging must be intact"}</li>
          <li>{locale === "fa" ? "همراه با فاکتور خرید" : "Must include purchase invoice"}</li>
          <li>{locale === "fa" ? "برچسب‌های اصلی محصول باید موجود باشد" : "Original product labels must be present"}</li>
        </ul>

        <h2>{locale === "fa" ? "فرآیند بازگشت" : "Return Process"}</h2>
        <ol>
          <li>{locale === "fa" ? "درخواست بازگشت را از طریق حساب کاربری ثبت کنید" : "Submit return request through your account"}</li>
          <li>{locale === "fa" ? "منتظر تایید درخواست باشید" : "Wait for request approval"}</li>
          <li>{locale === "fa" ? "کالا را بسته‌بندی کرده و آماده ارسال کنید" : "Package the product and prepare for return"}</li>
          <li>{locale === "fa" ? "پیک ما کالا را از شما دریافت می‌کند" : "Our courier will pick up the product"}</li>
          <li>{locale === "fa" ? "پس از بررسی، مبلغ به حساب شما بازگردانده می‌شود" : "After review, the amount will be refunded"}</li>
        </ol>

        <h2>{locale === "fa" ? "استثنائات" : "Exceptions"}</h2>
        <p>
          {locale === "fa"
            ? "کالاهای زیر قابل بازگشت نیستند:"
            : "The following products cannot be returned:"}
        </p>
        <ul>
          <li>{locale === "fa" ? "محصولات بهداشتی" : "Hygiene products"}</li>
          <li>{locale === "fa" ? "لوازم آرایشی باز شده" : "Opened cosmetics"}</li>
          <li>{locale === "fa" ? "کالاهای دیجیتال و نرم‌افزار" : "Digital products and software"}</li>
          <li>{locale === "fa" ? "کالاهای سفارشی" : "Custom products"}</li>
        </ul>

        <div className="bg-[rgb(159,31,92)]/5 rounded-lg p-6 mt-8">
          <h3>{locale === "fa" ? "نیاز به راهنمایی دارید؟" : "Need Help?"}</h3>
          <p>
            {locale === "fa"
              ? "با تیم پشتیبانی ما تماس بگیرید:"
              : "Contact our support team:"}
          </p>
          <p className="font-semibold">+98 21 1234 5678</p>
          <p className="font-semibold">support@roider.com</p>
        </div>
      </div>
    </div>
  )
}

