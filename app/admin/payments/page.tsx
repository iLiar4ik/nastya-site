import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { PaymentsAdmin } from '@/components/admin/PaymentsAdmin'

export default async function AdminPaymentsPage() {
  const user = await getSession()
  if (!user) redirect('/admin')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Платежи</h1>
      <PaymentsAdmin />
    </div>
  )
}
