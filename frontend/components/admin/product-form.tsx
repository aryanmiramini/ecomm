"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import type { Product, Category } from "@/lib/types"

interface ProductFormProps {
  product?: Product | null
  onSuccess: () => void
  onCancel: () => void
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    image: "",
  })

  useEffect(() => {
    loadCategories()
    if (product) {
      setFormData({
        name: product.nameFa,
        description: product.descriptionFa,
        price: product.price.toString(),
        stock: product.stock.toString(),
        categoryId: "", // We'd need category ID map, but product.category is name. 
        // This is a limitation of current mapper/type. 
        // Ideally backend returns categoryId.
        // For now we will list categories and try to match name or just require selection.
        image: product.image,
      })
    }
  }, [product])

  const loadCategories = async () => {
    try {
      const res = await apiClient.getCategories()
      setCategories(res.categories)
      // If editing, try to find category ID by name
      if (product && product.category) {
        const cat = res.categories.find((c: Category) => c.name === product.category || c.nameFa === product.categoryFa)
        if (cat) {
          setFormData(prev => ({ ...prev, categoryId: cat.id }))
        }
      }
    } catch (error) {
      console.error("Error loading categories", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name: formData.name,
      nameFa: formData.name, // Simplified for now
      description: formData.description,
      descriptionFa: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId: formData.categoryId,
      images: [formData.image],
    }

    try {
      if (product) {
        await apiClient.updateProduct(product.id, payload)
        toast.success("محصول ویرایش شد")
      } else {
        await apiClient.createProduct(payload)
        toast.success("محصول ایجاد شد")
      }
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || "خطا در ذخیره محصول")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>نام محصول</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>دسته بندی</Label>
        <Select 
          value={formData.categoryId} 
          onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="انتخاب کنید" />
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>قیمت (تومان)</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>موجودی</Label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>لینک تصویر</Label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <Label>توضیحات</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          انصراف
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "در حال ذخیره..." : "ذخیره"}
        </Button>
      </div>
    </form>
  )
}

