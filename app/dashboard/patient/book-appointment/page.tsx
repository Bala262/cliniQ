import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { PatientBookAppointment } from '@/components/patient/PatientBookAppointment'

export default async function BookAppointmentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, patientRes, doctorsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('patients').select('*').eq('profile_id', user.id).single(),
    supabase.from('profiles').select('id, full_name, specialization').eq('role', 'doctor').order('full_name'),
  ])

  if (!profileRes.data) redirect('/login')

  return (
    <DashboardShell profile={profileRes.data}>
      <PatientBookAppointment
        patient={patientRes.data}
        doctors={doctorsRes.data ?? []}
      />
    </DashboardShell>
  )
}
