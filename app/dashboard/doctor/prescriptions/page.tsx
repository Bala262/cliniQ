import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { DoctorPrescriptionsList } from '@/components/prescription/DoctorPrescriptionsList'

export default async function DoctorPrescriptionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const { data: prescriptions } = await supabase
    .from('prescriptions')
    .select('*, patient:patients(full_name, patient_code, phone), consultation:consultations(final_diagnosis)')
    .eq('doctor_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <DashboardShell profile={profile}>
      <DoctorPrescriptionsList prescriptions={prescriptions ?? []} />
    </DashboardShell>
  )
}
