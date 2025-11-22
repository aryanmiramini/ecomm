"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, FolderTree, Users, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "داشبورد",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "محصولات",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "سفارشات",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "دسته‌بندی‌ها",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "کاربران",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "تنظیمات",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-6 border-l border-border bg-sidebar p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Package className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-sidebar-foreground">پنل مدیریت</h2>
          <p className="text-xs text-sidebar-foreground/60">فروشگاه آنلاین</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
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
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <button className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground">
        <LogOut className="h-5 w-5" />
        <span>خروج</span>
      </button>
    </div>
  )
}
