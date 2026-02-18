import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminDashboardPage() {
  const user = await getSession()
  if (!user) redirect('/admin')
  return <AdminDashboard />
}
