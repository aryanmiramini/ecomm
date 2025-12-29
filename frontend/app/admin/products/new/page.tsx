"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/admin/product-form"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewProductPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">افزودن محصول جدید</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>مشخصات محصول</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            product={null}
            onSuccess={() => {
              router.push("/admin/products")
            }}
            onCancel={() => {
              router.back()
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}