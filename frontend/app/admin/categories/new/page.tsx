"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

export default function NewCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.createCategory({
        name: form.name,
        description: form.description,
        image: form.image || undefined,
      })
      toast.success("دسته‌بندی ایجاد شد")
      router.push("/admin/categories")
    } catch (err: any) {
      toast.error(err?.message || "خطا در ایجاد دسته‌بندی")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ایجاد دسته‌بندی جدید</h1>
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات دسته‌بندی</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>نام دسته‌بندی</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
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
              <Label>آدرس تصویر</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "در حال ایجاد..." : "ایجاد دسته‌بندی"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

