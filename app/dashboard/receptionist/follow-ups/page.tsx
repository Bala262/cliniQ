import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function ReceptionistFollowUpsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'receptionist') redirect('/login')

  const followUps = [
    { patient: 'Suresh Iyer', phone: '98765-43210', condition: 'Diabetes', lastVisit: '10 Feb 2026', nextDue: 'Today', doctor: 'Dr. Priya', status: 'due' },
    { patient: 'Kavitha Nair', phone: '87654-32109', condition: 'Hypothyroidism', lastVisit: '08 Feb 2026', nextDue: '05 Mar 2026', doctor: 'Dr. Ahmed', status: 'overdue' },
    { patient: 'Raj Kumar', phone: '76543-21098', condition: 'Hypertension', lastVisit: '15 Feb 2026', nextDue: '15 Mar 2026', doctor: 'Dr. Kumar', status: 'upcoming' },
    { patient: 'Priya Singh', phone: '65432-10987', condition: 'Post-Op Review', lastVisit: '01 Mar 2026', nextDue: '15 Mar 2026', doctor: 'Dr. Ahmed', status: 'upcoming' },
  ]

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Follow-ups</h1>
            <p className="text-sm text-slate-500">Patients due for follow-up visits</p>
          </div>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700">
            Send SMS Reminders
          </button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                {['Patient', 'Phone', 'Condition', 'Last Visit', 'Due Date', 'Doctor', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {followUps.map((f, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{f.patient}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{f.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{f.condition}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{f.lastVisit}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{f.nextDue}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{f.doctor}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${f.status === 'overdue' ? 'bg-red-100 text-red-700' : f.status === 'due' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs bg-cyan-600 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-700">Book Appointment</button>
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
