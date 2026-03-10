import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function LabSampleProcessingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'lab') redirect('/login')
  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sample Processing</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track sample collection and processing pipeline</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { stage: 'Sample Collection', count: 3, color: 'bg-blue-50 border-blue-200 text-blue-700', items: ['Ravi Kumar — CBC', 'Sita Devi — Sputum', 'Priya Devi — Blood Sugar'] },
            { stage: 'Processing / Analysis', count: 2, color: 'bg-amber-50 border-amber-200 text-amber-700', items: ['Ahmed Khan — X-Ray', 'Kavitha Nair — Thyroid'] },
            { stage: 'Ready for Report', count: 2, color: 'bg-emerald-50 border-emerald-200 text-emerald-700', items: ['Raj Kumar — Urine Routine', 'Suresh Iyer — Lipid Profile'] },
          ].map((stage) => (
            <div key={stage.stage} className={`rounded-xl border-2 p-5 ${stage.color}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">{stage.stage}</h3>
                <span className="text-2xl font-bold">{stage.count}</span>
              </div>
              <div className="space-y-2">
                {stage.items.map((item, i) => (
                  <div key={i} className="bg-white/70 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 border border-white/50">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
