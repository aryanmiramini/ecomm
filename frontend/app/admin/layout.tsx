import type React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifySessionToken } from "@/lib/auth-server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value

  if (!token) {
    redirect("/login?redirect=/admin")
  }

  const session = await verifySessionToken(token)
  if (!session?.sub || session.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen flex-col md:h-screen md:overflow-hidden">
      <div className="flex flex-1 flex-col md:flex-row md:overflow-hidden">
        <aside className="w-full shrink-0 border-b md:w-64 md:border-b-0 md:border-l">
          <AdminSidebar />
        </aside>

        <div className="flex flex-1 flex-col md:overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
