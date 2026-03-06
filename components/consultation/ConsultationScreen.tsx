'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Appointment, Profile, Consultation, ExtractedSymptom, DiagnosisSuggestion } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { VoiceInputPanel } from './VoiceInputPanel'
import { toast } from 'sonner'
import { cn, getRiskBadgeColor } from '@/lib/utils'
import {
  User, Mic, Brain, Pill, FlaskConical,
  CheckCircle2, Loader2, ArrowRight, Save, AlertTriangle
} from 'lucide-react'

interface Props {
  appointment: Appointment
  doctorProfile: Profile
  existingConsultation: Consultation | null
}

const RECOMMENDED_TESTS_MAP: Record<string, string[]> = {
  'Viral Fever': ['CBC', 'CRP', 'ESR'],
  'Dengue Fever': ['CBC', 'Dengue NS1 Antigen', 'Dengue IgM/IgG'],
  'Typhoid': ['Widal Test', 'Blood Culture', 'CBC'],
  'Hypertension': ['ECG', 'Kidney Function Test', 'Lipid Profile'],
  'Diabetes': ['Fasting Blood Sugar', 'HbA1c', 'Urine Routine'],
  'Malaria': ['Peripheral Blood Smear', 'Malaria Antigen Test'],
  'Pneumonia': ['Chest X-Ray', 'CBC', 'Sputum Culture'],
}

export function ConsultationScreen({ appointment, doctorProfile, existingConsultation }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const patient = appointment.patient!

  const [transcript, setTranscript] = useState(existingConsultation?.voice_transcript ?? '')
  const [symptoms, setSymptoms] = useState<ExtractedSymptom[]>(existingConsultation?.extracted_symptoms ?? [])
  const [diagnoses, setDiagnoses] = useState<DiagnosisSuggestion[]>(existingConsultation?.diagnosis_suggestions ?? [])
  const [finalDiagnosis, setFinalDiagnosis] = useState(existingConsultation?.final_diagnosis ?? '')
  const [aiExplanation, setAiExplanation] = useState(existingConsultation?.ai_explanation ?? '')
  const [recommendedTests, setRecommendedTests] = useState<string[]>(existingConsultation?.recommended_tests ?? [])
  const [doctorNotes, setDoctorNotes] = useState(existingConsultation?.doctor_notes ?? '')

  const [extractingSymptoms, setExtractingSymptoms] = useState(false)
  const [suggestingDiagnosis, setSuggestingDiagnosis] = useState(false)
  const [saving, setSaving] = useState(false)

  async function extractSymptoms(text: string) {
    if (!text.trim()) return
    setExtractingSymptoms(true)
    try {
      const res = await fetch('/api/ai/extract-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text }),
      })
      const data = await res.json()
      setSymptoms(data.symptoms ?? [])
    } catch {
      toast.error('Failed to extract symptoms')
    } finally {
      setExtractingSymptoms(false)
    }
  }

  async function getDiagnosis() {
    if (symptoms.length === 0) {
      toast.error('Extract symptoms first')
      return
    }
    setSuggestingDiagnosis(true)
    try {
      const res = await fetch('/api/ai/suggest-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          patientAge: patient.age,
          patientGender: patient.gender,
          chronicConditions: patient.chronic_conditions,
          allergies: patient.allergies,
        }),
      })
      const data = await res.json()
      const diagnosisList: DiagnosisSuggestion[] = data.diagnoses ?? []
      setDiagnoses(diagnosisList)

      if (diagnosisList.length > 0) {
        const top = diagnosisList[0]
        setFinalDiagnosis(top.condition)
        setAiExplanation(top.explanation)
        const tests = RECOMMENDED_TESTS_MAP[top.condition] ?? ['CBC', 'Urine Routine']
        setRecommendedTests(tests)
      }
    } catch {
      toast.error('Failed to get diagnosis suggestion')
    } finally {
      setSuggestingDiagnosis(false)
    }
  }

  async function saveConsultation() {
    setSaving(true)
    try {
      const consultationData = {
        patient_id: patient.id,
        doctor_id: doctorProfile.id,
        appointment_id: appointment.id,
        voice_transcript: transcript,
        extracted_symptoms: symptoms,
        diagnosis_suggestions: diagnoses,
        final_diagnosis: finalDiagnosis,
        ai_explanation: aiExplanation,
        recommended_tests: recommendedTests,
        doctor_notes: doctorNotes,
        status: 'completed',
      }

      if (existingConsultation) {
        await supabase.from('consultations').update(consultationData).eq('id', existingConsultation.id)
      } else {
        await supabase.from('consultations').insert(consultationData)
      }

      await supabase
        .from('appointments')
        .update({ status: 'completed' })
        .eq('id', appointment.id)

      toast.success('Consultation saved successfully')
      router.push(`/dashboard/doctor/prescriptions/new?appointmentId=${appointment.id}&patientId=${patient.id}&diagnosis=${encodeURIComponent(finalDiagnosis)}`)
    } catch {
      toast.error('Failed to save consultation')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Patient Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">AI Consultation Assistant</h1>
          <p className="text-slate-500 text-sm">
            Token #{appointment.token_number} · {appointment.time_slot}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold text-slate-800">{patient.full_name}</p>
            <p className="text-sm text-slate-500">{patient.age} yrs · {patient.gender} · {patient.blood_group}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Patient alerts */}
      {(patient.allergies?.length > 0 || patient.chronic_conditions?.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {patient.allergies?.map(a => (
            <Badge key={a} variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" /> Allergy: {a}
            </Badge>
          ))}
          {patient.chronic_conditions?.map(c => (
            <Badge key={c} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
              {c}
            </Badge>
          ))}
          <Badge variant="outline" className={cn('text-xs', getRiskBadgeColor(patient.risk_level))}>
            Risk: {patient.risk_level}
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Voice Input */}
          <VoiceInputPanel
            transcript={transcript}
            onTranscriptChange={setTranscript}
            onExtractSymptoms={extractSymptoms}
            isExtracting={extractingSymptoms}
          />

          {/* Extracted Symptoms */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <CardTitle className="text-sm font-semibold text-slate-700">Extracted Symptoms</CardTitle>
              {extractingSymptoms && <Loader2 className="h-3 w-3 animate-spin text-purple-400 ml-auto" />}
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {symptoms.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Record voice or type transcript, then extract symptoms
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((s, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
                    >
                      {s.symptom}
                      {s.duration ? ` · ${s.duration}` : ''}
                      {s.severity ? ` · ${s.severity}` : ''}
                    </Badge>
                  ))}
                </div>
              )}
              {symptoms.length > 0 && (
                <Button
                  size="sm"
                  className="mt-3 h-7 text-xs bg-purple-600 hover:bg-purple-700"
                  onClick={getDiagnosis}
                  disabled={suggestingDiagnosis}
                >
                  {suggestingDiagnosis ? (
                    <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Brain className="h-3 w-3 mr-1" /> Get AI Diagnosis</>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Doctor Notes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">Doctor&apos;s Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <Textarea
                placeholder="Add additional observations, examination findings..."
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="text-sm min-h-[80px] resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Diagnosis Suggestions */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-sm font-semibold text-slate-700">Suggested Diagnosis</CardTitle>
              {suggestingDiagnosis && <Loader2 className="h-3 w-3 animate-spin text-blue-400 ml-auto" />}
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-3">
              {diagnoses.length === 0 ? (
                <p className="text-xs text-slate-400 italic">AI diagnosis will appear here after symptom extraction</p>
              ) : (
                diagnoses.map((d, i) => (
                  <div
                    key={i}
                    className={cn(
                      'p-3 rounded-lg border cursor-pointer transition-all',
                      finalDiagnosis === d.condition
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    )}
                    onClick={() => {
                      setFinalDiagnosis(d.condition)
                      setAiExplanation(d.explanation)
                      setRecommendedTests(RECOMMENDED_TESTS_MAP[d.condition] ?? ['CBC'])
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-sm text-slate-800">{d.condition}</span>
                      <span className="text-sm font-bold text-blue-600">{d.probability}%</span>
                    </div>
                    <Progress value={d.probability} className="h-1.5 mb-1.5" />
                    <p className="text-xs text-slate-500">{d.explanation}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* AI Explanation */}
          {aiExplanation && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">AI Reasoning</p>
                <p className="text-xs text-blue-600">{aiExplanation}</p>
              </CardContent>
            </Card>
          )}

          {/* Recommended Tests */}
          {recommendedTests.length > 0 && (
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center gap-2">
                <FlaskConical className="h-4 w-4 text-teal-500" />
                <CardTitle className="text-sm font-semibold text-slate-700">Recommended Tests</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="space-y-1.5">
                  {recommendedTests.map((test, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-500 flex-shrink-0" />
                      <span className="text-slate-700">{test}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Separator />
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={saveConsultation}
              disabled={saving || !finalDiagnosis}
            >
              {saving ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save className="h-4 w-4 mr-2" /> Save & Go to Prescription</>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/doctor')}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Pill className="h-3 w-3" />
            After saving, you&apos;ll be taken to the prescription generator
          </p>
        </div>
      </div>
    </div>
  )
}
