import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { PatientProfile } from '@/components/patient/PatientProfile'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PatientProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, patientRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('patients').select('*').eq('id', id).single(),
  ])
  if (!profileRes.data) redirect('/login')
  if (!patientRes.data) notFound()

  const [consultationsRes, prescriptionsRes, vitalsRes, labReportsRes] = await Promise.all([
    supabase
      .from('consultations')
      .select('*, doctor:profiles(full_name)')
      .eq('patient_id', id)
      .order('date', { ascending: false }),
    supabase
      .from('prescriptions')
      .select('*, doctor:profiles(full_name)')
      .eq('patient_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('vitals')
      .select('*')
      .eq('patient_id', id)
      .order('recorded_at', { ascending: false }),
    supabase
      .from('lab_reports')
      .select('*')
      .eq('patient_id', id)
      .order('uploaded_at', { ascending: false }),
  ])

  return (
    <DashboardShell profile={profileRes.data}>
      <PatientProfile
        patient={patientRes.data}
        consultations={consultationsRes.data ?? []}
        prescriptions={prescriptionsRes.data ?? []}
        vitals={vitalsRes.data ?? []}
        labReports={labReportsRes.data ?? []}
        canEdit={profileRes.data.role === 'doctor' || profileRes.data.role === 'receptionist'}
      />
    </DashboardShell>
  )
}
