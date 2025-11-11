"use client"

import { useI18n } from "@/i18n/provider"
import { useCartStore } from "@/store/cart"
import { useEffect } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const { items, total, removeItem, updateQuantity, clear, isLoading, fetchCart } = useCartStore()

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      router.push("/login")
    }
  }, [user, fetchCart, router])

  if (!user) {
    return null
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader2 size={64} className="mx-auto text-[rgb(159,31,92)] animate-spin mb-6" />
        <p className="text-gray-600">{t("loading") || "Loading..."}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ShoppingBag size={64} className="text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{t("emptyCart") || "Your cart is empty"}</h1>
          <p className="text-gray-600 mb-8 text-lg">
            {t("emptyCartMessage") || "Start shopping to add items to your cart"}
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            {t("continueShopping") || "Continue Shopping"}
          </Link>
        </div>
      </div>
    )
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId)
    } else {
      await updateQuantity(itemId, newQuantity)
    }
  }

  const handleClearCart = async () => {
    if (confirm(t("confirmClearCart") || "Are you sure you want to clear your cart?")) {
      await clear()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent">
          {t("cart") || "Shopping Cart"}
        </h1>
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            disabled={isLoading}
            className="text-red-500 hover:text-red-700 transition flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={20} />
            <span className="font-medium">{t("clearCart") || "Clear Cart"}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row gap-4"
            >
              <img
                src={item.product?.images?.[0] || "/placeholder.svg"}
                alt={item.product?.name || "Product"}
                className="w-full sm:w-32 h-32 object-cover rounded-xl"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{item.product?.name || "Product"}</h3>
                  <p className="text-[rgb(159,31,92)] font-bold text-xl mb-3">
                    {item.price.toLocaleString()} {t("currency") || "Toman"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={isLoading}
                      className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                    >
                      <Minus size={18} className="text-gray-600" />
                    </button>
                    <span className="font-semibold w-8 text-center text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={isLoading}
                      className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                    >
                      <Plus size={18} className="text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={isLoading}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{t("orderSummary") || "Order Summary"}</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>{t("subtotal") || "Subtotal"}:</span>
                <span className="font-semibold">{total.toLocaleString()} {t("currency") || "Toman"}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>{t("shipping") || "Shipping"}:</span>
                <span className="font-semibold text-green-600">{t("free") || "Free"}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                <span className="text-gray-900">{t("total") || "Total"}:</span>
                <span className="text-[rgb(159,31,92)] text-xl">
                  {total.toLocaleString()} {t("currency") || "Toman"}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="w-full block text-center px-6 py-4 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02] mb-3"
            >
              {t("proceedToCheckout") || "Proceed to Checkout"}
            </Link>
            <Link
              href="/products"
              className="w-full block text-center px-6 py-4 border-2 border-[rgb(159,31,92)] text-[rgb(159,31,92)] rounded-xl font-semibold hover:bg-[rgb(159,31,92)]/10 transition-colors"
            >
              {t("continueShopping") || "Continue Shopping"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
