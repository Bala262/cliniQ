import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { AdminDashboardContent } from '@/components/dashboard/AdminDashboardContent'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const [patientsRes, appointmentsRes, billingRes, usersRes, alertsRes] = await Promise.all([
    supabase.from('patients').select('id, created_at, risk_level'),
    supabase.from('appointments').select('id, date, status, consultation_type').gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    supabase.from('billing').select('total, payment_status, created_at').gte('created_at', `${today}T00:00:00`),
    supabase.from('profiles').select('id, full_name, role, created_at'),
    supabase.from('ai_alerts').select('*').eq('is_resolved', false).limit(5),
  ])

  const todayAppointments = appointmentsRes.data?.filter(a => a.date === today) ?? []
  const totalRevenue = billingRes.data?.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.total ?? 0), 0) ?? 0
  const pendingRevenue = billingRes.data?.filter(b => b.payment_status === 'pending').reduce((sum, b) => sum + (b.total ?? 0), 0) ?? 0

  return (
    <DashboardShell profile={profile} alertCount={alertsRes.data?.length}>
      <AdminDashboardContent
        totalPatients={patientsRes.data?.length ?? 0}
        todayAppointments={todayAppointments.length}
        todayRevenue={totalRevenue}
        pendingRevenue={pendingRevenue}
        totalUsers={usersRes.data?.length ?? 0}
        recentAlerts={alertsRes.data ?? []}
        appointmentTrend={appointmentsRes.data ?? []}
        allUsers={usersRes.data ?? []}
      />
    </DashboardShell>
  )
}
