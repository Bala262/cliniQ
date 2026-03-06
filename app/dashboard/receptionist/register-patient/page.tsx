import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { PatientRegistrationForm } from '@/components/patient/PatientRegistrationForm'

export default async function RegisterPatientPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  // Get next patient code
  const { count } = await supabase.from('patients').select('id', { count: 'exact', head: true })

  return (
    <DashboardShell profile={profile}>
      <PatientRegistrationForm nextIndex={(count ?? 0) + 1} />
    </DashboardShell>
  )
}
