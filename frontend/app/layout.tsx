import type { Metadata } from "next"
import type { ReactNode } from "react"
import { I18nProvider } from "@/i18n/provider"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "ROIDER - فروشگاه آنلاین",
  description: "ROIDER - بهترین فروشگاه آنلاین برای خرید محصولات باکیفیت",
  keywords: ["ROIDER", "فروشگاه", "آنلاین", "خرید"],
  openGraph: {
    title: "ROIDER",
    description: "بهترین فروشگاه آنلاین",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const locale = "fa" // Default locale
  
  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="rgb(159, 31, 92)" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <I18nProvider locale={locale}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  )
}
