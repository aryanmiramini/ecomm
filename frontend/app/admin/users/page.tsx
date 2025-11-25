 "use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import type { User } from "@/lib/types"
import { Trash2 } from "lucide-react"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await apiClient.getUsers()
        setUsers(res.users)
      } catch (e) {
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این کاربر مطمئن هستید؟")) return
    try {
      setDeletingId(id)
      await apiClient.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">مدیریت کاربران</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="space-y-3 p-4">
              <div>
                <h3 className="font-semibold">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || user.phone || "کاربر"}</h3>
                <p className="text-sm text-muted-foreground">{user.email || user.phone}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-muted px-2 py-1 text-xs">{user.role === "ADMIN" ? "مدیر" : "مشتری"}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(user.id)}
                  disabled={deletingId === user.id}
                >
                  <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                  حذف
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
