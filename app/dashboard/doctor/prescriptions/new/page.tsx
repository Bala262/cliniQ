import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { PrescriptionGenerator } from '@/components/prescription/PrescriptionGenerator'

interface Props {
  searchParams: Promise<{ appointmentId?: string; patientId?: string; diagnosis?: string }>
}

export default async function NewPrescriptionPage({ searchParams }: Props) {
  const { appointmentId, patientId, diagnosis } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, patientRes, consultationRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('patients').select('*').eq('id', patientId ?? '').single(),
    supabase.from('consultations').select('*').eq('appointment_id', appointmentId ?? '').single(),
  ])

  if (!profileRes.data) redirect('/login')
  if (!patientRes.data) redirect('/dashboard/doctor')

  return (
    <DashboardShell profile={profileRes.data}>
      <PrescriptionGenerator
        doctorProfile={profileRes.data}
        patient={patientRes.data}
        diagnosis={diagnosis ?? ''}
        consultationId={consultationRes.data?.id ?? null}
      />
    </DashboardShell>
  )
}
