import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { LabTestOrders } from '@/components/lab/LabTestOrders'

export default async function DoctorLabOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || !['doctor', 'visiting_doctor'].includes(profile.role)) redirect('/login')
  return <DashboardShell profile={profile}><LabTestOrders /></DashboardShell>
}
