export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-4xl font-bold">درباره ما</h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            فروشگاه آنلاین ما با هدف ارائه بهترین محصولات و خدمات به مشتریان عزیز تاسیس شده است. ما با بیش از ۱۰ سال
            تجربه در زمینه فروش آنلاین، توانسته‌ایم اعتماد هزاران مشتری را جلب کنیم.
          </p>

          <p>
            تیم ما متشکل از متخصصان با تجربه است که همواره در تلاش برای بهبود کیفیت خدمات و رضایت مشتریان هستند. ما
            اعتقاد داریم که کیفیت، قیمت مناسب و خدمات پس از فروش عالی، کلیدهای موفقیت در این حوزه هستند.
          </p>

          <h2 className="!mt-8 text-2xl font-bold text-foreground">چرا ما را انتخاب کنید؟</h2>

          <ul className="list-disc mr-6 space-y-2">
            <li>محصولات اصل و با کیفیت بالا</li>
            <li>قیمت‌های رقابتی و مناسب</li>
            <li>ارسال سریع به سراسر کشور</li>
            <li>گارانتی اصالت کالا</li>
            <li>پشتیبانی ۲۴ ساعته</li>
            <li>امکان بازگشت کالا تا ۷ روز</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
