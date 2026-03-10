'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Thermometer, HeartPulse, Activity, Clock, CheckCircle, Send, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

const queue = [
  { token: 'A04', name: 'Priya Sharma', age: 32, symptoms: 'Fever, Headache', time: '10:15 AM', status: 'waiting' },
  { token: 'A05', name: 'Rajan Mehta', age: 58, symptoms: 'Chest Pain', time: '10:30 AM', status: 'waiting', urgent: true },
  { token: 'A06', name: 'Kavitha Nair', age: 24, symptoms: 'Cold, Cough', time: '10:45 AM', status: 'waiting' },
  { token: 'A07', name: 'Suresh Iyer', age: 45, symptoms: 'Diabetes Follow-up', time: '11:00 AM', status: 'done' },
]

export function NurseVitalsEntry() {
  const [selected, setSelected] = useState<typeof queue[0] | null>(null)
  const [vitals, setVitals] = useState({
    temperature: '',
    bp_systolic: '',
    bp_diastolic: '',
    heart_rate: '',
    spo2: '',
    height: '',
    weight: '',
  })
  const [saved, setSaved] = useState(false)

  function handleSelect(p: typeof queue[0]) {
    setSelected(p)
    setSaved(false)
    setVitals({ temperature: '', bp_systolic: '', bp_diastolic: '', heart_rate: '', spo2: '', height: '', weight: '' })
  }

  function handleSave() {
    if (!vitals.temperature || !vitals.heart_rate) {
      toast.error('Please fill in at least Temperature and Heart Rate')
      return
    }
    setSaved(true)
    toast.success(`Vitals saved for ${selected?.name}`)
  }

  function handleSendToDoctor() {
    setSaved(false)
    setSelected(null)
    toast.success(`${selected?.name} sent to Doctor Queue`)
  }

  const bmi = vitals.height && vitals.weight
    ? (parseFloat(vitals.weight) / ((parseFloat(vitals.height) / 100) ** 2)).toFixed(1)
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Vitals Entry</h1>
        <p className="text-sm text-slate-500 mt-0.5">Select a patient from the queue to record vitals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Queue List */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-800">Waiting Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {queue.map((p) => (
                  <button
                    key={p.token}
                    onClick={() => p.status !== 'done' && handleSelect(p)}
                    className={`w-full text-left px-4 py-3 transition-colors hover:bg-slate-50 ${selected?.token === p.token ? 'bg-purple-50 border-r-2 border-purple-500' : ''} ${p.status === 'done' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">{p.token}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.age} yrs · {p.symptoms}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {p.status === 'done' ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : p.urgent ? (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">Urgent</Badge>
                        ) : null}
                        <span className="text-[10px] text-slate-400">{p.time}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vitals Form */}
        <div className="lg:col-span-2">
          {selected ? (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4 bg-purple-50 rounded-t-xl border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">{selected.name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Token <span className="font-semibold text-purple-700">{selected.token}</span> · Age {selected.age} · {selected.symptoms}
                    </p>
                  </div>
                  {selected.urgent && <Badge variant="destructive">URGENT</Badge>}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Temperature */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <Thermometer className="h-4 w-4 text-orange-500" /> Temperature (°F)
                    </Label>
                    <Input
                      type="number"
                      placeholder="98.6"
                      value={vitals.temperature}
                      onChange={(e) => setVitals(v => ({ ...v, temperature: e.target.value }))}
                      className="h-10"
                    />
                  </div>

                  {/* Heart Rate */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <HeartPulse className="h-4 w-4 text-red-500" /> Heart Rate (bpm)
                    </Label>
                    <Input
                      type="number"
                      placeholder="72"
                      value={vitals.heart_rate}
                      onChange={(e) => setVitals(v => ({ ...v, heart_rate: e.target.value }))}
                      className="h-10"
                    />
                  </div>

                  {/* Blood Pressure */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700">Blood Pressure (mmHg)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="120 (Sys)"
                        value={vitals.bp_systolic}
                        onChange={(e) => setVitals(v => ({ ...v, bp_systolic: e.target.value }))}
                        className="h-10"
                      />
                      <span className="text-slate-400 text-sm">/</span>
                      <Input
                        type="number"
                        placeholder="80 (Dia)"
                        value={vitals.bp_diastolic}
                        onChange={(e) => setVitals(v => ({ ...v, bp_diastolic: e.target.value }))}
                        className="h-10"
                      />
                    </div>
                  </div>

                  {/* SpO2 */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                      <Activity className="h-4 w-4 text-blue-500" /> SpO₂ (%)
                    </Label>
                    <Input
                      type="number"
                      placeholder="98"
                      value={vitals.spo2}
                      onChange={(e) => setVitals(v => ({ ...v, spo2: e.target.value }))}
                      className="h-10"
                    />
                  </div>

                  {/* Height */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700">Height (cm)</Label>
                    <Input
                      type="number"
                      placeholder="165"
                      value={vitals.height}
                      onChange={(e) => setVitals(v => ({ ...v, height: e.target.value }))}
                      className="h-10"
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700">Weight (kg)</Label>
                    <Input
                      type="number"
                      placeholder="65"
                      value={vitals.weight}
                      onChange={(e) => setVitals(v => ({ ...v, weight: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                </div>

                {/* BMI display */}
                {bmi && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg flex items-center gap-3">
                    <span className="text-sm text-slate-600 font-medium">Calculated BMI:</span>
                    <span className={`text-lg font-bold ${parseFloat(bmi) < 18.5 ? 'text-blue-600' : parseFloat(bmi) < 25 ? 'text-emerald-600' : parseFloat(bmi) < 30 ? 'text-amber-600' : 'text-red-600'}`}>
                      {bmi}
                    </span>
                    <span className="text-xs text-slate-400">
                      {parseFloat(bmi) < 18.5 ? 'Underweight' : parseFloat(bmi) < 25 ? 'Normal' : parseFloat(bmi) < 30 ? 'Overweight' : 'Obese'}
                    </span>
                  </div>
                )}

                {/* Vitals Summary after save */}
                {saved && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-800">Vitals Recorded Successfully</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      {vitals.temperature && <VitalChip label="Temp" value={`${vitals.temperature}°F`} />}
                      {vitals.heart_rate && <VitalChip label="HR" value={`${vitals.heart_rate} bpm`} />}
                      {vitals.bp_systolic && <VitalChip label="BP" value={`${vitals.bp_systolic}/${vitals.bp_diastolic}`} />}
                      {vitals.spo2 && <VitalChip label="SpO₂" value={`${vitals.spo2}%`} />}
                      {bmi && <VitalChip label="BMI" value={bmi} />}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="mt-5 flex gap-3">
                  <Button
                    onClick={handleSave}
                    className="bg-purple-600 hover:bg-purple-700 gap-2"
                    disabled={saved}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Save Vitals
                  </Button>
                  <Button
                    onClick={handleSendToDoctor}
                    variant="outline"
                    className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                    disabled={!saved}
                  >
                    <Send className="h-4 w-4" />
                    Send to Doctor
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-80 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <div className="text-center">
                <Thermometer className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                <p className="font-medium text-slate-500">Select a patient from the queue</p>
                <p className="text-sm text-slate-400 mt-1">to start recording vitals</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VitalChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg p-2 border border-emerald-100 text-center">
      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  )
}
