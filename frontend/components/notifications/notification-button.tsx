"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function NotificationButton() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  const loadNotifications = async () => {
    if (!isAuthenticated) return
    try {
      const res = await apiClient.getNotifications()
      setNotifications(res.notifications)
      setUnreadCount(res.notifications.filter((n: any) => !n.isRead).length)
    } catch (error) {
      console.error("Error loading notifications", error)
    }
  }

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 60000) // Poll every minute
    return () => clearInterval(interval)
  }, [isAuthenticated])

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiClient.markNotificationRead(id)
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking as read", error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await apiClient.markAllNotificationsRead()
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success("همه اعلان‌ها خوانده شدند")
    } catch (error) {
      toast.error("خطا در عملیات")
    }
  }

  if (!isAuthenticated) return null

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 9 ? "+9" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel>اعلان‌ها</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={handleMarkAllRead}>
              خواندن همه
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              اعلان جدیدی ندارید
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 cursor-default",
                  !notification.isRead && "bg-muted/50"
                )}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="flex w-full justify-between gap-2">
                  <span className={cn("font-medium", !notification.isRead && "text-primary")}>
                    {notification.title}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(notification.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {notification.message}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

