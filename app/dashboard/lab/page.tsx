import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { LabDashboardContent } from '@/components/lab/LabDashboardContent'

export default async function LabDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'lab') redirect('/login')
  return <DashboardShell profile={profile} alertCount={2}><LabDashboardContent /></DashboardShell>
}
