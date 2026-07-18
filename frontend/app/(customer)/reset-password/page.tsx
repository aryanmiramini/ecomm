"use client"

import { Suspense } from "react"
import ResetPasswordForm from "./reset-password-form"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-16 text-center text-muted-foreground">در حال بارگیری...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
