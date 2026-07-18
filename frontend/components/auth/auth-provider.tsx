"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import type { UserProfile } from "@/lib/types"
import { sanitizeRedirectPath } from "@/lib/auth-server"

type AuthContextType = {
  user: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: (options?: { redirectTo?: string }) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshProfile = async () => {
    try {
      const { profile } = await apiClient.getProfile()
      setUser(profile)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refreshProfile()
  }, [])

  const login = async () => {
    setLoading(true)
    await refreshProfile()
  }

  const logout = async (options?: { redirectTo?: string }) => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setLoading(false)
      router.push(options?.redirectTo || "/")
      router.refresh()
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

export function useSafeRedirect(redirectUrl: string | null) {
  return sanitizeRedirectPath(redirectUrl)
}
