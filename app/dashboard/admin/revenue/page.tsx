import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function AdminRevenuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/login')

  const revenueByCategory = [
    { category: 'Consultation Fees', today: 15000, month: 285000, color: 'blue' },
    { category: 'Lab Tests', today: 8500, month: 165000, color: 'amber' },
    { category: 'Pharmacy Sales', today: 4280, month: 89500, color: 'emerald' },
    { category: 'Ward / Bed Charges', today: 3000, month: 95000, color: 'purple' },
    { category: 'Insurance Claims', today: 0, month: 125000, color: 'rose' },
  ]
  const totalToday = revenueByCategory.reduce((s, c) => s + c.today, 0)
  const totalMonth = revenueByCategory.reduce((s, c) => s + c.month, 0)

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Revenue Dashboard</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <p className="text-sm font-medium text-emerald-700">Today's Revenue</p>
            <p className="text-4xl font-bold text-emerald-800 mt-1">₹{totalToday.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 mt-2">↑ 12% vs yesterday</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-sm font-medium text-blue-700">March 2026 Revenue</p>
            <p className="text-4xl font-bold text-blue-800 mt-1">₹{totalMonth.toLocaleString()}</p>
            <p className="text-xs text-blue-600 mt-2">Target: ₹8,00,000</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold text-slate-800">Revenue by Category</h2>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                {['Category', "Today's Revenue", 'Monthly Revenue', '% Share', 'Trend'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {revenueByCategory.map((c, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{c.category}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-700">₹{c.today.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-700">₹{c.month.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-20">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.round((c.month / totalMonth) * 100)}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{Math.round((c.month / totalMonth) * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-emerald-600 font-medium">↑ Trending</td>
                </tr>
              ))}
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td className="px-4 py-3 text-sm font-bold text-slate-800">TOTAL</td>
                <td className="px-4 py-3 text-sm font-bold text-emerald-700">₹{totalToday.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm font-bold text-emerald-700">₹{totalMonth.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs font-semibold text-slate-600">100%</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  )
}
