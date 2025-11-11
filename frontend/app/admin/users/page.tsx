"use client"

import { useI18n } from "@/i18n/provider"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import { apiEndpoints } from "@/lib/api"
import { Trash2, Loader2, Users as UsersIcon } from "lucide-react"

export default function AdminUsersPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/")
      return
    }

    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await apiEndpoints.getAllUsers()
        setUsers(response.data.data || response.data || [])
      } catch (error: any) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user, router])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    
    try {
      await apiEndpoints.deleteUser(id)
      setUsers(users.filter(u => u.id !== id))
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete user")
    }
  }

  if (!user || user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[rgb(159,31,92)] to-[rgb(133,30,90)] bg-clip-text text-transparent">
          Manage Users
        </h1>
        <p className="text-gray-600">View and manage user accounts</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={48} className="text-[rgb(159,31,92)] animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <UsersIcon size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {userItem.firstName} {userItem.lastName}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{userItem.email || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-600">{userItem.phone || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        userItem.role === "ADMIN" 
                          ? "bg-purple-100 text-purple-700" 
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {userItem.id !== user.id && (
                        <button
                          onClick={() => handleDelete(userItem.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

