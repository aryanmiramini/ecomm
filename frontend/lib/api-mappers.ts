import type { Product, Category, Order, OrderItem, CartItem, CartSummary } from "@/lib/types"

const placeholderImage = "/placeholder.svg"

// Backend URL for serving media files
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"

/**
 * Resolves an image URL to a full URL
 * - If it starts with /media, prepend the backend URL
 * - If it's already a full URL (http/https), return as-is
 * - If it's empty or undefined, return placeholder
 */
function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return placeholderImage
  
  // Already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Media URL from our backend
  if (url.startsWith('/media/')) {
    return `${BACKEND_URL}${url}`
  }
  
  // Local public file or placeholder
  if (url.startsWith('/')) {
    return url
  }
  
  return placeholderImage
}

/**
 * Resolves an array of image URLs
 */
function resolveImageUrls(urls: string[] | undefined | null): string[] {
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return []
  }
  return urls.map(resolveImageUrl)
}

export function mapProduct(product: any): Product {
  const price = Number(product.originalPrice ?? product.price ?? 0)
  const discountPrice =
    product.originalPrice && product.price ? Number(product.price) : product.discountPercentage
      ? Number(product.price)
      : undefined

  const images = resolveImageUrls(product.images)
  const mainImage = images[0] || placeholderImage
  
  // Extract categoryId from product.categoryId or product.category.id
  const categoryId = product.categoryId || product.category?.id || ""

  return {
    id: product.id,
    name: product.name,
    nameFa: product.name,
    description: product.description,
    descriptionFa: product.description,
    sku: product.sku,
    quantity: Number(product.quantity ?? 0),
    price: price || Number(product.price ?? 0),
    discountPrice,
    image: mainImage,
    images: images,
    category: product.category?.name,
    categoryFa: product.category?.name,
    categoryId: categoryId,
    stock: product.quantity ?? 0,
    featured: product.isFeatured ?? false,
    isActive: product.isActive ?? true,
    rating: product.rating !== undefined ? Number(product.rating) : undefined,
    reviewCount: product.reviewCount !== undefined ? Number(product.reviewCount) : undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

export function mapCategory(category: any): Category {
  const productCount =
    typeof category?._count?.products === "number"
      ? category._count.products
      : Array.isArray(category?.products)
        ? category.products.length
        : 0

  return {
    id: category.id,
    name: category.name,
    nameFa: category.name,
    description: category.description || "",
    descriptionFa: category.description || "",
    image: resolveImageUrl(category.image),
    productCount,
  }
}

const statusMap: Record<string, string> = {
  PENDING: "pending",
  PROCESSING: "processing",
  CONFIRMED: "confirmed",
  PAID: "paid",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "cancelled",
  REFUNDED: "cancelled",
}

function mapOrderItems(items: any[] = []): OrderItem[] {
  return items.map((item) => {
    const qty = Number(item.quantity ?? 0)
    const unit = Number(item.price ?? 0)
    const lineTotal = Number(item.subtotal ?? item.total ?? unit * qty)
    return {
      productId: item.productId,
      productName: item.product?.name || "محصول",
      productNameFa: item.product?.name || "محصول",
      quantity: qty,
      price: lineTotal,
      image: resolveImageUrl(
        Array.isArray(item.product?.images) && item.product.images.length > 0
          ? item.product.images[0]
          : item.product?.image,
      ),
    }
  })
}

export function mapOrder(order: any): Order {
  const user = order.user || {}
  const statusKey = order.status || "PENDING"
  const shippingName = [order.shippingFirstName, order.shippingLastName].filter(Boolean).join(" ").trim()
  const accountName = `${user.firstName || ""} ${user.lastName || ""}`.trim()

  return {
    id: order.id,
    customerName: shippingName || accountName || user.email || "مشتری",
    customerEmail: order.shippingEmail || user.email || "",
    customerPhone: order.shippingPhone || user.phone || "",
    address: order.shippingAddress || user.shippingAddress || "",
    city: user.city || "",
    postalCode: user.postalCode || "",
    items: mapOrderItems(order.items),
    totalAmount: Number(order.total ?? 0),
    status: (statusMap[statusKey] || "pending") as Order["status"],
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString(),
  }
}

export function mapCart(response: any): CartSummary {
  // Handle nested response formats: 
  // Could be: { success, data: { id, items, ... } } 
  // Or: { cart: {...}, summary: {...} }
  // Or: { id, items, ... } directly
  let cartData = response
  
  // Unwrap nested data if present
  if (response?.data && typeof response.data === 'object') {
    cartData = response.data
  }
  if (cartData?.cart && typeof cartData.cart === 'object') {
    cartData = { ...cartData.cart, ...cartData.summary }
  }
  
  const itemsData = cartData?.items || []

  const items: CartItem[] = Array.isArray(itemsData)
    ? itemsData.map((item: any) => {
        const product = item.product || {}
        const price = Number(product.price ?? item.price ?? 0)
        const quantity = Number(item.quantity ?? 0)
        const subtotal = Number(item.subtotal ?? item.itemTotal ?? price * quantity)
        return {
          id: item.id,
          productId: product.id || item.productId,
          name: product.name || item.name || "محصول",
          nameFa: product.name || item.name || "محصول",
          image: resolveImageUrl(product.images?.[0] || item.image),
          quantity,
          price,
          total: subtotal,
        }
      })
    : []

  // Calculate totals - use cartData values or calculate from items
  const subtotal = Number(cartData?.totalAmount ?? cartData?.subtotal ?? items.reduce((sum, item) => sum + item.total, 0))
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const itemCount = Number(cartData?.itemCount ?? items.length)

  return {
    items,
    subtotal,
    totalQuantity,
    itemCount,
  }
}
