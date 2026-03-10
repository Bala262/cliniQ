import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function BillingPaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'billing') redirect('/login')

  const payments = [
    { id: 'INV-2598', patient: 'Ravi Kumar', total: 2340, mode: 'UPI', time: '09:30 AM', status: 'paid' },
    { id: 'INV-2599', patient: 'Suresh Iyer', total: 680, mode: 'Cash', time: '09:00 AM', status: 'paid' },
    { id: 'INV-2600', patient: 'Ahmed Khan', total: 8500, mode: 'Card', time: '08:30 AM', status: 'paid' },
    { id: 'INV-2601', patient: 'Priya Devi', total: 1570, mode: null, time: '10:15 AM', status: 'pending' },
    { id: 'INV-2602', patient: 'Rajan Mehta', total: 3880, mode: null, time: '10:30 AM', status: 'pending' },
  ]

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Payments</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-xs text-emerald-600 font-medium mb-1">Total Collected</p>
            <p className="text-2xl font-bold text-emerald-700">₹24,850</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-xs text-amber-600 font-medium mb-1">Pending Collection</p>
            <p className="text-2xl font-bold text-amber-700">₹5,450</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-xs text-blue-600 font-medium mb-1">Total Invoices</p>
            <p className="text-2xl font-bold text-blue-700">22</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                {['Invoice', 'Patient', 'Amount', 'Mode', 'Time', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-rose-700">{p.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{p.patient}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">₹{p.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {p.mode ? (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.mode === 'UPI' ? 'bg-purple-100 text-purple-700' : p.mode === 'Card' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {p.mode}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{p.time}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === 'paid' ? (
                      <button className="text-xs text-blue-600 underline">Print Receipt</button>
                    ) : (
                      <a href="/dashboard/billing/generate" className="text-xs bg-rose-600 text-white px-3 py-1 rounded-lg hover:bg-rose-700">Collect</a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  )
}
