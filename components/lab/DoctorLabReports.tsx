'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LabReport, LabValue } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { formatDate, cn } from '@/lib/utils'
import { toast } from 'sonner'
import { FlaskConical, Upload, Brain, Loader2, ExternalLink, AlertTriangle, Plus } from 'lucide-react'

interface Patient { id: string; full_name: string; patient_code: string }

interface Props {
  reports: LabReport[]
  patients: Patient[]
}

const statusColors: Record<string, string> = {
  normal: 'bg-green-100 text-green-700 border-green-200',
  high: 'bg-red-100 text-red-700 border-red-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  critical: 'bg-red-200 text-red-800 border-red-300',
}

export function DoctorLabReports({ reports: initialReports, patients }: Props) {
  const supabase = createClient()
  const [reports, setReports] = useState(initialReports)
  const [showUpload, setShowUpload] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState('')
  const [manualValues, setManualValues] = useState<LabValue[]>([
    { test_name: '', value: '', unit: '', normal_range: '', status: 'normal' },
  ])
  const [analyzing, setAnalyzing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fileName, setFileName] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  function addRow() {
    setManualValues(prev => [...prev, { test_name: '', value: '', unit: '', normal_range: '', status: 'normal' }])
  }

  function updateRow(i: number, field: keyof LabValue, value: string) {
    setManualValues(prev => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row))
  }

  async function analyzeAndSave() {
    if (!selectedPatient) { toast.error('Select a patient'); return }
    if (!fileName.trim()) { toast.error('Enter a report name'); return }
    const validRows = manualValues.filter(r => r.test_name.trim() && r.value.trim())
    if (!validRows.length) { toast.error('Enter at least one test value'); return }

    setAnalyzing(true)
    let aiSummary = ''
    try {
      const res = await fetch('/api/ai/analyze-lab-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extractedValues: validRows }),
      })
      const data = await res.json()
      aiSummary = data.summary ?? ''
    } catch {
      toast.warning('AI analysis failed, saving without summary')
    } finally {
      setAnalyzing(false)
    }

    setSaving(true)
    try {
      const { data, error } = await supabase.from('lab_reports').insert({
        patient_id: selectedPatient,
        file_url: '',
        file_name: fileName,
        extracted_values: validRows,
        ai_summary: aiSummary,
      }).select('*, patient:patients(full_name, patient_code)').single()

      if (error) throw error
      setReports(prev => [data, ...prev])
      toast.success('Lab report saved with AI analysis!')
      setShowUpload(false)
      setManualValues([{ test_name: '', value: '', unit: '', normal_range: '', status: 'normal' }])
      setFileName('')
      setSelectedPatient('')
    } catch {
      toast.error('Failed to save report')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Lab Reports</h1>
          <p className="text-slate-500 text-sm">{reports.length} reports on file</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowUpload(!showUpload)}>
          <Upload className="h-4 w-4 mr-2" /> Enter Lab Report
        </Button>
      </div>

      {/* Enter Lab Report Panel */}
      {showUpload && (
        <Card className="border-teal-200 bg-teal-50/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-teal-700 flex items-center gap-2">
              <FlaskConical className="h-4 w-4" /> Enter Lab Values
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Patient *</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger className="h-9 text-sm bg-white"><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.full_name} · {p.patient_code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Report Name *</Label>
                <Input
                  placeholder="e.g. CBC Blood Test"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  className="h-9 text-sm bg-white"
                />
              </div>
            </div>

            {/* Values table */}
            <div>
              <div className="grid grid-cols-12 gap-2 mb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <div className="col-span-3">Test Name</div>
                <div className="col-span-2">Value</div>
                <div className="col-span-2">Unit</div>
                <div className="col-span-3">Normal Range</div>
                <div className="col-span-2">Status</div>
              </div>
              <div className="space-y-2">
                {manualValues.map((row, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2">
                    <Input placeholder="Hemoglobin" value={row.test_name} onChange={e => updateRow(i, 'test_name', e.target.value)} className="col-span-3 h-8 text-xs bg-white" />
                    <Input placeholder="13.5" value={row.value} onChange={e => updateRow(i, 'value', e.target.value)} className="col-span-2 h-8 text-xs bg-white" />
                    <Input placeholder="g/dL" value={row.unit} onChange={e => updateRow(i, 'unit', e.target.value)} className="col-span-2 h-8 text-xs bg-white" />
                    <Input placeholder="12-17" value={row.normal_range} onChange={e => updateRow(i, 'normal_range', e.target.value)} className="col-span-3 h-8 text-xs bg-white" />
                    <Select value={row.status} onValueChange={v => updateRow(i, 'status', v)}>
                      <SelectTrigger className="col-span-2 h-8 text-xs bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-2 h-7 text-xs" onClick={addRow}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Row
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={analyzeAndSave}
                disabled={analyzing || saving}
              >
                {analyzing ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />AI Analyzing...</>
                ) : saving ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  <><Brain className="h-4 w-4 mr-2" />Analyze & Save</>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      <div className="space-y-3">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="flex items-center gap-3 p-6 text-slate-400">
              <FlaskConical className="h-6 w-6" />
              <p className="text-sm">No lab reports yet. Enter values above.</p>
            </CardContent>
          </Card>
        ) : (
          reports.map(r => {
            const abnormal = r.extracted_values?.filter(
              (v: LabValue) => v.status !== 'normal'
            ) ?? []
            const patient = r.patient as { full_name?: string; patient_code?: string } | undefined
            const isExpanded = expandedId === r.id

            return (
              <Card key={r.id} className={abnormal.length > 0 ? 'border-orange-200' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <FlaskConical className="h-4 w-4 text-teal-500" />
                        <span className="font-semibold text-sm text-slate-800">{r.file_name}</span>
                        {patient && (
                          <span className="text-xs text-blue-600 font-mono">{patient.patient_code}</span>
                        )}
                        {abnormal.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 gap-1">
                            <AlertTriangle className="h-3 w-3" />{abnormal.length} abnormal
                          </Badge>
                        )}
                        {r.ai_summary && (
                          <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200 gap-1">
                            <Brain className="h-3 w-3" />AI
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {patient?.full_name} · {formatDate(r.uploaded_at)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
                    >
                      {isExpanded ? 'Hide' : 'View'}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      {r.ai_summary && (
                        <div className="p-2.5 bg-teal-50 rounded border border-teal-200">
                          <p className="text-xs font-semibold text-teal-700 mb-1">AI Interpretation</p>
                          <p className="text-xs text-teal-600">{r.ai_summary}</p>
                        </div>
                      )}
                      {r.extracted_values?.length > 0 && (
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500">
                              <th className="px-2 py-1.5 text-left font-semibold">Test</th>
                              <th className="px-2 py-1.5 text-left font-semibold">Value</th>
                              <th className="px-2 py-1.5 text-left font-semibold">Normal</th>
                              <th className="px-2 py-1.5 text-left font-semibold">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {r.extracted_values.map((v: LabValue, i: number) => (
                              <tr key={i} className={v.status !== 'normal' ? 'bg-red-50/50' : ''}>
                                <td className="px-2 py-1.5 font-medium">{v.test_name}</td>
                                <td className="px-2 py-1.5">{v.value} {v.unit}</td>
                                <td className="px-2 py-1.5 text-slate-400">{v.normal_range}</td>
                                <td className="px-2 py-1.5">
                                  <Badge variant="outline" className={cn('text-xs capitalize', statusColors[v.status])}>
                                    {v.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
