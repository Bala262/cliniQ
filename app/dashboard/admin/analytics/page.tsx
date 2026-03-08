import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { AnalyticsPage } from '@/components/analytics/AnalyticsPage'

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  // Fetch last 30 days of appointments
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [apptRes, consultRes, billingRes, patientRes] = await Promise.all([
    supabase
      .from('appointments')
      .select('date, status, consultation_type')
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('date'),
    supabase
      .from('consultations')
      .select('final_diagnosis, date')
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0]),
    supabase
      .from('billing')
      .select('total, payment_status, payment_mode, created_at')
      .gte('created_at', thirtyDaysAgo.toISOString()),
    supabase
      .from('patients')
      .select('created_at, risk_level'),
  ])

  return (
    <DashboardShell profile={profile}>
      <AnalyticsPage
        appointments={apptRes.data ?? []}
        consultations={consultRes.data ?? []}
        billing={billingRes.data ?? []}
        patients={patientRes.data ?? []}
      />
    </DashboardShell>
  )
}
