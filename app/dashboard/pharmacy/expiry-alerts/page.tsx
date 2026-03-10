import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function PharmacyExpiryAlertsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'pharmacy') redirect('/login')

  const expiringItems = [
    { name: 'Amoxicillin 500mg', stock: 12, expiry: 'Mar 2026', daysLeft: 20, supplier: 'Cipla' },
    { name: 'Aspirin 75mg', stock: 8, expiry: 'Mar 2026', daysLeft: 25, supplier: 'Bayer' },
    { name: 'Glipizide 5mg', stock: 30, expiry: 'Apr 2026', daysLeft: 52, supplier: 'Pfizer' },
  ]

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Expiry Alerts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Medicines expiring within the next 3 months</p>
        </div>
        <div className="space-y-4">
          {expiringItems.map((item, i) => (
            <div key={i} className={`p-5 rounded-xl border-2 ${item.daysLeft < 30 ? 'bg-red-50 border-red-300' : 'bg-amber-50 border-amber-300'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">Stock: <span className="font-semibold">{item.stock} units</span> · Supplier: {item.supplier}</p>
                  <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${item.daysLeft < 30 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    ⚠ Expires: {item.expiry} ({item.daysLeft} days left)
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50">Mark for Return</button>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Reorder</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
