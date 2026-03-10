import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function BillingInsurancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'billing') redirect('/login')

  const claims = [
    { id: 'CLM-001', patient: 'Ahmed Khan', provider: 'Star Health', amount: 8500, submitted: '09 Mar 2026', status: 'submitted', claimId: 'SH2026-4521' },
    { id: 'CLM-002', patient: 'Sita Devi', provider: 'HDFC Ergo', amount: 12400, submitted: '08 Mar 2026', status: 'under_review', claimId: 'HE2026-3312' },
    { id: 'CLM-003', patient: 'Raj Kumar', provider: 'New India', amount: 5600, submitted: '07 Mar 2026', status: 'approved', claimId: 'NI2026-7891' },
  ]

  const STATUS_COLORS: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-700',
    under_review: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
  }

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Insurance Claims</h1>
        <div className="space-y-4">
          {claims.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-sm font-bold text-rose-700">{c.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800">{c.patient}</p>
                  <p className="text-sm text-slate-500">Provider: {c.provider} · Claim ID: {c.claimId}</p>
                  <p className="text-xs text-slate-400 mt-1">Submitted: {c.submitted}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">₹{c.amount.toLocaleString()}</p>
                  <div className="flex gap-2 mt-2">
                    <button className="px-3 py-1.5 text-xs bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">View Docs</button>
                    {c.status === 'approved' && (
                      <button className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Settle</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
