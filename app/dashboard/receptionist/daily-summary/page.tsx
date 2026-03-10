import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function ReceptionistDailySummaryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'receptionist') redirect('/login')

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Daily Summary</h1>
            <p className="text-sm text-slate-500">Tuesday, March 10, 2026</p>
          </div>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700">
            Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Registered', value: '34', sub: 'Patients today', color: 'cyan' },
            { label: 'OPD Completed', value: '28', sub: 'Consultations done', color: 'blue' },
            { label: 'Admitted', value: '2', sub: 'To inpatient ward', color: 'purple' },
            { label: 'Billing Pending', value: '6', sub: 'Invoices unpaid', color: 'amber' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-3xl font-bold text-slate-800">{s.value}</p>
              <p className="text-sm font-medium text-slate-700 mt-1">{s.label}</p>
              <p className="text-xs text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Doctor-wise Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Doctor-wise Patient Summary</h2>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                {['Doctor', 'Department', 'Patients Seen', 'Pending', 'Ward Admissions', 'Revenue'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { doctor: 'Dr. Kumar', dept: 'General Medicine', seen: 12, pending: 2, ward: 1, revenue: '₹6,000' },
                { doctor: 'Dr. Priya', dept: 'Endocrinology', seen: 10, pending: 1, ward: 0, revenue: '₹5,000' },
                { doctor: 'Dr. Ahmed', dept: 'Orthopedics', seen: 8, pending: 3, ward: 1, revenue: '₹4,000' },
              ].map((d, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{d.doctor}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{d.dept}</td>
                  <td className="px-4 py-3 text-sm font-bold text-emerald-700">{d.seen}</td>
                  <td className="px-4 py-3 text-sm text-amber-700">{d.pending}</td>
                  <td className="px-4 py-3 text-sm text-blue-700">{d.ward}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">{d.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Appointment Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Today's Appointment Timeline</h2>
          <div className="space-y-3">
            {[
              { time: '09:00', patient: 'Ravi Kumar', doctor: 'Dr. Kumar', status: 'completed', token: 'A01' },
              { time: '09:30', patient: 'Meena Lakshmi', doctor: 'Dr. Priya', status: 'completed', token: 'A02' },
              { time: '10:00', patient: 'Suresh Iyer', doctor: 'Dr. Priya', status: 'completed', token: 'A03' },
              { time: '10:15', patient: 'Priya Devi', doctor: 'Dr. Ahmed', status: 'in_progress', token: 'A04' },
              { time: '10:30', patient: 'Rajan Mehta', doctor: 'Dr. Kumar', status: 'waiting', token: 'A05' },
              { time: '10:45', patient: 'Kavitha Nair', doctor: 'Dr. Ahmed', status: 'waiting', token: 'A06' },
            ].map((appt, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs font-mono text-slate-400 w-12">{appt.time}</span>
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${appt.status === 'completed' ? 'bg-emerald-500' : appt.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold text-slate-500 w-8">{appt.token}</span>
                <span className="text-sm font-medium text-slate-800">{appt.patient}</span>
                <span className="text-xs text-slate-500 ml-1">→ {appt.doctor}</span>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${appt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : appt.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  {appt.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
