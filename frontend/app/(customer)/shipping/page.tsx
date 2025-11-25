const shippingOptions = [
  { title: "ارسال استاندارد", description: "۳ تا ۵ روز کاری", cost: "رایگان برای سفارش‌های بالای ۵ میلیون تومان" },
  { title: "ارسال سریع", description: "۱ تا ۲ روز کاری", cost: "۱۸۰ هزار تومان" },
  { title: "تحویل حضوری", description: "همان روز", cost: "رایگان" },
]

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">شیوه‌های ارسال</h1>
          <p className="mt-2 text-muted-foreground">روش مناسب ارسال را متناسب با نیاز خود انتخاب کنید</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
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


