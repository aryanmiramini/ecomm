"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import { apiEndpoints } from "@/lib/api"
import { Plus, Edit, Trash2, Loader2, Package } from "lucide-react"

export default function AdminProductsPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/")
      return
    }

    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await apiEndpoints.getProducts({ page, limit: 20 })
        setProducts(response.data.data || response.data || [])
        setTotal(response.data.total || 0)
      } catch (error: any) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [user, router, page])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    try {
      await apiEndpoints.deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete product")
    }
  }

  if (!user || user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent">
            Manage Products
          </h1>
          <p className="text-gray-600">Add, edit, or delete products</p>
        </div>
        <button
          onClick={() => router.push("/admin/products/new")}
          className="px-6 py-3 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={48} className="text-[rgb(159,31,92)] animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No products found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.sku || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {product.price?.toLocaleString()} {t("currency") || "Toman"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          (product.quantity || 0) > 0 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {product.quantity || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/products/${product.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {total > 20 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-6 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <span className="px-6 py-2">
                {page} / {Math.ceil(total / 20)}
              </span>
              <button
                disabled={page >= Math.ceil(total / 20)}
                onClick={() => setPage(page + 1)}
                className="px-6 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

