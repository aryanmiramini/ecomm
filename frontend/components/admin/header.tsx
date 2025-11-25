"use client"

import { Search, User, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NotificationButton } from "@/components/notifications/notification-button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import type { UserProfile } from "@/lib/types"

export function AdminHeader() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await apiClient.getProfile()
        setProfile(response.profile)
      } catch (error) {
        // User not logged in or error
      }
    }
    loadProfile()
  }, [])

  const handleLogout = async () => {
    try {
      await apiClient.logout()
      toast.success("با موفقیت خارج شدید")
      router.push("/login")
    } catch (error: any) {
      toast.error(error?.message || "خطا در خروج")
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
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-background px-6">
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

      <div className="flex items-center gap-3">
        <NotificationButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {profile?.email || "کاربر"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="ml-2 h-4 w-4" />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
