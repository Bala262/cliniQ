import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { DoctorAppointments } from '@/components/appointment/DoctorAppointments'

export default async function DoctorAppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, patient:patients(full_name, age, phone, blood_group)')
    .eq('doctor_id', user.id)
    .order('date', { ascending: false })
    .order('time_slot', { ascending: true })
    .limit(100)

  return (
    <DashboardShell profile={profile}>
      <DoctorAppointments appointments={appointments ?? []} />
    </DashboardShell>
  )
}
