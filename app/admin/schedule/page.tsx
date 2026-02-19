import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { ScheduleAdmin } from '@/components/admin/ScheduleAdmin'

export default async function AdminSchedulePage() {
  const user = await getSession()
  if (!user) redirect('/admin')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Расписание</h1>
      <ScheduleAdmin />
    </div>
  )
}
