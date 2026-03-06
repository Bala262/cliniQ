import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { PatientPortalHome } from '@/components/patient/PatientPortalHome'

export default async function PatientPortalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  // Get the patient record linked to this profile
  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  if (!patient) {
    return (
      <DashboardShell profile={profile}>
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <p className="text-lg font-semibold">Your patient record is being set up.</p>
          <p className="text-sm mt-1">Please contact the reception for assistance.</p>
        </div>
      </DashboardShell>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  const [appointmentsRes, prescriptionsRes, labReportsRes] = await Promise.all([
    supabase
      .from('appointments')
      .select('*, doctor:profiles(full_name, specialization)')
      .eq('patient_id', patient.id)
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(5),
    supabase
      .from('prescriptions')
      .select('*, doctor:profiles(full_name)')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('lab_reports')
      .select('*')
      .eq('patient_id', patient.id)
      .order('uploaded_at', { ascending: false })
      .limit(3),
  ])

  return (
    <DashboardShell profile={profile}>
      <PatientPortalHome
        patient={patient}
        upcomingAppointments={appointmentsRes.data ?? []}
        recentPrescriptions={prescriptionsRes.data ?? []}
        recentReports={labReportsRes.data ?? []}
      />
    </DashboardShell>
  )
}
