import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { NurseProcedures } from '@/components/nurse/NurseProcedures'

export default async function NurseProceduresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || profile.role !== 'nurse') redirect('/login')
  return <DashboardShell profile={profile}><NurseProcedures /></DashboardShell>
}
