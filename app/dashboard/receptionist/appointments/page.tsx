import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { AppointmentManager } from '@/components/appointment/AppointmentManager'

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('patients').select('id, full_name, phone').order('full_name'),
    supabase.from('profiles').select('id, full_name').eq('role', 'doctor').order('full_name'),
    supabase
      .from('appointments')
      .select('*, patient:patients(full_name, phone), doctor:profiles(full_name)')
      .order('date', { ascending: false })
      .order('time_slot', { ascending: true })
      .limit(50),
  ])

  if (!profileRes.data) redirect('/login')

  return (
    <DashboardShell profile={profileRes.data}>
      <AppointmentManager
        patients={patientsRes.data ?? []}
        doctors={doctorsRes.data ?? []}
        appointments={appointmentsRes.data ?? []}
      />
    </DashboardShell>
  )
}
