import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function PharmacyDispensePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'pharmacy') redirect('/login')
  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Dispense Medicines</h1>
        <p className="text-slate-500">Select a prescription from the queue to dispense medicines.</p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
          <p className="text-emerald-700 font-medium">Open a prescription from <a href="/dashboard/pharmacy/prescriptions" className="underline">Prescription Queue</a> to begin dispensing.</p>
        </div>
      </div>
    </DashboardShell>
  )
}
