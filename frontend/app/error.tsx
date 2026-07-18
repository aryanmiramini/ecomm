"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-2xl font-bold">خطایی رخ داد</h1>
      <p className="mb-6 text-muted-foreground">متأسفانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید.</p>
      <Button onClick={() => reset()}>تلاش مجدد</Button>
    </div>
  )
}
