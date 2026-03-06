'use client'

import { AIAlert } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, getAlertSeverityColor } from '@/lib/utils'
import { ShieldAlert, AlertTriangle, Pill, FlaskConical, CalendarX, Heart } from 'lucide-react'

interface Props {
  alerts: AIAlert[]
}

const alertIcons: Record<string, React.ElementType> = {
  drug_interaction: Pill,
  high_risk: Heart,
  abnormal_lab: FlaskConical,
  overdue_followup: CalendarX,
  emergency: AlertTriangle,
}

const severityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-blue-100 text-blue-700',
}

export function AIAlertsPanel({ alerts }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-base font-semibold text-slate-800">AI Alerts</CardTitle>
        </div>
        {alerts.length > 0 && (
          <Badge className="bg-red-100 text-red-700 text-xs">{alerts.length}</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate-400">
            <ShieldAlert className="h-8 w-8 mb-1 opacity-30" />
            <p className="text-xs">No active alerts</p>
          </div>
        ) : (
          alerts.slice(0, 6).map((alert) => {
            const Icon = alertIcons[alert.alert_type] ?? AlertTriangle
            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-2 p-2.5 rounded-lg border-l-4',
                  getAlertSeverityColor(alert.severity)
                )}
              >
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-600" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className={cn('text-xs py-0 px-1.5', severityColors[alert.severity])}>
                      {alert.severity}
                    </Badge>
                    <p className="text-xs font-medium text-slate-700 truncate">
                      {alert.patient?.full_name}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-tight">{alert.message}</p>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
