import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { PatientListPage } from '@/components/patient/PatientListPage'

export default async function ReceptionistPatientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, patientsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('patients').select('*').order('created_at', { ascending: false }),
  ])
  if (!profileRes.data) redirect('/login')

  return (
    <DashboardShell profile={profileRes.data}>
      <PatientListPage patients={patientsRes.data ?? []} basePath="/dashboard/receptionist/patients" />
    </DashboardShell>
  )
}
