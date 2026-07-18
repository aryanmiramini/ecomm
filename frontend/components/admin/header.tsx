"use client"

import { Search, User, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NotificationButton } from "@/components/notifications/notification-button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "sonner"

export function AdminHeader() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [searchValue, setSearchValue] = useState("")
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await logout({ redirectTo: "/login" })
      toast.success("با موفقیت خارج شدید")
    } catch (error: any) {
      toast.error(error?.message || "خطا در خروج")
    } finally {
      setLoggingOut(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = new URLSearchParams()
      if (searchValue.trim()) query.set("search", searchValue.trim())
      router.push(`/admin/products${query.toString() ? `?${query}` : ""}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="جستجو محصولات..."
            className="w-full pr-10"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <NotificationButton />

        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{loggingOut ? "در حال خروج..." : "خروج"}</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="منوی کاربر">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.email || user?.phone || "مدیر"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={loggingOut} className="cursor-pointer text-destructive">
              <LogOut className="ml-2 h-4 w-4" />
              خروج از حساب
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
