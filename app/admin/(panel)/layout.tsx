import { redirect } from 'next/navigation'
import { isAdminAuthed } from '@/lib/adminAuth'
import AdminNav from '@/components/admin/AdminNav'

export const dynamic = 'force-dynamic'

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdminAuthed()
  if (!authed) redirect('/admin/login')

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 80px' }}>
      <AdminNav />
      <main>{children}</main>
    </div>
  )
}
