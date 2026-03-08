import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { BillingManager } from '@/components/billing/BillingManager'

export default async function AdminBillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, billingRes, patientsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('billing').select('*, patient:patients(full_name, patient_code, phone)').order('created_at', { ascending: false }).limit(200),
    supabase.from('patients').select('id, full_name, patient_code').order('full_name'),
  ])
  if (!profileRes.data) redirect('/login')

  return (
    <DashboardShell profile={profileRes.data}>
      <BillingManager bills={billingRes.data ?? []} patients={patientsRes.data ?? []} />
    </DashboardShell>
  )
}
