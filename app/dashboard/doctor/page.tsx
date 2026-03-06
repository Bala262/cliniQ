import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { DoctorDashboardContent } from '@/components/dashboard/DoctorDashboardContent'

export default async function DoctorDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  // Fetch today's stats
  const today = new Date().toISOString().split('T')[0]

  const [appointmentsRes, alertsRes] = await Promise.all([
    supabase
      .from('appointments')
      .select('*, patient:patients(*)')
      .eq('date', today)
      .eq('doctor_id', user.id)
      .order('token_number', { ascending: true }),
    supabase
      .from('ai_alerts')
      .select('*, patient:patients(*)')
      .eq('is_resolved', false)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const appointments = appointmentsRes.data ?? []
  const alerts = alertsRes.data ?? []

  const stats = {
    total_patients_today: appointments.length,
    waiting_patients: appointments.filter(a => a.status === 'waiting').length,
    completed_consultations: appointments.filter(a => a.status === 'completed').length,
    emergency_alerts: alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length,
    follow_ups_today: appointments.filter(a => a.consultation_type === 'follow-up').length,
  }

  return (
    <DashboardShell profile={profile} alertCount={alerts.length}>
      <DoctorDashboardContent
        profile={profile}
        stats={stats}
        appointments={appointments}
        alerts={alerts}
      />
    </DashboardShell>
  )
}
