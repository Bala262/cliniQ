import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { PharmacyDashboardContent } from '@/components/pharmacy/PharmacyDashboardContent'

export default async function PharmacyDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'pharmacy') redirect('/login')
  return <DashboardShell profile={profile} alertCount={3}><PharmacyDashboardContent /></DashboardShell>
}
