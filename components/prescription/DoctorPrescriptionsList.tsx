'use client'

import Link from 'next/link'
import { Prescription, Medicine } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Pill, Eye, AlertTriangle, Share2 } from 'lucide-react'

interface Props {
  prescriptions: Prescription[]
}

export function DoctorPrescriptionsList({ prescriptions }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Prescriptions</h1>
        <p className="text-slate-500 text-sm">{prescriptions.length} issued</p>
      </div>

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="flex items-center gap-3 p-6 text-slate-400">
            <Pill className="h-6 w-6" />
            <p className="text-sm">No prescriptions issued yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {prescriptions.map(rx => {
            const patient = rx.patient as { full_name?: string; patient_code?: string; phone?: string } | undefined
            const consultation = rx.consultation as { final_diagnosis?: string } | undefined
            const hasWarnings = rx.interaction_warnings?.length > 0

            return (
              <Card key={rx.id} className={hasWarnings ? 'border-orange-200' : ''}>
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Pill className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="font-semibold text-sm text-slate-800">
                        {patient?.full_name ?? 'Unknown Patient'}
                      </span>
                      {patient?.patient_code && (
                        <span className="font-mono text-xs text-blue-600">{patient.patient_code}</span>
                      )}
                      {hasWarnings && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 gap-1">
                          <AlertTriangle className="h-3 w-3" /> Drug Warning
                        </Badge>
                      )}
                    </div>
                    {consultation?.final_diagnosis && (
                      <p className="text-xs text-slate-500 mb-1">
                        Diagnosis: <span className="font-medium text-blue-700">{consultation.final_diagnosis}</span>
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {rx.medicines?.slice(0, 3).map((m: Medicine, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs bg-slate-50">
                          {m.name} {m.dosage}
                        </Badge>
                      ))}
                      {rx.medicines?.length > 3 && (
                        <Badge variant="outline" className="text-xs text-slate-500">+{rx.medicines.length - 3} more</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(rx.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {patient?.phone && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => {
                          const meds = rx.medicines.map((m: Medicine) => `${m.name} ${m.dosage} ${m.frequency}`).join(', ')
                          window.open(`https://wa.me/91${patient.phone}?text=${encodeURIComponent(`Prescription: ${meds}`)}`, '_blank')
                        }}
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    )}
                    <Link href={`/dashboard/doctor/prescriptions/${rx.id}`}>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                        <Eye className="h-3 w-3" /> View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
