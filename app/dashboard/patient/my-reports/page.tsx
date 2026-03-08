import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { MyLabReports } from '@/components/patient/MyLabReports'

export default async function MyReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, patientRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('patients').select('*').eq('profile_id', user.id).single(),
  ])
  if (!profileRes.data) redirect('/login')

  const { data: reports } = patientRes.data
    ? await supabase
        .from('lab_reports')
        .select('*')
        .eq('patient_id', patientRes.data.id)
        .order('uploaded_at', { ascending: false })
    : { data: [] }

  return (
    <DashboardShell profile={profileRes.data}>
      <MyLabReports reports={reports ?? []} />
    </DashboardShell>
  )
}
