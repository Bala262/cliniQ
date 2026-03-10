import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { NurseDashboardContent } from '@/components/nurse/NurseDashboardContent'

export default async function NurseDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'nurse') redirect('/login')

  return (
    <DashboardShell profile={profile} alertCount={1}>
      <NurseDashboardContent />
    </DashboardShell>
  )
}
