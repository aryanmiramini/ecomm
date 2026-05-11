"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingCart, Star, Heart, Share2, Truck, Shield, 
  RotateCcw, ChevronLeft, Minus, Plus, Check,
  MessageSquare, Package
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useCart } from "@/components/cart/cart-provider"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

interface Review {
  id: string
  rating: number
  comment: string
  user: { firstName?: string; lastName?: string }
  createdAt: string
}

function ProductImageGallery({ images, name }: { images: string[]; name: string }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const displayImages = images.length > 0 ? images : ["/placeholder.svg"]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
        <img
          src={displayImages[selectedImage]}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Thumbnail Gallery */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === i 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all">
        <div className="aspect-square overflow-hidden bg-muted">
          <img 
            src={product.image || "/placeholder.svg"} 
            alt={product.nameFa} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <CardContent className="p-3">
          <p className="font-medium text-sm line-clamp-1">{product.nameFa}</p>
          <p className="text-primary font-bold mt-1">
            {(product.discountPrice || product.price).toLocaleString('fa-IR')} تومان
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [inWishlist, setInWishlist] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const productRes = await apiClient.getProduct(params.id as string)
        setProduct(productRes.product)
        
        // Load related products
        const relatedRes = await apiClient.getProducts({ 
          categoryId: productRes.product.categoryId, 
          limit: 5 
        })
        setRelatedProducts(relatedRes.products.filter(p => p.id !== params.id).slice(0, 4))

        // Load reviews
        try {
          const reviewsRes = await apiClient.getProductReviews(params.id as string)
          setReviews(reviewsRes.reviews || [])
        } catch {
          setReviews([])
        }

        // Check wishlist status
        if (user) {
          try {
            const wishlistRes = await apiClient.checkWishlist(params.id as string)
            setInWishlist(wishlistRes.inWishlist)
          } catch {
            setInWishlist(false)
          }
        }
      } catch (error) {
        toast.error("خطا در بارگیری محصول")
        router.push("/products")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params.id, user])

  const handleAddToCart = async () => {
    if (!product) return
    setAdding(true)
    try {
      // Pass product data for guest cart functionality
      await addItem(product.id, quantity, {
        nameFa: product.nameFa,
        image: product.image || "/placeholder.svg",
        price: product.discountPrice || product.price,
      })
      toast.success(`${quantity} عدد به سبد خرید افزوده شد`)
    } catch (error: any) {
      toast.error(error.message || "خطا در افزودن به سبد")
    } finally {
      setAdding(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!product) return
    if (!user) {
      toast.error("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید")
      return
    }
    try {
      if (inWishlist) {
        await apiClient.removeFromWishlist(product.id)
        setInWishlist(false)
        toast.success("از علاقه‌مندی‌ها حذف شد")
      } else {
        await apiClient.addToWishlist(product.id)
        setInWishlist(true)
        toast.success("به علاقه‌مندی‌ها افزوده شد")
      }
    } catch (error: any) {
      toast.error(error.message || "خطا در عملیات")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">محصول یافت نشد</h1>
        <p className="text-muted-foreground mb-6">این محصول موجود نیست یا حذف شده است</p>
        <Button asChild>
          <Link href="/products">بازگشت به محصولات</Link>
        </Button>
      </div>
    )
  }

  const displayPrice = product.discountPrice || product.price
  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <ChevronLeft className="h-4 w-4" />
        <Link href="/products" className="hover:text-primary">محصولات</Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-foreground">{product.nameFa}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <ProductImageGallery 
          images={product.images?.length ? product.images : (product.image ? [product.image] : [])} 
          name={product.nameFa} 
        />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Category */}
          <div>
            <Badge variant="secondary" className="mb-2">{product.categoryFa}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{product.nameFa}</h1>
            {product.sku && (
              <p className="text-sm text-muted-foreground mt-1">کد محصول: {product.sku}</p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.round(product.rating || 0) 
                    ? "fill-amber-400 text-amber-400" 
                    : "text-muted-foreground/30"}`} 
                />
              ))}
              <span className="font-medium mr-2">{(product.rating || 0).toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount || 0} نظر)
            </span>
          </div>

          {/* Price */}
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {displayPrice.toLocaleString('fa-IR')}
              </span>
              <span className="text-lg text-muted-foreground">تومان</span>
            </div>
            {hasDiscount && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg text-muted-foreground line-through">
                  {product.price.toLocaleString('fa-IR')} تومان
                </span>
                <Badge variant="destructive">{discountPercent}% تخفیف</Badge>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-600 font-medium">موجود در انبار</span>
                <span className="text-sm text-muted-foreground">({product.stock} عدد)</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-600 font-medium">ناموجود</span>
              </>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border rounded-lg">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              onClick={handleAddToCart} 
              disabled={adding || product.stock === 0} 
              className="flex-1 gap-2 h-12"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5" />
              {adding ? "در حال افزودن..." : "افزودن به سبد خرید"}
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12"
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">ارسال سریع</p>
                <p className="text-xs text-muted-foreground">۲ تا ۵ روز کاری</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">ضمانت اصالت</p>
                <p className="text-xs text-muted-foreground">کالای ۱۰۰٪ اصل</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">۷ روز بازگشت</p>
                <p className="text-xs text-muted-foreground">بازگشت آسان کالا</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">پرداخت امن</p>
                <p className="text-xs text-muted-foreground">درگاه مطمئن</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
          <TabsTrigger 
            value="description" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            توضیحات محصول
          </TabsTrigger>
          <TabsTrigger 
            value="specifications" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            مشخصات فنی
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            نظرات ({reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.descriptionFa || product.description || "توضیحات محصول در دسترس نیست."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="grid gap-4">
                {[
                  { label: "دسته‌بندی", value: product.categoryFa },
                  { label: "کد محصول", value: product.sku },
                  { label: "موجودی", value: `${product.stock} عدد` },
                  { label: "وضعیت", value: product.isActive ? "فعال" : "غیرفعال" },
                ].map((spec, i) => (
                  <div key={i} className="flex py-3 border-b last:border-0">
                    <span className="w-1/3 text-muted-foreground">{spec.label}</span>
                    <span className="w-2/3 font-medium">{spec.value || "-"}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {review.user?.firstName?.[0] || "ک"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {review.user?.firstName} {review.user?.lastName}
                            </p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < review.rating 
                                    ? "fill-amber-400 text-amber-400" 
                                    : "text-muted-foreground/30"}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">هنوز نظری ثبت نشده است</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    اولین نفری باشید که نظر می‌دهد
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">محصولات مرتبط</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <RelatedProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
