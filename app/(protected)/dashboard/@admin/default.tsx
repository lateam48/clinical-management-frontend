import { redirect } from 'next/navigation'

export default function AdminDefault() {
  // Rediriger vers le dashboard principal pour l'admin
  redirect('/dashboard')
} 