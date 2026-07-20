import { storeConfig } from "@/lib/store-config"

export default function PaymentPage() {
  const hasBankDetails = Boolean(storeConfig.bankCard || storeConfig.bankSheba)

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

        {hasBankDetails ? (
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">اطلاعات کارت به کارت</h2>
            <dl className="space-y-3 text-sm">
              {storeConfig.bankHolder ? (
                <div>
                  <dt className="text-muted-foreground">نام صاحب حساب</dt>
                  <dd className="font-medium">{storeConfig.bankHolder}</dd>
                </div>
              ) : null}
              {storeConfig.bankCard ? (
                <div>
                  <dt className="text-muted-foreground">شماره کارت</dt>
                  <dd className="font-medium" dir="ltr">{storeConfig.bankCard}</dd>
                </div>
              ) : null}
              {storeConfig.bankSheba ? (
                <div>
                  <dt className="text-muted-foreground">شماره شبا</dt>
                  <dd className="font-medium" dir="ltr">{storeConfig.bankSheba}</dd>
                </div>
              ) : null}
            </dl>
            <p className="text-sm text-muted-foreground">
              پس از واریز، شماره پیگیری را در توضیحات سفارش یا از طریق پشتیبانی ارسال کنید.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            اطلاعات حساب بانکی از طریق پشتیبانی ({storeConfig.phone}) دریافت می‌شود.
          </p>
        )}
      </div>
    </div>
  )
}
