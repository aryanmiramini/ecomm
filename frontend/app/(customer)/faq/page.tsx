const faqs = [
  {
    question: "زمان ارسال سفارش‌ها چقدر است؟",
    answer: "سفارش‌ها ظرف ۲۴ ساعت پردازش و بر اساس شهر مقصد بین ۱ تا ۵ روز کاری ارسال می‌شوند.",
  },
  {
    question: "آیا امکان مرجوعی کالا وجود دارد؟",
    answer: "بله، تا ۷ روز پس از تحویل می‌توانید محصول را با حفظ شرایط فیزیکی مرجوع کنید.",
  },
  {
    question: "چگونه وضعیت سفارش را پیگیری کنم؟",
    answer: "با ورود به حساب کاربری و مراجعه به بخش سفارشات، وضعیت سفارش به صورت لحظه‌ای قابل مشاهده است.",
  },
]

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">سوالات متداول</h1>
          <p className="mt-2 text-muted-foreground">پاسخ پرسش‌های پرتکرار مشتریان را اینجا بخوانید</p>
        </div>

        <div className="space-y-4">
          {faqs.map((item) => (
            <div key={item.question} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">{item.question}</h2>
              <p className="mt-2 text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


