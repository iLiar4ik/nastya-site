import { StudentLayoutClient } from '@/components/student/StudentLayoutClient'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentLayoutClient>{children}</StudentLayoutClient>
}
