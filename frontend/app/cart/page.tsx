"use client"

import { useI18n } from "@/i18n/provider"
import { useCartStore } from "@/store/cart"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { t } = useI18n()
  const { items, total, removeItem, updateQuantity, clear } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
        <h1 className="text-3xl font-bold mb-4">{t("emptyCart") || "Your cart is empty"}</h1>
        <p className="text-gray-600 mb-8">
          {t("emptyCartMessage") || "Start shopping to add items to your cart"}
        </p>
        <Link
          href="/products"
          className="inline-block px-8 py-3 bg-[rgb(159,31,92)] text-white rounded-lg font-semibold hover:bg-[rgb(133,30,90)] transition"
        >
          {t("continueShopping") || "Continue Shopping"}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{t("cart") || "Shopping Cart"}</h1>
        <button
          onClick={clear}
          className="text-red-500 hover:text-red-700 transition flex items-center gap-2"
        >
          <Trash2 size={20} />
          {t("clearCart") || "Clear Cart"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-6 glass flex gap-4">
              <img
                src={item.product?.images?.[0] || "/placeholder.svg"}
                alt={item.product?.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{item.product?.name}</h3>
                <p className="text-[rgb(159,31,92)] font-bold mb-3">
                  {item.price.toLocaleString()} {t("currency") || "Toman"}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-semibold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 glass sticky top-24">
            <h2 className="text-2xl font-bold mb-6">{t("orderSummary") || "Order Summary"}</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">{t("subtotal") || "Subtotal"}:</span>
                <span className="font-semibold">{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("shipping") || "Shipping"}:</span>
                <span className="font-semibold text-green-600">{t("free") || "Free"}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>{t("total") || "Total"}:</span>
                <span className="text-[rgb(159,31,92)]">{total.toLocaleString()}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="w-full block text-center px-6 py-3 bg-[rgb(159,31,92)] text-white rounded-lg font-semibold hover:bg-[rgb(133,30,90)] transition"
            >
              {t("proceedToCheckout") || "Proceed to Checkout"}
            </Link>
            <Link
              href="/products"
              className="w-full block text-center px-6 py-3 mt-3 border border-[rgb(159,31,92)] text-[rgb(159,31,92)] rounded-lg font-semibold hover:bg-[rgb(159,31,92)]/10 transition"
            >
              {t("continueShopping") || "Continue Shopping"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

