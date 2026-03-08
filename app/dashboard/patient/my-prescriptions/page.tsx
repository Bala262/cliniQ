import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { MyPrescriptions } from '@/components/patient/MyPrescriptions'

export default async function MyPrescriptionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, patientRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('patients').select('*').eq('profile_id', user.id).single(),
  ])
  if (!profileRes.data) redirect('/login')

  const { data: prescriptions } = patientRes.data
    ? await supabase
        .from('prescriptions')
        .select('*, doctor:profiles(full_name, specialization), consultation:consultations(final_diagnosis)')
        .eq('patient_id', patientRes.data.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <DashboardShell profile={profileRes.data}>
      <MyPrescriptions prescriptions={prescriptions ?? []} />
    </DashboardShell>
  )
}
