'use client'

import { Appointment } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatDate, formatTime, getStatusBadgeColor } from '@/lib/utils'
import { Calendar, Clock, Stethoscope, CheckCircle2 } from 'lucide-react'

interface Props {
  appointments: Appointment[]
}

export function MyAppointments({ appointments }: Props) {
  const upcoming = appointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'cancelled')
  const past = appointments.filter(a => new Date(a.date) < new Date() || a.status === 'completed' || a.status === 'cancelled')

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Appointments</h1>
        <p className="text-slate-500 text-sm">{appointments.length} total appointments</p>
      </div>

      {/* Upcoming */}
      <section>
        <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Upcoming</h2>
        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="flex items-center gap-3 p-4 text-slate-400">
              <Calendar className="h-5 w-5" />
              <p className="text-sm">No upcoming appointments.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map(appt => (
              <AppointmentCard key={appt.id} appt={appt} />
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Past</h2>
          <div className="space-y-3">
            {past.map(appt => (
              <AppointmentCard key={appt.id} appt={appt} muted />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function AppointmentCard({ appt, muted }: { appt: Appointment; muted?: boolean }) {
  const doctor = appt.doctor as { full_name?: string; specialization?: string } | undefined
  return (
    <Card className={cn(muted ? 'opacity-70' : '', appt.consultation_type === 'emergency' ? 'border-red-200' : '')}>
      <CardContent className="p-4 flex items-start gap-4">
        <div className={cn(
          'p-3 rounded-full flex-shrink-0',
          appt.status === 'completed' ? 'bg-green-100' :
          appt.consultation_type === 'emergency' ? 'bg-red-100' : 'bg-blue-100'
        )}>
          {appt.status === 'completed'
            ? <CheckCircle2 className="h-5 w-5 text-green-600" />
            : <Calendar className={cn('h-5 w-5', appt.consultation_type === 'emergency' ? 'text-red-600' : 'text-blue-600')} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-slate-800">
                {doctor?.full_name ? `Dr. ${doctor.full_name}` : 'Doctor'}
              </p>
              {doctor?.specialization && (
                <p className="text-xs text-slate-500">{doctor.specialization}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Badge variant="outline" className={cn('text-xs capitalize', getStatusBadgeColor(appt.status))}>
                {appt.status}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize bg-slate-50">
                {appt.consultation_type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {formatDate(appt.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatTime(appt.time_slot)}
            </span>
            {appt.token_number && (
              <span className="flex items-center gap-1">
                <Stethoscope className="h-3 w-3" /> Token #{appt.token_number}
              </span>
            )}
          </div>
          {appt.notes && (
            <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 rounded p-1.5">{appt.notes}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
