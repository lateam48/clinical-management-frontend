import { redirect } from 'next/navigation'

export default function DoctorDefault() {
  // Rediriger vers le dashboard principal pour le docteur
  redirect('/dashboard')
} 