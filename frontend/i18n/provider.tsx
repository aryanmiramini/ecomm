"use client"

import { createContext, useContext, type ReactNode } from "react"
import { translations } from "./config"

interface I18nContextType {
  locale: string
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({
  children,
  locale,
}: {
  children: ReactNode
  locale: string
}) {
  const t = (key: string): string => {
    return (translations[locale as keyof typeof translations] as any)?.[key] || key
  }

  return <I18nContext.Provider value={{ locale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}
