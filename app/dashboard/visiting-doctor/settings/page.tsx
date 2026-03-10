import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SettingsPage } from '@/components/settings/SettingsPage'

export default async function VisitingDoctorSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'visiting_doctor') redirect('/login')
  return <DashboardShell profile={profile}><SettingsPage profile={profile} /></DashboardShell>
}
