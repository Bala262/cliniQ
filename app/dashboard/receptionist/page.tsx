import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { ReceptionistDashboardContent } from '@/components/dashboard/ReceptionistDashboardContent'

export default async function ReceptionistDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const [appointmentsRes, patientsRes, billingRes] = await Promise.all([
    supabase
      .from('appointments')
      .select('*, patient:patients(*), doctor:profiles(*)')
      .eq('date', today)
      .order('token_number', { ascending: true }),
    supabase
      .from('patients')
      .select('id')
      .gte('created_at', `${today}T00:00:00`),
    supabase
      .from('billing')
      .select('id, payment_status, total')
      .eq('payment_status', 'pending'),
  ])

  const stats = {
    appointments_today: appointmentsRes.data?.length ?? 0,
    new_patients: patientsRes.data?.length ?? 0,
    pending_billing: billingRes.data?.length ?? 0,
    waiting: appointmentsRes.data?.filter(a => a.status === 'waiting').length ?? 0,
  }

  return (
    <DashboardShell profile={profile}>
      <ReceptionistDashboardContent
        profile={profile}
        stats={stats}
        appointments={appointmentsRes.data ?? []}
      />
    </DashboardShell>
  )
}
