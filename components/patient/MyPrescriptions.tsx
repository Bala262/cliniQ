'use client'

import { useState } from 'react'
import { Prescription, Medicine } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { Pill, AlertTriangle, ChevronDown, ChevronUp, Share2, Stethoscope } from 'lucide-react'

interface Props {
  prescriptions: Prescription[]
}

export function MyPrescriptions({ prescriptions }: Props) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Prescriptions</h1>
        <p className="text-slate-500 text-sm">{prescriptions.length} prescription(s) on record</p>
      </div>

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="flex items-center gap-3 p-6 text-slate-400">
            <Pill className="h-6 w-6" />
            <p className="text-sm">No prescriptions yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map(rx => (
            <PrescriptionCard key={rx.id} rx={rx} />
          ))}
        </div>
      )}
    </div>
  )
}

function PrescriptionCard({ rx }: { rx: Prescription }) {
  const [expanded, setExpanded] = useState(false)
  const doctor = rx.doctor as { full_name?: string; specialization?: string } | undefined
  const consultation = rx.consultation as { final_diagnosis?: string } | undefined
  const hasWarnings = rx.interaction_warnings?.length > 0

  return (
    <Card className={hasWarnings ? 'border-orange-200' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-sm font-semibold text-slate-700">
                {rx.medicines?.length ?? 0} Medicine(s)
              </CardTitle>
              {hasWarnings && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs gap-1">
                  <AlertTriangle className="h-3 w-3" /> Interaction Warning
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Stethoscope className="h-3 w-3" />
                Dr. {doctor?.full_name ?? 'Unknown'}
              </span>
              <span>{formatDate(rx.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {rx.patient && (rx.patient as { phone?: string })?.phone && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => {
                  const meds = rx.medicines.map((m: Medicine) => `${m.name} ${m.dosage} ${m.frequency} for ${m.duration}`).join(', ')
                  const msg = `Your prescription${consultation?.final_diagnosis ? ` for ${consultation.final_diagnosis}` : ''}: ${meds}`
                  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
                }}
              >
                <Share2 className="h-3 w-3 mr-1" /> Share
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {consultation?.final_diagnosis && (
          <p className="text-xs mt-1">
            <span className="text-slate-500">Diagnosis: </span>
            <span className="font-medium text-blue-700">{consultation.final_diagnosis}</span>
          </p>
        )}
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-3">
          <Separator />

          {/* Medicines */}
          <div className="space-y-2">
            {rx.medicines?.map((med: Medicine, i: number) => (
              <div key={i} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg">
                <span className="text-xs font-bold text-slate-400 w-4 flex-shrink-0">{i + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800">{med.name}</span>
                    {med.generic_alt && (
                      <span className="text-xs text-green-600">(Generic: {med.generic_alt})</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {med.dosage} · {med.frequency} · {med.duration}
                    {med.instructions ? ` · ${med.instructions}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Interaction warnings */}
          {hasWarnings && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-orange-700">Drug Interaction Alerts</p>
              {rx.interaction_warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-orange-50 rounded border border-orange-200">
                  <AlertTriangle className="h-3.5 w-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-orange-800">{w.drug_pair}</p>
                    <p className="text-xs text-orange-600">{w.message}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto text-xs capitalize bg-orange-100 text-orange-700 flex-shrink-0">
                    {w.severity}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Allergy alerts */}
          {rx.allergy_alerts?.length > 0 && (
            <div className="space-y-1">
              {rx.allergy_alerts.map((alert: string, i: number) => (
                <p key={i} className="text-xs text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {alert}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
