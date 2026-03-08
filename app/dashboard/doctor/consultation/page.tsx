import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { PatientQueueTable } from '@/components/dashboard/PatientQueueTable'
import { Stethoscope } from 'lucide-react'

export default async function ConsultationQueuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const today = new Date().toISOString().split('T')[0]
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, patient:patients(*)')
    .eq('date', today)
    .eq('doctor_id', user.id)
    .order('token_number', { ascending: true })

  return (
    <DashboardShell profile={profile}>
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">Consultation Queue</h1>
            <p className="text-slate-500 text-sm">Today&apos;s patients waiting for consultation</p>
          </div>
        </div>
        <p className="text-xs text-slate-400">Click <strong>Start</strong> to begin an AI-assisted consultation</p>
        <PatientQueueTable appointments={appointments ?? []} doctorId={user.id} />
      </div>
    </DashboardShell>
  )
}
