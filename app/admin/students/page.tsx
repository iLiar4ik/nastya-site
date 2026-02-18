import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { StudentsAdmin } from '@/components/admin/StudentsAdmin'

export default async function AdminStudentsPage() {
  const user = await getSession()
  if (!user) redirect('/admin')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ученики</h1>
      <StudentsAdmin />
    </div>
  )
}
