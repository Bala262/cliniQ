import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function DoctorFollowUpsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || !['doctor', 'visiting_doctor'].includes(profile.role)) redirect('/login')

  const followUps = [
    { patient: 'Suresh Iyer', age: 45, condition: 'Type 2 Diabetes', lastVisit: '10 Feb 2026', nextDue: '10 Mar 2026', status: 'due_today' },
    { patient: 'Meena Lakshmi', age: 28, condition: 'Typhoid (Discharge)', lastVisit: '07 Mar 2026', nextDue: '14 Mar 2026', status: 'upcoming' },
    { patient: 'Kavitha Nair', age: 32, condition: 'Hypothyroidism', lastVisit: '08 Feb 2026', nextDue: '05 Mar 2026', status: 'overdue' },
  ]

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Follow-ups</h1>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Due Today', count: followUps.filter(f => f.status === 'due_today').length, color: 'amber' },
            { label: 'Overdue', count: followUps.filter(f => f.status === 'overdue').length, color: 'red' },
            { label: 'Upcoming', count: followUps.filter(f => f.status === 'upcoming').length, color: 'blue' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 border ${s.color === 'red' ? 'bg-red-50 border-red-200' : s.color === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-2xl font-bold ${s.color === 'red' ? 'text-red-700' : s.color === 'amber' ? 'text-amber-700' : 'text-blue-700'}`}>{s.count}</p>
              <p className="text-sm text-slate-600">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Patient', 'Condition', 'Last Visit', 'Due Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {followUps.map((f, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm text-slate-800">{f.patient}</p>
                    <p className="text-xs text-slate-400">{f.age} yrs</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{f.condition}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{f.lastVisit}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{f.nextDue}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${f.status === 'overdue' ? 'bg-red-100 text-red-700' : f.status === 'due_today' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {f.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">Schedule Visit</button>
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
