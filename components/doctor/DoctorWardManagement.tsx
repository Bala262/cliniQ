'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BedDouble, Plus, Eye, AlertTriangle, Stethoscope, Calendar } from 'lucide-react'
import { toast } from 'sonner'

const wardPatients = [
  {
    bed: 'Bed 1', bedId: 1, patient: 'Ravi Kumar', age: 35, diagnosis: 'Dengue Fever',
    admission: '08 Mar 2026', days: 2, condition: 'Stable', lastVitals: { temp: '101.2°F', bp: '118/76', hr: '92', spo2: '97%' },
    medications: ['Paracetamol 500mg 3x/day', 'ORS 2L/day', 'Cetirizine 10mg'],
    pendingTests: ['Dengue NS1 Antigen', 'Repeat CBC'],
    notes: 'Monitor platelet count. Maintain oral hydration. Review tomorrow.'
  },
  {
    bed: 'Bed 3', bedId: 3, patient: 'Meena Lakshmi', age: 28, diagnosis: 'Typhoid Fever',
    admission: '07 Mar 2026', days: 3, condition: 'Improving', lastVitals: { temp: '99.8°F', bp: '110/70', hr: '78', spo2: '98%' },
    medications: ['Ciprofloxacin 500mg 2x/day', 'IV Fluids 1L'],
    pendingTests: ['Widal Test Follow-up'],
    notes: 'Fever subsiding. Continue antibiotics. Can consider oral antibiotics if improving.'
  },
  {
    bed: 'Bed 7', bedId: 7, patient: 'Sita Devi', age: 65, diagnosis: 'Community-Acquired Pneumonia',
    admission: '05 Mar 2026', days: 5, condition: 'Critical', lastVitals: { temp: '103.1°F', bp: '95/60', hr: '108', spo2: '91%' },
    medications: ['Piperacillin IV 4.5g 3x/day', 'O₂ therapy 4L/min', 'Hydrocortisone 100mg IV'],
    pendingTests: ['Sputum Culture', 'ABG repeat', 'Chest X-Ray'],
    notes: 'CRITICAL: SpO₂ low. Escalate to ICU if no improvement. Family counselled.'
  },
]

const CONDITION_STYLES: Record<string, { badge: string; border: string }> = {
  Stable: { badge: 'bg-emerald-100 text-emerald-700', border: 'border-l-emerald-400' },
  Improving: { badge: 'bg-blue-100 text-blue-700', border: 'border-l-blue-400' },
  Critical: { badge: 'bg-red-100 text-red-700', border: 'border-l-red-400' },
  'Post-Op': { badge: 'bg-amber-100 text-amber-700', border: 'border-l-amber-400' },
}

export function DoctorWardManagement() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inpatient Ward</h1>
          <p className="text-sm text-slate-500 mt-0.5">My admitted patients — 10-bed ward</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2 h-9">
          <Plus className="h-4 w-4" /> Admit Patient
        </Button>
      </div>

      {/* Ward Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <BedDouble className="h-8 w-8 text-blue-400" />
            <div><p className="text-2xl font-bold text-blue-700">{wardPatients.length}</p><p className="text-xs text-blue-500">My Patients</p></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <div><p className="text-2xl font-bold text-red-700">{wardPatients.filter(p => p.condition === 'Critical').length}</p><p className="text-xs text-red-500">Critical</p></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-amber-400" />
            <div><p className="text-2xl font-bold text-amber-700">{wardPatients.reduce((s, p) => s + p.pendingTests.length, 0)}</p><p className="text-xs text-amber-500">Pending Tests</p></div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-8 w-8 text-emerald-400" />
            <div><p className="text-2xl font-bold text-emerald-700">2</p><p className="text-xs text-emerald-500">Ready to Discharge</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Cards */}
      <div className="space-y-4">
        {wardPatients.map((p) => {
          const style = CONDITION_STYLES[p.condition] ?? CONDITION_STYLES.Stable
          const isExp = expanded === p.bedId
          return (
            <Card key={p.bedId} className={`border-0 shadow-sm border-l-4 ${style.border}`}>
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{p.bed}</span>
                        <h3 className="font-bold text-slate-800">{p.patient}</h3>
                        <span className="text-xs text-slate-400">{p.age} yrs</span>
                        <Badge className={`text-xs border-0 ${style.badge}`}>{p.condition}</Badge>
                        {p.condition === 'Critical' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                      <p className="text-sm text-slate-600">Diagnosis: <span className="font-medium">{p.diagnosis}</span></p>
                      <p className="text-xs text-slate-400">Admitted: {p.admission} · Day {p.days}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Quick Vitals */}
                    <div className="hidden lg:flex items-center gap-4 text-xs mr-3">
                      {[
                        { label: 'Temp', value: p.lastVitals.temp, alert: parseFloat(p.lastVitals.temp) > 100 },
                        { label: 'BP', value: p.lastVitals.bp, alert: false },
                        { label: 'HR', value: p.lastVitals.hr + ' bpm', alert: parseInt(p.lastVitals.hr) > 100 },
                        { label: 'SpO₂', value: p.lastVitals.spo2, alert: parseInt(p.lastVitals.spo2) < 94 },
                      ].map(v => (
                        <div key={v.label} className="text-center">
                          <p className="text-[9px] text-slate-400 uppercase">{v.label}</p>
                          <p className={`font-bold ${v.alert ? 'text-red-600' : 'text-slate-700'}`}>{v.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs gap-1"
                        onClick={() => setExpanded(isExp ? null : p.bedId)}>
                        <Eye className="h-3.5 w-3.5" />
                        {isExp ? 'Collapse' : 'Details'}
                      </Button>
                      <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() => toast.success(`Update saved for ${p.patient}`)}>
                        Update
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExp && (
                  <div className="px-5 py-4 grid grid-cols-3 gap-6">
                    {/* Medications */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Current Medications</p>
                      <ul className="space-y-1.5">
                        {p.medications.map((m, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="text-blue-400 mt-0.5">•</span> {m}
                          </li>
                        ))}
                      </ul>
                      <Button size="sm" variant="outline" className="mt-3 h-7 text-xs w-full"
                        onClick={() => toast.info('Add medication')}>
                        + Add Medication
                      </Button>
                    </div>

                    {/* Pending Tests */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Pending Tests</p>
                      {p.pendingTests.length === 0 ? (
                        <p className="text-sm text-slate-400">No pending tests</p>
                      ) : (
                        <ul className="space-y-1.5">
                          {p.pendingTests.map((t, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                              <span className="h-1.5 w-1.5 bg-amber-500 rounded-full flex-shrink-0" /> {t}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button size="sm" variant="outline" className="mt-3 h-7 text-xs w-full text-amber-600 border-amber-200"
                        onClick={() => toast.success('Lab order created')}>
                        + Order Test
                      </Button>
                    </div>

                    {/* Doctor Notes */}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Doctor Notes</p>
                      <div className={`p-3 rounded-lg text-sm ${p.condition === 'Critical' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-slate-50 border border-slate-200 text-slate-700'}`}>
                        {p.notes}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="h-7 text-xs flex-1"
                          onClick={() => toast.info('Discharge summary opened')}>
                          Discharge
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs flex-1 text-blue-600 border-blue-200"
                          onClick={() => toast.info('Transfer initiated')}>
                          Transfer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
