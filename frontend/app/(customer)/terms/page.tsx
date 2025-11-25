export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">قوانین و مقررات</h1>
          <p className="mt-2 text-muted-foreground">مطالعه دقیق قوانین به بهبود تجربه خرید شما کمک می‌کند</p>
        </div>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">شرایط عمومی</h2>
          <p className="text-muted-foreground">
            کلیه مشتریان موظف هستند هنگام ثبت سفارش اطلاعات صحیح و کامل خود را وارد کنند. مسئولیت صحت اطلاعات بر
            عهده مشتری است.
          </p>
          <p className="text-muted-foreground">
            استفاده از خدمات و محصولات فروشگاه به معنی پذیرش تمام شرایط و قوانین درج شده در این صفحه است.
          </p>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">حفظ حریم خصوصی</h2>
          <p className="text-muted-foreground">
            تمامی اطلاعات مشتریان محرمانه بوده و صرفاً برای پردازش سفارش‌ها استفاده می‌شود. فروشگاه متعهد می‌شود از
            داده‌ها در جهت اهداف تبلیغاتی خارج از مجموعه استفاده نکند.
          </p>
        </section>
      </div>
    </div>
  )
}


