"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, ShoppingBag, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const menuItems = [
    {
      title: "اطلاعات حساب کاربری",
      href: "/profile",
      icon: User,
    },
    {
      title: "سفارش‌های من",
      href: "/profile/orders",
      icon: ShoppingBag,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-bold">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || user?.phone || "کاربر"}</p>
                <p className="text-sm text-muted-foreground">{user?.email || user?.phone}</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2 rounded-xl border border-border bg-card p-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
            <Button
              variant="ghost"
              className="justify-start gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              خروج
            </Button>
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  )
}

