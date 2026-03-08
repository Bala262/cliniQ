import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { AlertsPage } from '@/components/alerts/AlertsPage'

export default async function AdminAlertsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const { data: alerts } = await supabase
    .from('ai_alerts')
    .select('*, patient:patients(full_name, patient_code, age)')
    .order('created_at', { ascending: false })

  return (
    <DashboardShell profile={profile} alertCount={alerts?.filter(a => !a.is_resolved).length}>
      <AlertsPage alerts={alerts ?? []} />
    </DashboardShell>
  )
}
