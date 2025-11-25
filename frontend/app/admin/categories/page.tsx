"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import type { Category } from "@/lib/types"
import Link from "next/link"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await apiClient.getCategories()
        setCategories(response.categories)
      } catch (error) {
        console.error("Error loading categories:", error)
        toast.error("خطا در بارگذاری دسته‌بندی‌ها")
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.nameFa || "",
        description: category.descriptionFa || "",
        image: category.image || "",
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: "",
        description: "",
        image: "",
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingCategory(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        image: formData.image || undefined,
      }

      if (editingCategory) {
        await apiClient.updateCategory(editingCategory.id, payload)
        toast.success("دسته‌بندی با موفقیت به‌روزرسانی شد")
      } else {
        await apiClient.createCategory(payload)
        toast.success("دسته‌بندی با موفقیت ایجاد شد")
      }

      // Reload categories
      const response = await apiClient.getCategories()
      setCategories(response.categories)
      handleCloseDialog()
    } catch (error: any) {
      toast.error(error?.message || "خطا در ذخیره دسته‌بندی")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف این دسته‌بندی مطمئن هستید؟")) {
      try {
        await apiClient.deleteCategory(id)
        setCategories(categories.filter((c) => c.id !== id))
        toast.success("دسته‌بندی با موفقیت حذف شد")
      } catch (error: any) {
        toast.error(error?.message || "خطا در حذف دسته‌بندی")
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مدیریت دسته‌بندی‌ها</h1>
        <Button className="gap-2" asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4" />
            افزودن دسته‌بندی
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.nameFa}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="space-y-3 p-4">
              <div>
                <h3 className="text-lg font-bold text-card-foreground">{category.nameFa}</h3>
                <p className="text-sm text-muted-foreground">{category.descriptionFa}</p>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">{category.productCount} محصول</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleOpenDialog(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}</DialogTitle>
            <DialogDescription>اطلاعات دسته‌بندی را وارد کنید</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام دسته‌بندی</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">توضیحات</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">آدرس تصویر</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                انصراف
              </Button>
              <Button type="submit">{editingCategory ? "ذخیره تغییرات" : "ایجاد دسته‌بندی"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
