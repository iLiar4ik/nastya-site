import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { HomeworkAdmin } from '@/components/admin/HomeworkAdmin'

export default async function AdminHomeworkPage() {
  const user = await getSession()
  if (!user) redirect('/admin')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Домашние задания</h1>
      <HomeworkAdmin />
    </div>
  )
}
