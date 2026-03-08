import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { BillingManager } from '@/components/billing/BillingManager'

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const [billingRes, patientsRes] = await Promise.all([
    supabase
      .from('billing')
      .select('*, patient:patients(full_name, patient_code, phone)')
      .order('created_at', { ascending: false })
      .limit(100),
    supabase.from('patients').select('id, full_name, patient_code').order('full_name'),
  ])

  return (
    <DashboardShell profile={profile}>
      <BillingManager bills={billingRes.data ?? []} patients={patientsRes.data ?? []} />
    </DashboardShell>
  )
}
