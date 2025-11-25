export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">بازگشت کالا</h1>
          <p className="mt-2 text-muted-foreground">شرایط و قوانین مرجوعی محصولات</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">شرایط مرجوعی</h2>
          <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
            <li>محصول باید در بسته‌بندی اصلی و بدون آسیب باشد.</li>
            <li>مدت زمان مرجوعی ۷ روز پس از دریافت محصول است.</li>
            <li>برای کالاهای بهداشتی امکان بازگشت وجود ندارد.</li>
            <li>هزینه ارسال مجدد بر عهده مشتری است.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


