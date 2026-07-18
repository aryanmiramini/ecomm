import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-3xl font-bold">صفحه پیدا نشد</h1>
      <p className="mb-6 text-muted-foreground">آدرسی که وارد کرده‌اید وجود ندارد.</p>
      <Button asChild>
        <Link href="/">بازگشت به صفحه اصلی</Link>
      </Button>
    </div>
  )
}
