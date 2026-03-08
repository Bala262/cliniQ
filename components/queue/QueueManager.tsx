'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Appointment } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn, getStatusBadgeColor, formatTime } from '@/lib/utils'
import { toast } from 'sonner'
import { ClipboardList, CheckCircle2, Clock, UserCheck, XCircle } from 'lucide-react'

interface Props {
  appointments: Appointment[]
}

const STATUS_FLOW: Record<string, string> = {
  scheduled: 'waiting',
  waiting: 'in-consultation',
  'in-consultation': 'completed',
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Mark Arrived',
  waiting: 'Start Consult',
  'in-consultation': 'Complete',
}

export function QueueManager({ appointments: initial }: Props) {
  const supabase = createClient()
  const [appointments, setAppointments] = useState(initial)

  const waiting = appointments.filter(a => a.status === 'waiting').length
  const inConsultation = appointments.filter(a => a.status === 'in-consultation').length
  const completed = appointments.filter(a => a.status === 'completed').length

  async function advance(id: string, currentStatus: string) {
    const next = STATUS_FLOW[currentStatus]
    if (!next) return
    const { error } = await supabase.from('appointments').update({ status: next }).eq('id', id)
    if (!error) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: next as Appointment['status'] } : a))
      toast.success(`Status updated to ${next}`)
    }
  }

  async function cancel(id: string) {
    const { error } = await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id)
    if (!error) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' as Appointment['status'] } : a))
      toast.success('Appointment cancelled')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Today&apos;s Queue</h1>
        <p className="text-slate-500 text-sm">{appointments.length} total appointments</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', count: appointments.length, icon: ClipboardList, color: 'bg-slate-100 text-slate-700' },
          { label: 'Waiting', count: waiting, icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
          { label: 'In Consult', count: inConsultation, icon: UserCheck, color: 'bg-blue-100 text-blue-700' },
          { label: 'Done', count: completed, icon: CheckCircle2, color: 'bg-green-100 text-green-700' },
        ].map(({ label, count, icon: Icon, color }) => (
          <div key={label} className={cn('flex items-center gap-2 p-3 rounded-xl', color)}>
            <Icon className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium">{label}</p>
              <p className="text-xl font-bold">{count}</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <ClipboardList className="h-5 w-5 text-teal-500" />
          <CardTitle className="text-base font-semibold text-slate-800">Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs w-16">Token</TableHead>
                <TableHead className="text-xs">Patient</TableHead>
                <TableHead className="text-xs">Doctor</TableHead>
                <TableHead className="text-xs">Time</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-400 py-10">
                    No appointments today
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map(appt => {
                  const patient = appt.patient as { full_name?: string; age?: number; phone?: string } | undefined
                  const doctor = appt.doctor as { full_name?: string } | undefined
                  return (
                    <TableRow
                      key={appt.id}
                      className={cn(
                        'hover:bg-slate-50',
                        appt.consultation_type === 'emergency' ? 'bg-red-50/40' : '',
                        appt.status === 'completed' ? 'opacity-60' : ''
                      )}
                    >
                      <TableCell className="font-bold text-slate-700">#{appt.token_number}</TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{patient?.full_name}</p>
                        <p className="text-xs text-slate-400">{patient?.age}y · {patient?.phone}</p>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        Dr. {doctor?.full_name?.split(' ')[0]}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{formatTime(appt.time_slot)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{appt.consultation_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs capitalize', getStatusBadgeColor(appt.status))}>
                          {appt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          {STATUS_FLOW[appt.status] && (
                            <Button
                              size="sm"
                              className="h-7 text-xs bg-teal-600 hover:bg-teal-700"
                              onClick={() => advance(appt.id, appt.status)}
                            >
                              {STATUS_LABELS[appt.status]}
                            </Button>
                          )}
                          {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => cancel(appt.id)}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
