export default function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">روش‌های پرداخت</h1>
          <p className="mt-2 text-muted-foreground">شیوه‌های پرداخت در فروشگاه ما</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">گزینه‌های پرداخت</h2>
          <ul className="list-disc pr-6 space-y-2 text-muted-foreground">
            <li>پرداخت نقدی در محل</li>
            <li>استفاده از دستگاه کارتخوان (POS) در محل</li>
            <li>کارت به کارت بانکی</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

