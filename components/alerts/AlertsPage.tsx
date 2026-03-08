'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AIAlert } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, getAlertSeverityColor, formatDate } from '@/lib/utils'
import { ShieldAlert, AlertTriangle, Pill, FlaskConical, CalendarX, Heart, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

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
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
}

export function AlertsPage({ alerts: initialAlerts }: Props) {
  const supabase = createClient()
  const [alerts, setAlerts] = useState(initialAlerts)
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active')

  const unresolved = alerts.filter(a => !a.is_resolved)
  const resolved = alerts.filter(a => a.is_resolved)

  const shown = filter === 'all' ? alerts : filter === 'active' ? unresolved : resolved

  async function resolveAlert(id: string) {
    const { error } = await supabase.from('ai_alerts').update({ is_resolved: true }).eq('id', id)
    if (!error) {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_resolved: true } : a))
      toast.success('Alert resolved')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Health Alerts</h1>
          <p className="text-slate-500 text-sm">
            {unresolved.length} active · {resolved.length} resolved
          </p>
        </div>
        <div className="flex gap-2">
          {(['active', 'resolved', 'all'] as const).map(f => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? 'default' : 'outline'}
              className={cn('h-8 text-xs capitalize', filter === f ? 'bg-slate-800' : '')}
              onClick={() => setFilter(f)}
            >
              {f} {f === 'active' ? `(${unresolved.length})` : f === 'resolved' ? `(${resolved.length})` : `(${alerts.length})`}
            </Button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-slate-400">
            <CheckCircle2 className="h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No {filter} alerts</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {shown.map(alert => {
            const Icon = alertIcons[alert.alert_type] ?? AlertTriangle
            const patient = alert.patient as { full_name?: string; patient_code?: string; age?: number } | undefined
            return (
              <Card
                key={alert.id}
                className={cn(
                  'border-l-4',
                  alert.is_resolved ? 'opacity-60 border-l-slate-300' : getAlertSeverityColor(alert.severity)
                )}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-full flex-shrink-0',
                    alert.is_resolved ? 'bg-slate-100' :
                    alert.severity === 'critical' ? 'bg-red-100' :
                    alert.severity === 'high' ? 'bg-orange-100' :
                    alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  )}>
                    <Icon className={cn(
                      'h-4 w-4',
                      alert.is_resolved ? 'text-slate-400' :
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <Badge
                        variant="outline"
                        className={cn('text-xs capitalize', alert.is_resolved ? 'bg-slate-100 text-slate-500' : severityColors[alert.severity])}
                      >
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize bg-slate-50">
                        {alert.alert_type.replace('_', ' ')}
                      </Badge>
                      {alert.is_resolved && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Resolved
                        </Badge>
                      )}
                    </div>
                    {patient && (
                      <p className="text-xs font-semibold text-slate-700">
                        {patient.full_name}
                        {patient.patient_code && <span className="font-mono text-blue-600 ml-1.5">{patient.patient_code}</span>}
                        {patient.age && <span className="text-slate-400 ml-1"> · {patient.age}y</span>}
                      </p>
                    )}
                    <p className="text-sm text-slate-700 mt-0.5">{alert.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(alert.created_at)}</p>
                  </div>
                  {!alert.is_resolved && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs flex-shrink-0 border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Resolve
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
