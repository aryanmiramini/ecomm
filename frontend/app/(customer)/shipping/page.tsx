import { formatToman, storeConfig } from "@/lib/store-config"

export default function ShippingPage() {
  const freeThresholdLabel = formatToman(storeConfig.freeShippingThreshold)
  const flatShippingLabel = formatToman(storeConfig.flatShipping)

  const shippingOptions = [
    {
      title: "ارسال استاندارد",
      description: "۳ تا ۵ روز کاری در سراسر کشور",
      cost: `رایگان برای سفارش‌های بالای ${freeThresholdLabel} تومان — در غیر این صورت ${flatShippingLabel} تومان`,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">شیوه‌های ارسال</h1>
          <p className="mt-2 text-muted-foreground">
            در حال حاضر فقط ارسال استاندارد فعال است. هزینه ارسال در صفحه تسویه‌حساب محاسبه می‌شود.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          {shippingOptions.map((option) => (
            <div key={option.title} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
              <h2 className="text-xl font-semibold">{option.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{option.description}</p>
              <p className="mt-4 text-primary">{option.cost}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
