import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function NurseLabSamplesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'nurse') redirect('/login')
  return (
    <DashboardShell profile={profile}>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Lab Samples</h1>
        <p className="text-slate-500">Collect and track lab samples for doctor-ordered tests.</p>
        <div className="grid grid-cols-1 gap-4">
          {[
            { patient: 'Ravi Kumar', test: 'CBC', doctor: 'Dr. Kumar', priority: 'High', collected: false },
            { patient: 'Meena Lakshmi', test: 'Blood Sugar (FBS)', doctor: 'Dr. Priya', priority: 'Normal', collected: true },
            { patient: 'Sita Devi', test: 'Chest X-Ray', doctor: 'Dr. Kumar', priority: 'Urgent', collected: false },
          ].map((s, i) => (
            <div key={i} className={`p-4 rounded-xl border ${s.priority === 'Urgent' ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'} shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{s.patient} — <span className="text-purple-700">{s.test}</span></p>
                  <p className="text-sm text-slate-500">Ordered by {s.doctor} · Priority: <span className={s.priority === 'Urgent' ? 'text-red-600 font-medium' : 'text-slate-600'}>{s.priority}</span></p>
                </div>
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${s.collected ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                >
                  {s.collected ? '✓ Collected' : 'Mark Collected'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
