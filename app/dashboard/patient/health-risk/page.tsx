import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { HealthRisk } from '@/components/patient/HealthRisk'

export default async function HealthRiskPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, patientRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('patients').select('*').eq('profile_id', user.id).single(),
  ])
  if (!profileRes.data) redirect('/login')

  // Get latest vitals
  const { data: latestVitals } = patientRes.data
    ? await supabase
        .from('vitals')
        .select('*')
        .eq('patient_id', patientRes.data.id)
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single()
    : { data: null }

  return (
    <DashboardShell profile={profileRes.data}>
      <HealthRisk patient={patientRes.data} latestVitals={latestVitals ?? null} />
    </DashboardShell>
  )
}
