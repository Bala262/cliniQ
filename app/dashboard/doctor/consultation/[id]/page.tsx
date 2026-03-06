import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ConsultationScreen } from '@/components/consultation/ConsultationScreen'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ConsultationPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, appointmentRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('appointments')
      .select('*, patient:patients(*)')
      .eq('id', id)
      .single(),
  ])

  if (!profileRes.data) redirect('/login')
  if (!appointmentRes.data) redirect('/dashboard/doctor')

  // Update appointment status to in-consultation
  await supabase
    .from('appointments')
    .update({ status: 'in-consultation' })
    .eq('id', id)

  // Check for existing consultation
  const { data: existingConsultation } = await supabase
    .from('consultations')
    .select('*')
    .eq('appointment_id', id)
    .single()

  return (
    <DashboardShell profile={profileRes.data}>
      <ConsultationScreen
        appointment={appointmentRes.data}
        doctorProfile={profileRes.data}
        existingConsultation={existingConsultation ?? null}
      />
    </DashboardShell>
  )
}
