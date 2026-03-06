'use client'

import Link from 'next/link'
import { Profile, Appointment } from '@/types'
import { SummaryCard } from './SummaryCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn, getStatusBadgeColor, formatTime } from '@/lib/utils'
import { Calendar, UserPlus, CreditCard, ClipboardList, CheckCircle2 } from 'lucide-react'

interface Props {
  profile: Profile
  stats: {
    appointments_today: number
    new_patients: number
    pending_billing: number
    waiting: number
  }
  appointments: Appointment[]
}

export function ReceptionistDashboardContent({ profile, stats, appointments }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reception Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Welcome, {profile.full_name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Appointments Today" value={stats.appointments_today} icon={Calendar} color="blue" />
        <SummaryCard title="Waiting Patients" value={stats.waiting} icon={ClipboardList} color="yellow" />
        <SummaryCard title="New Patients Today" value={stats.new_patients} icon={UserPlus} color="green" />
        <SummaryCard title="Pending Billing" value={stats.pending_billing} icon={CreditCard} color="purple" urgent={stats.pending_billing > 0} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/dashboard/receptionist/register-patient">
          <Button className="w-full h-14 flex-col gap-1 bg-teal-600 hover:bg-teal-700 text-white text-xs">
            <UserPlus className="h-5 w-5" />
            Register Patient
          </Button>
        </Link>
        <Link href="/dashboard/receptionist/appointments">
          <Button className="w-full h-14 flex-col gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs">
            <Calendar className="h-5 w-5" />
            Book Appointment
          </Button>
        </Link>
        <Link href="/dashboard/receptionist/queue">
          <Button className="w-full h-14 flex-col gap-1 bg-purple-600 hover:bg-purple-700 text-white text-xs">
            <ClipboardList className="h-5 w-5" />
            Manage Queue
          </Button>
        </Link>
        <Link href="/dashboard/receptionist/billing">
          <Button className="w-full h-14 flex-col gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs">
            <CreditCard className="h-5 w-5" />
            Billing
          </Button>
        </Link>
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base font-semibold text-slate-800">Today&apos;s Appointments</CardTitle>
          </div>
          <Link href="/dashboard/receptionist/appointments">
            <Button variant="outline" size="sm" className="h-7 text-xs">View All</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <CheckCircle2 className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No appointments today</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="text-xs font-semibold text-slate-500 w-16">Token</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Patient</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Time</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Doctor</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Type</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id} className="hover:bg-slate-50">
                    <TableCell className="font-bold text-slate-700">#{appt.token_number}</TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{appt.patient?.full_name}</p>
                      <p className="text-xs text-slate-400">{appt.patient?.phone}</p>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{formatTime(appt.time_slot)}</TableCell>
                    <TableCell className="text-sm text-slate-600">
                      Dr. {appt.doctor?.full_name?.split(' ')[0]}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {appt.consultation_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs capitalize', getStatusBadgeColor(appt.status))}>
                        {appt.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
