import { redirect } from 'next/navigation'

export default function SecretaryDefault() {
  // Rediriger vers le dashboard principal pour le secrétaire
  redirect('/dashboard')
} 