'use client'

import { Prescription, Medicine, DrugInteraction, Patient } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { Pill, AlertTriangle, Share2, Printer, User, Stethoscope, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  prescription: Prescription
}

export function PrescriptionView({ prescription }: Props) {
  const doctor = prescription.doctor as { full_name?: string; specialization?: string; license_number?: string } | undefined
  const patient = prescription.patient as Patient | undefined
  const consultation = prescription.consultation as { final_diagnosis?: string; recommended_tests?: string[] } | undefined

  function handlePrint() {
    window.print()
  }

  function handleWhatsApp() {
    if (!patient?.phone) return
    const meds = prescription.medicines.map((m: Medicine) =>
      `${m.name} ${m.dosage} ${m.frequency} for ${m.duration}`
    ).join(', ')
    const msg = `Your prescription${consultation?.final_diagnosis ? ` for ${consultation.final_diagnosis}` : ''}: ${meds}. Prescribed by Dr. ${doctor?.full_name} on ${formatDate(prescription.created_at)}.`
    window.open(`https://wa.me/91${patient.phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/doctor/prescriptions/new">
          <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-xs text-slate-600">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Prescription</h1>
          <p className="text-slate-500 text-sm">{formatDate(prescription.created_at)}</p>
        </div>
      </div>

      {/* Prescription Document */}
      <Card id="prescription-print" className="border-2 border-slate-200">
        <CardContent className="p-6 space-y-5">
          {/* Clinic Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-bold text-slate-800">CLINIQ-AI+</h2>
            <p className="text-sm text-slate-500">AI-Powered Clinic Management System</p>
            {doctor?.specialization && (
              <p className="text-xs text-slate-400 mt-0.5">{doctor.specialization}</p>
            )}
          </div>

          {/* Doctor + Patient Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor</p>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-slate-800">Dr. {doctor?.full_name ?? 'Unknown'}</span>
              </div>
              {doctor?.specialization && (
                <p className="text-xs text-slate-500">{doctor.specialization}</p>
              )}
              {doctor?.license_number && (
                <p className="text-xs text-slate-400">Reg: {doctor.license_number}</p>
              )}
            </div>
            {patient && (
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="font-semibold text-slate-800">{patient.full_name}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {patient.age}y · {patient.gender} · {patient.blood_group ?? 'Blood group unknown'}
                </p>
                <p className="text-xs text-slate-400 font-mono">{patient.patient_code}</p>
              </div>
            )}
          </div>

          {/* Date + Diagnosis */}
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-1.5 text-xs text-blue-700">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(prescription.created_at)}</span>
            </div>
            {consultation?.final_diagnosis && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-xs text-blue-700">
                  <span className="font-semibold">Diagnosis:</span> {consultation.final_diagnosis}
                </p>
              </>
            )}
          </div>

          <Separator />

          {/* Medicines */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <Pill className="h-4 w-4 text-blue-500" /> Prescribed Medicines
            </p>
            <div className="space-y-3">
              {prescription.medicines?.map((m: Medicine, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="font-bold text-slate-400 text-sm w-5 flex-shrink-0">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800">{m.name}</span>
                      {m.generic_alt && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Generic: {m.generic_alt}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">
                      <span className="font-medium">{m.dosage}</span> · {m.frequency} · {m.duration}
                    </p>
                    {m.instructions && (
                      <p className="text-xs text-slate-400 mt-0.5 italic">{m.instructions}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended tests */}
          {consultation?.recommended_tests && consultation.recommended_tests.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Recommended Tests</p>
                <div className="flex flex-wrap gap-1.5">
                  {consultation.recommended_tests.map((t: string) => (
                    <Badge key={t} variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 text-xs">{t}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Warnings */}
          {prescription.interaction_warnings?.length > 0 && (
            <>
              <Separator />
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-orange-700 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Drug Interaction Warnings
                </p>
                {prescription.interaction_warnings.map((w: DrugInteraction, i: number) => (
                  <p key={i} className="text-xs text-orange-600">• {w.drug_pair}: {w.message}</p>
                ))}
              </div>
            </>
          )}

          <Separator />
          <p className="text-xs text-slate-400 text-center">
            CLINIQ-AI+ · Digital Prescription · {formatDate(prescription.created_at)}
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" /> Print
        </Button>
        {patient?.phone && (
          <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50" onClick={handleWhatsApp}>
            <Share2 className="h-4 w-4 mr-2" /> Send via WhatsApp
          </Button>
        )}
      </div>
    </div>
  )
}
