"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { UserProfile } from "@/lib/types"
import { useRouter, usePathname } from "next/navigation"

type AuthContextType = {
  user: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  login: (token?: string) => Promise<void> // Token is handled via cookies, but we might need to trigger re-fetch
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const refreshProfile = async () => {
    try {
      const { profile } = await apiClient.getProfile()
      setUser(profile)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshProfile()
  }, [])

  const login = async () => {
    await refreshProfile()
  }

  const logout = async () => {
    try {
      await apiClient.logout()
      setUser(null)
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

