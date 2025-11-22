import type React from "react"
import { Navbar } from "@/components/customer/navbar"
import { Footer } from "@/components/customer/footer"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
