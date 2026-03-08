import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { DoctorLabReports } from '@/components/lab/DoctorLabReports'

export default async function DoctorLabReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const [reportsRes, patientsRes] = await Promise.all([
    supabase
      .from('lab_reports')
      .select('*, patient:patients(full_name, patient_code)')
      .order('uploaded_at', { ascending: false })
      .limit(50),
    supabase
      .from('patients')
      .select('id, full_name, patient_code')
      .order('full_name'),
  ])

  return (
    <DashboardShell profile={profile}>
      <DoctorLabReports reports={reportsRes.data ?? []} patients={patientsRes.data ?? []} />
    </DashboardShell>
  )
}
