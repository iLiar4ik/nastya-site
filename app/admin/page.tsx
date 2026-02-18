import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminLogin } from '@/components/admin/AdminLogin'

export default async function AdminPage() {
  const user = await getSession()
  if (user) redirect('/admin/dashboard')
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Вход в админку</h1>
        <AdminLogin />
      </div>
    </div>
  )
}
