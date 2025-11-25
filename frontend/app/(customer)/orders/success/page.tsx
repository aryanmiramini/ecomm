import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-border bg-card p-10 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-600">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-foreground">سفارش شما ثبت شد</h1>
        <p className="text-muted-foreground">
          جزئیات سفارش به ایمیل شما ارسال شد و همکاران ما در سریع‌ترین زمان ممکن سفارش را پردازش خواهند کرد.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/products">ادامه خرید</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/orders">مشاهده سفارشات</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}


