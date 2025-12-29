"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { AlertCircle, Loader2 } from "lucide-react"
import type { Product, Category } from "@/lib/types"

interface ProductFormProps {
  product?: Product | null
  onSuccess: () => void
  onCancel: () => void
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    sku: "",
    quantity: "",
    categoryId: "",
    image: "",
    images: [] as string[],
    isFeatured: false,
    isActive: true,
  })

  useEffect(() => {
    loadCategories()
    if (product) {
      setFormData({
        name: product.nameFa || "",
        description: product.descriptionFa || "",
        price: product.price?.toString() || "",
        discountPrice: product.discountPrice?.toString() || "",
        sku: product.sku || "",
        quantity: (product.quantity ?? product.stock ?? 0).toString(),
        categoryId: product.categoryId || "",
        image: product.image || "",
        images: product.images || [],
        isFeatured: product.featured ?? false,
        isActive: product.isActive ?? true,
      })
    }
  }, [product])

  const loadCategories = async () => {
    try {
      setLoadingCategories(true)
      const res = await apiClient.getCategories()
      setCategories(res.categories)
    } catch (error: any) {
      console.error("Error loading categories", error)
      toast.error("خطا در بارگذاری دسته‌بندی‌ها")
    } finally {
      setLoadingCategories(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = "نام محصول الزامی است"
    }
    
    if (!formData.sku.trim()) {
      errors.sku = "کد SKU الزامی است"
    } else if (!/^[A-Za-z0-9-_]+$/.test(formData.sku)) {
      errors.sku = "کد SKU فقط می‌تواند شامل حروف انگلیسی، اعداد، خط تیره و زیرخط باشد"
    }
    
    if (!formData.categoryId) {
      errors.categoryId = "دسته‌بندی را انتخاب کنید"
    }
    
    const price = Number(formData.price)
    if (!formData.price || isNaN(price) || price <= 0) {
      errors.price = "قیمت باید عددی بزرگتر از صفر باشد"
    }
    
    if (formData.discountPrice) {
      const discountPrice = Number(formData.discountPrice)
      if (isNaN(discountPrice) || discountPrice <= 0) {
        errors.discountPrice = "قیمت تخفیف باید عددی بزرگتر از صفر باشد"
      } else if (discountPrice >= price) {
        errors.discountPrice = "قیمت تخفیف باید کمتر از قیمت اصلی باشد"
      }
    }
    
    const quantity = Number(formData.quantity)
    if (!formData.quantity || isNaN(quantity) || quantity < 0) {
      errors.quantity = "موجودی باید عددی بزرگتر یا مساوی صفر باشد"
    }
    
    if (!formData.description.trim()) {
      errors.description = "توضیحات محصول الزامی است"
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!validateForm()) {
      toast.error("لطفاً خطاهای فرم را برطرف کنید")
      return
    }
    
    setLoading(true)

    const basePrice = Number(formData.price)
    const discountPrice = formData.discountPrice ? Number(formData.discountPrice) : null
    const hasDiscount = discountPrice !== null && !isNaN(discountPrice) && discountPrice > 0 && discountPrice < basePrice

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: hasDiscount ? discountPrice! : basePrice,
      originalPrice: hasDiscount ? basePrice : undefined,
      discountPercentage: hasDiscount
        ? Number((((basePrice - (discountPrice as number)) / basePrice) * 100).toFixed(2))
        : undefined,
      sku: formData.sku.trim(),
      quantity: Number(formData.quantity),
      categoryId: formData.categoryId,
      images: formData.image ? [formData.image.trim()] : [],
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
    }

    try {
      if (product) {
        await apiClient.updateProduct(product.id, payload)
        toast.success("محصول با موفقیت ویرایش شد")
      } else {
        await apiClient.createProduct(payload)
        toast.success("محصول با موفقیت ایجاد شد")
      }
      onSuccess()
    } catch (error: any) {
      console.error("Error saving product:", error)
      setError(error.message || "خطا در ذخیره محصول")
      toast.error(error.message || "خطا در ذخیره محصول")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  if (loadingCategories) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            نام محصول <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="مثال: گوشی موبایل سامسونگ"
            className={validationErrors.name ? "border-destructive" : ""}
            disabled={loading}
          />
          {validationErrors.name && (
            <p className="text-sm text-destructive">{validationErrors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sku">
            کد SKU <span className="text-destructive">*</span>
          </Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleInputChange("sku", e.target.value)}
            placeholder="مثال: PROD-001"
            className={validationErrors.sku ? "border-destructive" : ""}
            disabled={loading}
          />
          {validationErrors.sku && (
            <p className="text-sm text-destructive">{validationErrors.sku}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">
          دسته‌بندی <span className="text-destructive">*</span>
        </Label>
        <Select 
          value={formData.categoryId} 
          onValueChange={(val) => handleInputChange("categoryId", val)}
          disabled={loading || categories.length === 0}
        >
          <SelectTrigger 
            id="category"
            className={validationErrors.categoryId ? "border-destructive" : ""}
          >
            <SelectValue placeholder="انتخاب دسته‌بندی" />
          </SelectTrigger>
          <SelectContent>
            {categories.length === 0 ? (
              <SelectItem value="none" disabled>
                دسته‌بندی‌ای یافت نشد
              </SelectItem>
            ) : (
              categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nameFa}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {validationErrors.categoryId && (
          <p className="text-sm text-destructive">{validationErrors.categoryId}</p>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price">
            قیمت (تومان) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="1000000"
            min="0"
            className={validationErrors.price ? "border-destructive" : ""}
            disabled={loading}
          />
          {validationErrors.price && (
            <p className="text-sm text-destructive">{validationErrors.price}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discountPrice">قیمت با تخفیف (تومان)</Label>
          <Input
            id="discountPrice"
            type="number"
            value={formData.discountPrice}
            onChange={(e) => handleInputChange("discountPrice", e.target.value)}
            placeholder="اختیاری"
            min="0"
            className={validationErrors.discountPrice ? "border-destructive" : ""}
            disabled={loading}
          />
          {validationErrors.discountPrice && (
            <p className="text-sm text-destructive">{validationErrors.discountPrice}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">
            موجودی <span className="text-destructive">*</span>
          </Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange("quantity", e.target.value)}
            placeholder="100"
            min="0"
            className={validationErrors.quantity ? "border-destructive" : ""}
            disabled={loading}
          />
          {validationErrors.quantity && (
            <p className="text-sm text-destructive">{validationErrors.quantity}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">لینک تصویر</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => handleInputChange("image", e.target.value)}
          placeholder="https://example.com/image.jpg"
          type="url"
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">
          آدرس URL تصویر محصول را وارد کنید
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">
          توضیحات <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="توضیحات کامل محصول..."
          rows={5}
          className={validationErrors.description ? "border-destructive" : ""}
          disabled={loading}
        />
        {validationErrors.description && (
          <p className="text-sm text-destructive">{validationErrors.description}</p>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div className="space-y-0.5">
            <Label htmlFor="isActive" className="font-semibold cursor-pointer">
              وضعیت فعال
            </Label>
            <p className="text-xs text-muted-foreground">
              محصول در فروشگاه نمایش داده شود
            </p>
          </div>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            disabled={loading}
          />
        </div>
        
        <div className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div className="space-y-0.5">
            <Label htmlFor="isFeatured" className="font-semibold cursor-pointer">
              محصول ویژه
            </Label>
            <p className="text-xs text-muted-foreground">
              نمایش در بخش محصولات ویژه
            </p>
          </div>
          <Switch
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          انصراف
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "ویرایش محصول" : "ایجاد محصول"}
        </Button>
      </div>
    </form>
  )
}