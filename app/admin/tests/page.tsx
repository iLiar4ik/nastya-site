import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function AdminTestsPage() {
  const user = await getSession()
  if (!user) redirect('/admin')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Тесты</h1>
      <p className="text-muted-foreground">Скоро</p>
    </div>
  )
}
