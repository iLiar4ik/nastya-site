import { AdminSidebarClient } from '@/components/admin/AdminSidebarClient'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <AdminSidebarClient />
      <main className="flex-1 p-6 overflow-auto min-w-0">{children}</main>
    </div>
  )
}
