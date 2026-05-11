"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { apiClient } from "@/lib/api-client"
import type { User } from "@/lib/types"
import { Trash2, Pencil, Users, AlertCircle, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "CUSTOMER" as "ADMIN" | "CUSTOMER",
    isActive: true,
  })

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await apiClient.getUsers()
      setUsers(res.users || [])
    } catch (e: any) {
      setUsers([])
      setError(e?.message || "خطا در بارگذاری کاربران")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role,
      isActive: user.isActive,
    })
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingUser(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      setSaving(true)
      await apiClient.updateUser(editingUser.id, formData)
      toast.success("کاربر با موفقیت به‌روزرسانی شد")
      await loadUsers()
      handleCloseDialog()
    } catch (error: any) {
      toast.error(error?.message || "خطا در به‌روزرسانی کاربر")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این کاربر مطمئن هستید؟")) return
    try {
      setDeletingId(id)
      await apiClient.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success("کاربر با موفقیت حذف شد")
    } catch (error: any) {
      toast.error(error?.message || "خطا در حذف کاربر")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">مدیریت کاربران</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadUsers} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          تلاش مجدد
        </Button>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">مدیریت کاربران</h1>
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Users className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">کاربری وجود ندارد</h3>
            <p className="text-sm text-muted-foreground">
              هنوز کاربری ثبت نام نکرده است.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  const admins = users.filter(u => u.role === "ADMIN")
  const customers = users.filter(u => u.role === "CUSTOMER")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مدیریت کاربران</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {users.length} کاربر ({admins.length} مدیر، {customers.length} مشتری)
          </p>
        </div>
        <Button onClick={loadUsers} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          بروزرسانی
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className={deletingId === user.id ? 'opacity-50' : ''}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.firstName || user.phone || "کاربر"}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{user.email || user.phone || "بدون اطلاعات تماس"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-1 text-xs font-medium ${
                    user.role === "ADMIN" 
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {user.role === "ADMIN" ? "مدیر" : "مشتری"}
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      user.isActive 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {user.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleOpenEdit(user)}
                    disabled={deletingId === user.id}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(user.id)}
                    disabled={deletingId === user.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              {user.createdAt && (
                <p className="text-xs text-muted-foreground">
                  عضویت: {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش کاربر</DialogTitle>
            <DialogDescription>اطلاعات کاربر را ویرایش کنید</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">نام</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">نام خانوادگی</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">تلفن</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">نقش</Label>
              <Select
                value={formData.role}
                onValueChange={(val) => setFormData({ ...formData, role: val as "ADMIN" | "CUSTOMER" })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">مشتری</SelectItem>
                  <SelectItem value="ADMIN">مدیر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">وضعیت</Label>
              <Select
                value={formData.isActive ? "true" : "false"}
                onValueChange={(val) => setFormData({ ...formData, isActive: val === "true" })}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">فعال</SelectItem>
                  <SelectItem value="false">غیرفعال</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={saving}>
                انصراف
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                ذخیره تغییرات
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
