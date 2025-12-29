"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2, AlertCircle, FolderOpen, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Category } from "@/lib/types"
import { toast } from "sonner"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getCategories()
      setCategories(response.categories)
    } catch (error: any) {
      console.error("Error loading categories:", error)
      setError(error.message || "خطا در بارگذاری دسته‌بندی‌ها")
      toast.error(error.message || "خطا در بارگذاری دسته‌بندی‌ها")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.nameFa || category.name,
        description: category.descriptionFa || category.description || "",
      })
    } else {
      setEditingCategory(null)
      setFormData({ name: "", description: "" })
    }
    setValidationErrors({})
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingCategory(null)
    setFormData({ name: "", description: "" })
    setValidationErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = "نام دسته‌بندی الزامی است"
    } else if (formData.name.length < 2) {
      errors.name = "نام دسته‌بندی باید حداقل ۲ کاراکتر باشد"
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("لطفاً خطاهای فرم را برطرف کنید")
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      }

      if (editingCategory) {
        await apiClient.updateCategory(editingCategory.id, payload)
        toast.success("دسته‌بندی با موفقیت ویرایش شد")
      } else {
        await apiClient.createCategory(payload)
        toast.success("دسته‌بندی با موفقیت ایجاد شد")
      }
      
      handleCloseDialog()
      loadCategories()
    } catch (error: any) {
      console.error("Error saving category:", error)
      toast.error(error.message || "خطا در ذخیره دسته‌بندی")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (category: Category) => {
    // Check if category has products
    const productCount = category.productCount || 0
    
    if (productCount > 0) {
      toast.error(`این دسته‌بندی دارای ${productCount} محصول است و قابل حذف نیست`)
      return
    }

    const confirmed = confirm(`آیا از حذف دسته‌بندی "${category.nameFa}" مطمئن هستید؟`)
    if (!confirmed) return

    try {
      setDeleting(category.id)
      await apiClient.deleteCategory(category.id)
      setCategories(categories.filter((c) => c.id !== category.id))
      toast.success("دسته‌بندی با موفقیت حذف شد")
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast.error(error.message || "خطا در حذف دسته‌بندی")
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadCategories}>تلاش مجدد</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">مدیریت دسته‌بندی‌ها</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {categories.length} دسته‌بندی
          </p>
        </div>
        <Button className="gap-2" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          افزودن دسته‌بندی
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">دسته‌بندی‌ای یافت نشد</h3>
            <p className="text-sm text-muted-foreground">
              هنوز دسته‌بندی‌ای اضافه نشده است
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              اولین دسته‌بندی را اضافه کنید
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`transition-opacity ${
                deleting === category.id ? 'opacity-50' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{category.nameFa}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenDialog(category)}
                      disabled={deleting === category.id}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(category)}
                      disabled={deleting === category.id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {category.descriptionFa && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {category.descriptionFa}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">تعداد محصولات:</span>
                  <span className="font-semibold">
                    {category.productCount || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? "مشخصات دسته‌بندی را ویرایش کنید"
                : "مشخصات دسته‌بندی جدید را وارد کنید"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                نام دسته‌بندی <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (validationErrors.name) {
                    setValidationErrors({ ...validationErrors, name: "" })
                  }
                }}
                placeholder="مثال: موبایل"
                className={validationErrors.name ? "border-destructive" : ""}
                disabled={saving}
              />
              {validationErrors.name && (
                <p className="text-sm text-destructive">{validationErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">توضیحات (اختیاری)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="توضیحات مختصر درباره دسته‌بندی"
                disabled={saving}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCloseDialog}
              disabled={saving}
            >
              انصراف
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingCategory ? "ویرایش" : "ایجاد"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}