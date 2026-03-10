'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HeartPulse, Thermometer, Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const patients = [
  {
    bed: 'Bed 1', name: 'Ravi Kumar', age: 35, diagnosis: 'Dengue Fever', doctor: 'Dr. Kumar',
    vitals: { temp: '101.2°F', bp: '118/76', hr: '92', spo2: '97%', lastUpdated: '30 min ago' },
    condition: 'Stable', alerts: ['Elevated temperature - monitor closely'],
    medications: ['Paracetamol 500mg × 3/day', 'ORS × 2L/day'],
  },
  {
    bed: 'Bed 3', name: 'Meena Lakshmi', age: 28, diagnosis: 'Typhoid', doctor: 'Dr. Priya',
    vitals: { temp: '99.8°F', bp: '110/70', hr: '78', spo2: '98%', lastUpdated: '1 hour ago' },
    condition: 'Improving', alerts: [],
    medications: ['Ciprofloxacin 500mg × 2/day', 'IV Fluids 1L'],
  },
  {
    bed: 'Bed 5', name: 'Ahmed Khan', age: 52, diagnosis: 'Fracture (Rt. Leg)', doctor: 'Dr. Ahmed',
    vitals: { temp: '98.6°F', bp: '130/85', hr: '80', spo2: '99%', lastUpdated: '2 hours ago' },
    condition: 'Post-Op', alerts: ['Pain management — check VAS score'],
    medications: ['Tramadol 50mg × PRN', 'Cefazolin 1g × IV'],
  },
  {
    bed: 'Bed 7', name: 'Sita Devi', age: 65, diagnosis: 'Pneumonia', doctor: 'Dr. Kumar',
    vitals: { temp: '103.1°F', bp: '95/60', hr: '108', spo2: '91%', lastUpdated: '15 min ago' },
    condition: 'Critical', alerts: ['CRITICAL: Low SpO₂ — notify doctor immediately', 'High fever persisting'],
    medications: ['O₂ therapy 4L/min', 'Piperacillin IV', 'Hydrocortisone 100mg'],
  },
]

const CONDITION_COLORS: Record<string, string> = {
  Stable: 'bg-emerald-100 text-emerald-700',
  Improving: 'bg-blue-100 text-blue-700',
  Critical: 'bg-red-100 text-red-700',
  'Post-Op': 'bg-amber-100 text-amber-700',
}

export function NurseMonitoring() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Patient Monitoring</h1>
        <p className="text-sm text-slate-500 mt-0.5">Real-time ward patient monitoring dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {patients.map((p) => (
          <Card key={p.bed} className={`border-0 shadow-sm ${p.condition === 'Critical' ? 'ring-2 ring-red-400' : ''}`}>
            <CardHeader className={`pb-3 rounded-t-xl ${p.condition === 'Critical' ? 'bg-red-50' : 'bg-slate-50'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border">{p.bed}</span>
                    <Badge className={`text-xs ${CONDITION_COLORS[p.condition]} border-0`}>{p.condition}</Badge>
                    {p.condition === 'Critical' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  </div>
                  <CardTitle className="text-base font-bold text-slate-800">{p.name}</CardTitle>
                  <p className="text-xs text-slate-500">{p.age} yrs · {p.diagnosis} · {p.doctor}</p>
                </div>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {p.vitals.lastUpdated}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Vitals Row */}
              <div className="grid grid-cols-5 gap-2">
                <VitalTile icon={<Thermometer className="h-3.5 w-3.5" />} label="Temp" value={p.vitals.temp}
                  alert={parseFloat(p.vitals.temp) > 100} />
                <VitalTile icon={<Activity className="h-3.5 w-3.5" />} label="BP" value={p.vitals.bp} />
                <VitalTile icon={<HeartPulse className="h-3.5 w-3.5" />} label="HR" value={p.vitals.hr + ' bpm'}
                  alert={parseInt(p.vitals.hr) > 100} />
                <VitalTile icon={<Activity className="h-3.5 w-3.5" />} label="SpO₂" value={p.vitals.spo2}
                  alert={parseInt(p.vitals.spo2) < 94} />
                <div className="bg-slate-50 rounded-lg p-2 text-center border border-slate-200">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-1">Status</p>
                  <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto" />
                </div>
              </div>

              {/* Alerts */}
              {p.alerts.length > 0 && (
                <div className="space-y-1.5">
                  {p.alerts.map((alert, i) => (
                    <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg text-xs ${alert.startsWith('CRITICAL') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                      {alert}
                    </div>
                  ))}
                </div>
              )}

              {/* Medications */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Current Medications</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.medications.map((med, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 text-[11px] px-2 py-1 rounded-md border border-blue-100">{med}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700"
                  onClick={() => toast.success('Vitals recorded')}>
                  Update Vitals
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs"
                  onClick={() => toast.info('Nurse notes opened')}>
                  Add Note
                </Button>
                {p.condition === 'Critical' && (
                  <Button size="sm" variant="outline" className="h-7 text-xs border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => toast.error('Alert sent to doctor!')}>
                    Alert Doctor
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function VitalTile({ icon, label, value, alert }: { icon: React.ReactNode; label: string; value: string; alert?: boolean }) {
  return (
    <div className={`rounded-lg p-2 text-center border ${alert ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
      <div className={`flex justify-center mb-0.5 ${alert ? 'text-red-500' : 'text-slate-400'}`}>{icon}</div>
      <p className="text-[9px] text-slate-400 uppercase tracking-wide">{label}</p>
      <p className={`text-[11px] font-bold ${alert ? 'text-red-700' : 'text-slate-800'}`}>{value}</p>
    </div>
  )
}
