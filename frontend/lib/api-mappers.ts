import type { Product, Category, Order, OrderItem } from "@/lib/types"

const placeholderImage = "/placeholder.svg"

export function mapProduct(product: any): Product {
  const price = Number(product.originalPrice ?? product.price ?? 0)
  const discountPrice =
    product.originalPrice && product.price ? Number(product.price) : product.discountPercentage
      ? Number(product.price)
      : undefined

  return {
    id: product.id,
    name: product.name,
    nameFa: product.name,
    description: product.description,
    descriptionFa: product.description,
    price: price || Number(product.price ?? 0),
    discountPrice,
    image: product.images?.[0] || placeholderImage,
    images: product.images || [],
    category: product.category?.name,
    categoryFa: product.category?.name,
    stock: product.quantity ?? 0,
    featured: product.isFeatured ?? false,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

export function mapCategory(category: any): Category {
  return {
    id: category.id,
    name: category.name,
    nameFa: category.name,
    description: category.description || "",
    descriptionFa: category.description || "",
    image: category.image || placeholderImage,
    productCount: category.products?.length ?? 0,
  }
}

const statusMap: Record<string, string> = {
  PENDING: "pending",
  PROCESSING: "processing",
  CONFIRMED: "processing",
  PAID: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "cancelled",
  REFUNDED: "cancelled",
}

function mapOrderItems(items: any[] = []): OrderItem[] {
  return items.map((item) => ({
    productId: item.productId,
    productName: item.product?.name || "محصول",
    productNameFa: item.product?.name || "محصول",
    quantity: item.quantity ?? 0,
    price: Number(item.total ?? item.subtotal ?? item.price ?? 0),
    image: item.product?.images?.[0] || placeholderImage,
  }))
}

export function mapOrder(order: any): Order {
  const user = order.user || {}
  const statusKey = order.status || "PENDING"

  return {
    id: order.id,
    customerName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "مشتری",
    customerEmail: user.email,
    customerPhone: user.phone,
    address: order.shippingAddress || user.shippingAddress || "",
    city: user.city || "",
    postalCode: user.postalCode || "",
    items: mapOrderItems(order.items),
    totalAmount: Number(order.total || 0),
    status: (statusMap[statusKey] || "pending") as Order["status"],
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString(),
  }
}

