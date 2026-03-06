'use client'

import { useRouter } from 'next/navigation'
import { Appointment } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn, getStatusBadgeColor } from '@/lib/utils'
import { Play, CheckCircle2, Users } from 'lucide-react'

interface Props {
  appointments: Appointment[]
  doctorId: string
}

const priorityColors: Record<string, string> = {
  emergency: 'bg-red-100 text-red-700',
  urgent: 'bg-orange-100 text-orange-700',
  general: 'bg-green-100 text-green-700',
  'follow-up': 'bg-blue-100 text-blue-700',
}

export function PatientQueueTable({ appointments }: Props) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-base font-semibold text-slate-800">Patient Queue</CardTitle>
        </div>
        <Badge variant="outline" className="text-xs">
          {appointments.filter(a => a.status === 'waiting').length} waiting
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <CheckCircle2 className="h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No patients in queue today</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500 w-16">Token</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Patient Name</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 w-12">Age</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Type</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow
                  key={appt.id}
                  className={cn(
                    'hover:bg-slate-50 transition-colors',
                    appt.consultation_type === 'emergency' ? 'bg-red-50/50' : ''
                  )}
                >
                  <TableCell>
                    <span className="font-bold text-slate-700 text-sm">
                      #{appt.token_number ?? '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm text-slate-800">
                        {appt.patient?.full_name ?? 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-400">{appt.time_slot}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {appt.patient?.age ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('text-xs capitalize', priorityColors[appt.consultation_type] ?? '')}
                    >
                      {appt.consultation_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('text-xs capitalize', getStatusBadgeColor(appt.status))}
                    >
                      {appt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {appt.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                    ) : (
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() =>
                          router.push(`/dashboard/doctor/consultation/${appt.id}`)
                        }
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
