import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { PrescriptionView } from '@/components/prescription/PrescriptionView'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PrescriptionViewPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileRes, prescriptionRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('prescriptions')
      .select('*, patient:patients(*), doctor:profiles(full_name, specialization, license_number), consultation:consultations(final_diagnosis, recommended_tests)')
      .eq('id', id)
      .single(),
  ])

  if (!profileRes.data) redirect('/login')
  if (!prescriptionRes.data) notFound()

  return (
    <DashboardShell profile={profileRes.data}>
      <PrescriptionView prescription={prescriptionRes.data} />
    </DashboardShell>
  )
}
