"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api-client"
import type { Category } from "@/lib/types"
import { toast } from "sonner"

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    quantity: "",
    categoryId: "",
    image: "",
  })

  useEffect(() => {
    apiClient
      .getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => setCategories([]))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!form.categoryId) {
      toast.error("لطفاً دسته‌بندی را انتخاب کنید")
      return
    }
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        sku: form.sku,
        quantity: Number(form.quantity || 0),
        categoryId: form.categoryId,
        images: form.image ? [form.image] : [],
      }
      await apiClient.createProduct(payload)
      toast.success("محصول با موفقیت ایجاد شد")
      router.push("/admin/products")
    } catch (err: any) {
      toast.error(err?.message || "خطا در ایجاد محصول")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ایجاد محصول جدید</h1>
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات محصول</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>نام محصول</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>کد SKU</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>قیمت (تومان)</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>موجودی</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>دسته‌بندی</Label>
                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب دسته‌بندی" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nameFa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>توضیحات</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="min-h-28"
              />
            </div>
            <div className="space-y-2">
              <Label>آدرس تصویر اصلی</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "در حال ایجاد..." : "ایجاد محصول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

