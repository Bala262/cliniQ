import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { MyAppointments } from '@/components/patient/MyAppointments'

export default async function MyAppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, patientRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('patients').select('*').eq('profile_id', user.id).single(),
  ])
  if (!profileRes.data) redirect('/login')

  const { data: appointments } = patientRes.data
    ? await supabase
        .from('appointments')
        .select('*, doctor:profiles(full_name, specialization)')
        .eq('patient_id', patientRes.data.id)
        .order('date', { ascending: false })
    : { data: [] }

  return (
    <DashboardShell profile={profileRes.data}>
      <MyAppointments appointments={appointments ?? []} />
    </DashboardShell>
  )
}
