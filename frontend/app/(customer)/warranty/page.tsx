export default function WarrantyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">گارانتی محصولات</h1>
          <p className="mt-2 text-muted-foreground">اطلاعات مربوط به ضمانت اصالت و خدمات پس از فروش</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">شرایط گارانتی</h2>
          <p className="text-muted-foreground">
            تمامی محصولات دارای گارانتی اصالت و سلامت فیزیکی هستند. در صورت وجود هرگونه ایراد فنی، محصول ظرف مدت ۴۸
            ساعت تعویض یا وجه آن عودت داده می‌شود.
          </p>
          <p className="text-muted-foreground">
            برای استفاده از خدمات گارانتی، فاکتور خرید و پلمپ محصول الزامی است. خدمات پس از فروش طبق قوانین شرکت تولید
            کننده ارائه می‌شود.
          </p>
        </div>
      </div>
    </div>
  )
}


