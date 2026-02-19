import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { TestsAdmin } from '@/components/admin/TestsAdmin'

export default async function AdminTestsPage() {
  const user = await getSession()
  if (!user) redirect('/admin')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Тесты</h1>
      <TestsAdmin />
    </div>
  )
}
