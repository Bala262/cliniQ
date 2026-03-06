import { Appointment } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatTime, getStatusBadgeColor } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface Props {
  appointments: Appointment[]
}

export function AppointmentTimeline({ appointments }: Props) {
  const sorted = [...appointments].sort((a, b) =>
    a.time_slot.localeCompare(b.time_slot)
  )

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center gap-2">
        <Clock className="h-5 w-5 text-blue-500" />
        <CardTitle className="text-base font-semibold text-slate-800">Today&apos;s Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        {sorted.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No appointments today</p>
        ) : (
          sorted.map((appt, idx) => (
            <div key={appt.id} className="flex items-center gap-3">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  'h-2 w-2 rounded-full',
                  appt.status === 'completed' ? 'bg-green-500' :
                  appt.status === 'in-consultation' ? 'bg-blue-500' :
                  appt.consultation_type === 'emergency' ? 'bg-red-500' :
                  'bg-slate-300'
                )} />
                {idx < sorted.length - 1 && (
                  <div className="w-px h-4 bg-slate-200 mt-1" />
                )}
              </div>
              {/* Content */}
              <div className="flex items-center justify-between flex-1 min-w-0">
                <div>
                  <p className="text-xs font-medium text-slate-700 truncate">
                    {appt.patient?.full_name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-slate-400">{formatTime(appt.time_slot)}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn('text-xs capitalize ml-2 flex-shrink-0', getStatusBadgeColor(appt.status))}
                >
                  {appt.status === 'in-consultation' ? 'Active' : appt.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
