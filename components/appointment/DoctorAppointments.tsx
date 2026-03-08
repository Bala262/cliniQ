'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Appointment } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn, getStatusBadgeColor, formatDate, formatTime } from '@/lib/utils'
import { Calendar, Play, Filter } from 'lucide-react'

interface Props {
  appointments: Appointment[]
}

export function DoctorAppointments({ appointments }: Props) {
  const router = useRouter()
  const [filterDate, setFilterDate] = useState('')

  const filtered = filterDate
    ? appointments.filter(a => a.date === filterDate)
    : appointments

  const today = new Date().toISOString().split('T')[0]
  const todayCount = appointments.filter(a => a.date === today).length
  const completedCount = appointments.filter(a => a.status === 'completed').length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Appointments</h1>
        <p className="text-slate-500 text-sm">{appointments.length} total · {todayCount} today · {completedCount} completed</p>
      </div>

      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-slate-400" />
        <Input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="w-40 h-8 text-sm"
        />
        {filterDate && (
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setFilterDate('')}>
            Clear
          </Button>
        )}
        <Badge variant="outline" className="text-xs">{filtered.length} shown</Badge>
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-base font-semibold text-slate-800">Appointments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs w-16">Token</TableHead>
                <TableHead className="text-xs">Patient</TableHead>
                <TableHead className="text-xs">Date & Time</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-10">
                    No appointments found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(appt => {
                  const patient = appt.patient as { full_name?: string; age?: number; phone?: string } | undefined
                  return (
                    <TableRow key={appt.id} className="hover:bg-slate-50">
                      <TableCell className="font-bold text-slate-700">#{appt.token_number ?? '—'}</TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{patient?.full_name ?? 'Unknown'}</p>
                        <p className="text-xs text-slate-400">{patient?.age}y · {patient?.phone}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{formatDate(appt.date)}</p>
                        <p className="text-xs text-slate-400">{formatTime(appt.time_slot)}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{appt.consultation_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs capitalize', getStatusBadgeColor(appt.status))}>
                          {appt.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {(appt.status === 'waiting' || appt.status === 'scheduled') && (
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                            onClick={() => router.push(`/dashboard/doctor/consultation/${appt.id}`)}
                          >
                            <Play className="h-3 w-3 mr-1" /> Start
                          </Button>
                        )}
                        {appt.status === 'completed' && (
                          <span className="text-xs text-green-600 font-medium">Done</span>
                        )}
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
