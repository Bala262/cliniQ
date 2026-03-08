import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { QueueManager } from '@/components/queue/QueueManager'

export default async function QueuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/login')

  const today = new Date().toISOString().split('T')[0]
  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, patient:patients(full_name, age, phone), doctor:profiles(full_name)')
    .eq('date', today)
    .order('token_number', { ascending: true })

  return (
    <DashboardShell profile={profile}>
      <QueueManager appointments={appointments ?? []} />
    </DashboardShell>
  )
}
