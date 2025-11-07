import { create } from "zustand"
import Cookies from "js-cookie"

interface AuthStore {
  token: string | null
  user: any | null
  isLoading: boolean
  setAuth: (token: string, user: any) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => {
  const token = typeof window !== "undefined" ? Cookies.get("token") : null
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null

  return {
    token,
    user,
    isLoading: false,
    setAuth: (token: string, user: any) => {
      Cookies.set("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      set({ token, user })
    },
    logout: () => {
      Cookies.remove("token")
      localStorage.removeItem("user")
      set({ token: null, user: null })
    },
    setLoading: (isLoading: boolean) => set({ isLoading }),
  }
})
