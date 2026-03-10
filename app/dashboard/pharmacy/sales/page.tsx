import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function PharmacySalesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'pharmacy') redirect('/login')

  const sales = [
    { time: '09:15 AM', patient: 'Ravi Kumar', rx: 'RX003', items: 2, amount: '₹420', mode: 'Cash' },
    { time: '09:45 AM', patient: 'Meena Lakshmi', rx: 'RX004', items: 3, amount: '₹680', mode: 'UPI' },
    { time: '10:30 AM', patient: 'Suresh Iyer', rx: 'Counter Sale', items: 1, amount: '₹150', mode: 'Cash' },
  ]

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sales</h1>
            <p className="text-sm text-slate-500">Today's pharmacy sales — March 10, 2026</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-emerald-600">Today's Revenue</p>
              <p className="text-xl font-bold text-emerald-700">₹4,280</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-blue-600">Transactions</p>
              <p className="text-xl font-bold text-blue-700">18</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Time', 'Patient', 'Rx / Type', 'Items', 'Amount', 'Mode'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map((s, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-500">{s.time}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{s.patient}</td>
                  <td className="px-4 py-3 text-sm font-mono text-emerald-700">{s.rx}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{s.items} items</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{s.amount}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${s.mode === 'UPI' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>{s.mode}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  )
}
