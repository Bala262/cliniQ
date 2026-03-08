'use client'

import { Patient, Consultation, Prescription, Vitals, LabReport, Medicine } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn, formatDate, formatTime, getRiskBadgeColor } from '@/lib/utils'
import {
  User, Heart, FileText, FlaskConical, Activity,
  AlertTriangle, Stethoscope, Pill, Calendar
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

interface Props {
  patient: Patient
  consultations: Consultation[]
  prescriptions: Prescription[]
  vitals: Vitals[]
  labReports: LabReport[]
  canEdit?: boolean
}

export function PatientProfile({ patient, consultations, prescriptions, vitals, labReports }: Props) {
  const bpData = vitals
    .filter(v => v.bp_systolic)
    .slice(0, 10)
    .reverse()
    .map((v, i) => ({
      visit: `V${i + 1}`,
      systolic: v.bp_systolic,
      diastolic: v.bp_diastolic,
      hr: v.heart_rate,
    }))

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-slate-800">{patient.full_name}</h1>
            <span className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-semibold">
              {patient.patient_code}
            </span>
            <Badge variant="outline" className={cn('text-xs capitalize', getRiskBadgeColor(patient.risk_level))}>
              {patient.risk_level} risk
            </Badge>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            {patient.age}y · {patient.gender} · {patient.blood_group ?? 'Blood group unknown'} · {patient.phone}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {patient.allergies?.map(a => (
              <Badge key={a} variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />{a}
              </Badge>
            ))}
            {patient.chronic_conditions?.map(c => (
              <Badge key={c} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">{c}</Badge>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="info">
        <TabsList className="h-9">
          <TabsTrigger value="info" className="text-xs gap-1.5"><User className="h-3.5 w-3.5" />Info</TabsTrigger>
          <TabsTrigger value="history" className="text-xs gap-1.5"><FileText className="h-3.5 w-3.5" />Consultations</TabsTrigger>
          <TabsTrigger value="prescriptions" className="text-xs gap-1.5"><Pill className="h-3.5 w-3.5" />Prescriptions</TabsTrigger>
          <TabsTrigger value="vitals" className="text-xs gap-1.5"><Activity className="h-3.5 w-3.5" />Vitals</TabsTrigger>
          <TabsTrigger value="labs" className="text-xs gap-1.5"><FlaskConical className="h-3.5 w-3.5" />Lab Reports</TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="info" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" /> Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3 pt-0">
                {[
                  { label: 'Full Name', value: patient.full_name },
                  { label: 'Age', value: patient.age ? `${patient.age} years` : '—' },
                  { label: 'Gender', value: patient.gender ?? '—' },
                  { label: 'Phone', value: patient.phone },
                  { label: 'Blood Group', value: patient.blood_group ?? '—' },
                  { label: 'Address', value: patient.address ?? '—' },
                  { label: 'Emergency Contact', value: patient.emergency_contact ?? '—' },
                  { label: 'Registered', value: formatDate(patient.created_at) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs font-medium text-slate-800 capitalize max-w-xs text-right">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" /> Medical Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3 pt-0">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">Known Allergies</p>
                  {patient.allergies?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {patient.allergies.map(a => (
                        <Badge key={a} variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">{a}</Badge>
                      ))}
                    </div>
                  ) : <p className="text-xs text-slate-400">None recorded</p>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">Chronic Conditions</p>
                  {patient.chronic_conditions?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {patient.chronic_conditions.map(c => (
                        <Badge key={c} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">{c}</Badge>
                      ))}
                    </div>
                  ) : <p className="text-xs text-slate-400">None recorded</p>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <p className="text-xs text-slate-500">Total Consultations</p>
                    <p className="text-lg font-bold text-blue-600">{consultations.length}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <p className="text-xs text-slate-500">Prescriptions</p>
                    <p className="text-lg font-bold text-purple-600">{prescriptions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Consultation History */}
        <TabsContent value="history" className="mt-4">
          <div className="space-y-3">
            {consultations.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No consultations yet.</p>
            ) : (
              consultations.map(c => (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold text-sm text-slate-800">
                          {c.final_diagnosis ?? 'Diagnosis not set'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(c.date)}</span>
                    </div>
                    {c.extracted_symptoms?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {c.extracted_symptoms.map((s, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            {s.symptom}{s.duration ? ` · ${s.duration}` : ''}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {c.doctor_notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded">{c.doctor_notes}</p>
                    )}
                    {c.recommended_tests?.length > 0 && (
                      <p className="text-xs text-teal-700 mt-1">
                        Tests: {c.recommended_tests.join(', ')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Prescriptions */}
        <TabsContent value="prescriptions" className="mt-4">
          <div className="space-y-3">
            {prescriptions.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No prescriptions yet.</p>
            ) : (
              prescriptions.map(rx => (
                <Card key={rx.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm text-slate-800">
                          {rx.medicines?.length ?? 0} medicines
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{formatDate(rx.created_at)}</span>
                    </div>
                    <div className="space-y-1.5">
                      {rx.medicines?.map((m: Medicine, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400 w-4">{i + 1}.</span>
                          <span className="font-medium text-slate-700">{m.name}</span>
                          <span className="text-slate-500">{m.dosage} · {m.frequency} · {m.duration}</span>
                          {m.generic_alt && (
                            <span className="text-green-600">(Generic: {m.generic_alt})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Vitals */}
        <TabsContent value="vitals" className="mt-4">
          <div className="space-y-4">
            {vitals.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No vitals recorded yet.</p>
            ) : (
              <>
                {bpData.length > 1 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold text-slate-700">Blood Pressure Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={bpData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="visit" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} domain={[40, 180]} />
                          <Tooltip contentStyle={{ fontSize: 11 }} />
                          <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={false} name="Systolic" />
                          <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} dot={false} name="Diastolic" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide">
                          <th className="px-3 py-2 text-left font-semibold">Date</th>
                          <th className="px-3 py-2 text-left font-semibold">BP</th>
                          <th className="px-3 py-2 text-left font-semibold">HR</th>
                          <th className="px-3 py-2 text-left font-semibold">Temp</th>
                          <th className="px-3 py-2 text-left font-semibold">SpO2</th>
                          <th className="px-3 py-2 text-left font-semibold">Weight</th>
                          <th className="px-3 py-2 text-left font-semibold">BMI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {vitals.slice(0, 10).map(v => (
                          <tr key={v.id} className="hover:bg-slate-50">
                            <td className="px-3 py-2">{formatDate(v.recorded_at)}</td>
                            <td className="px-3 py-2 font-medium">
                              {v.bp_systolic ? `${v.bp_systolic}/${v.bp_diastolic}` : '—'}
                            </td>
                            <td className="px-3 py-2">{v.heart_rate ?? '—'}</td>
                            <td className="px-3 py-2">{v.temperature ? `${v.temperature}°C` : '—'}</td>
                            <td className="px-3 py-2">{v.oxygen_saturation ? `${v.oxygen_saturation}%` : '—'}</td>
                            <td className="px-3 py-2">{v.weight ? `${v.weight} kg` : '—'}</td>
                            <td className="px-3 py-2">{v.bmi ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        {/* Lab Reports */}
        <TabsContent value="labs" className="mt-4">
          <div className="space-y-3">
            {labReports.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No lab reports uploaded yet.</p>
            ) : (
              labReports.map(r => (
                <Card key={r.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-teal-500" />
                        <span className="font-medium text-sm text-slate-800">{r.file_name}</span>
                      </div>
                      <span className="text-xs text-slate-400">{formatDate(r.uploaded_at)}</span>
                    </div>
                    {r.ai_summary && (
                      <p className="text-xs text-teal-700 bg-teal-50 p-2 rounded">{r.ai_summary}</p>
                    )}
                    {r.extracted_values?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {r.extracted_values
                          .filter((v: { status: string }) => v.status !== 'normal')
                          .map((v: { test_name: string; value: string; unit: string; status: string }, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                              {v.test_name}: {v.value} {v.unit} ({v.status})
                            </Badge>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
