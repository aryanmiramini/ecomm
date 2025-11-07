import { redirect } from 'next/navigation'

export default function EnglishPage() {
  // Redirect to home page - locale is handled by the layout
  redirect('/')
}

