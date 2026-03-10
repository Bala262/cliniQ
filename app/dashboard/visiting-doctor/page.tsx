import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { SimpleAnalytics } from '@/components/analytics/SimpleAnalytics'

export default async function VisitingDoctorDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'visiting_doctor') redirect('/login')
  return (
    <DashboardShell profile={profile} alertCount={0}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome, Dr. {profile.full_name.split(' ')[1] ?? profile.full_name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">Visiting Doctor Dashboard — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Patients Today', value: '8', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
            { label: 'Consultations Done', value: '5', color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { label: 'Prescriptions Issued', value: '5', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-5 ${s.color}`}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <p className="text-indigo-700 font-medium">Your next scheduled visit: Friday, March 14, 2026 — 10:00 AM to 1:00 PM</p>
        </div>
      </div>
    </DashboardShell>
  )
}
