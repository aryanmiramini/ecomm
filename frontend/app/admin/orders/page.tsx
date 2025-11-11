"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import { apiEndpoints } from "@/lib/api"
import { Edit, Loader2, ShoppingCart } from "lucide-react"

export default function AdminOrdersPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/")
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await apiEndpoints.getAllOrders({ 
          page, 
          limit: 20,
          status: statusFilter || undefined
        })
        setOrders(response.data.data || response.data || [])
        setTotal(response.data.total || 0)
      } catch (error: any) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, router, page, statusFilter])

  const getStatusColor = (status: string) => {
    const colors: any = {
      PENDING: "bg-yellow-100 text-yellow-700",
      PROCESSING: "bg-blue-100 text-blue-700",
      PAID: "bg-green-100 text-green-700",
      SHIPPED: "bg-purple-100 text-purple-700",
      DELIVERED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  if (!user || user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent">
          Manage Orders
        </h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          aria-label="Filter orders by status"
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[rgb(159,31,92)]"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="PAID">Paid</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={48} className="text-[rgb(159,31,92)] animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Order ID</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Total</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-gray-600">
                        {order.id?.substring(0, 8) || "N/A"}...
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {order.user?.firstName || ""} {order.user?.lastName || ""}
                        </p>
                        <p className="text-sm text-gray-500">{order.user?.email || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {order.total?.toLocaleString() || "0"} {t("currency") || "Toman"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status || "")}`}>
                          {order.status || "UNKNOWN"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          aria-label="Edit order"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit size={18} />
                        </button>
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

