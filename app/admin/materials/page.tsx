import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { MaterialsAdmin } from '@/components/admin/MaterialsAdmin'

export default async function AdminMaterialsPage() {
  const user = await getSession()
  if (!user) redirect('/admin')
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Материалы</h1>
      <MaterialsAdmin />
    </div>
  )
}
