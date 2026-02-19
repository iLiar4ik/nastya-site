import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { StudentProfile } from '@/components/admin/StudentProfile'

export default async function AdminStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) redirect('/admin')
  const { id } = await params
  return <StudentProfile studentId={parseInt(id, 10)} />
}
