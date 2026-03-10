import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'

export default async function AdminClinicPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect('/login')

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Clinic Management</h1>
        <div className="grid grid-cols-2 gap-6">
          {[
            {
              title: 'Clinic Information',
              fields: [
                { label: 'Clinic Name', value: 'MedCity Multi-Specialty Clinic' },
                { label: 'Address', value: '45, MG Road, Bangalore — 560001' },
                { label: 'Phone', value: '+91 80-4567-8901' },
                { label: 'NABH Accredited', value: 'Yes (Valid until Dec 2027)' },
                { label: 'Beds', value: '10 General + 2 ICU' },
              ]
            },
            {
              title: 'Operational Hours',
              fields: [
                { label: 'OPD Hours', value: '9:00 AM — 1:00 PM, 5:00 PM — 9:00 PM' },
                { label: 'Emergency', value: '24 × 7' },
                { label: 'Lab Hours', value: '8:00 AM — 8:00 PM' },
                { label: 'Pharmacy', value: '8:00 AM — 10:00 PM' },
                { label: 'Closed On', value: 'National Holidays' },
              ]
            },
          ].map((section) => (
            <div key={section.title} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b bg-slate-50">
                <h2 className="font-semibold text-slate-800">{section.title}</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {section.fields.map((f) => (
                  <div key={f.label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-slate-500">{f.label}</span>
                    <span className="text-sm font-medium text-slate-800">{f.value}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t">
                <button className="text-sm text-violet-600 font-medium hover:underline">Edit Settings →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
