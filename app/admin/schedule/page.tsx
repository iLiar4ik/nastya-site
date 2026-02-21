import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { ScheduleAdmin } from '@/components/admin/ScheduleAdmin'

export default async function AdminSchedulePage() {
  const user = await getSession()
  if (!user) redirect('/admin')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Расписание</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Сначала настройте <a href="#schedule-template" className="text-primary underline">шаблон недели</a>, затем редактируйте конкретную неделю ниже.
      </p>
      <ScheduleAdmin />
    </div>
  )
}
