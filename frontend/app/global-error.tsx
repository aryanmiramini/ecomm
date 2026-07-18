"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <div style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}>
          <h1>خطای سیستمی</h1>
          <p>برنامه با خطای غیرمنتظره‌ای مواجه شد.</p>
          <button type="button" onClick={() => reset()}>
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  )
}
