'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Profile, Patient, Medicine, DrugInteraction } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Pill, Plus, Trash2, Wand2, AlertTriangle, CheckCircle2,
  Download, Share2, Loader2, User, Stethoscope
} from 'lucide-react'

interface Props {
  doctorProfile: Profile
  patient: Patient
  diagnosis: string
  consultationId: string | null
}

const emptyMedicine = (): Medicine => ({
  name: '',
  dosage: '',
  frequency: '',
  duration: '',
  generic_alt: null,
  instructions: null,
})

export function PrescriptionGenerator({ doctorProfile, patient, diagnosis, consultationId }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [medicines, setMedicines] = useState<Medicine[]>([emptyMedicine()])
  const [interactions, setInteractions] = useState<DrugInteraction[]>([])
  const [allergyAlerts, setAllergyAlerts] = useState<string[]>([])
  const [loadingAI, setLoadingAI] = useState(false)
  const [checkingInteractions, setCheckingInteractions] = useState(false)
  const [saving, setSaving] = useState(false)

  function updateMedicine(index: number, field: keyof Medicine, value: string) {
    setMedicines(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m))
  }

  function addMedicine() {
    setMedicines(prev => [...prev, emptyMedicine()])
  }

  function removeMedicine(index: number) {
    setMedicines(prev => prev.filter((_, i) => i !== index))
  }

  async function getSuggestedMedicines() {
    if (!diagnosis) {
      toast.error('No diagnosis set')
      return
    }
    setLoadingAI(true)
    try {
      const res = await fetch('/api/ai/suggest-medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosis,
          allergies: patient.allergies,
          patientAge: patient.age,
          chronicConditions: patient.chronic_conditions,
        }),
      })
      const data = await res.json()
      if (data.medicines?.length) {
        setMedicines(data.medicines)
        toast.success('AI medicine suggestions loaded')
        await checkInteractions(data.medicines)
      }
    } catch {
      toast.error('Failed to get medicine suggestions')
    } finally {
      setLoadingAI(false)
    }
  }

  async function checkInteractions(meds?: Medicine[]) {
    const list = meds ?? medicines
    const named = list.filter(m => m.name.trim())
    if (named.length < 2) return

    setCheckingInteractions(true)
    try {
      const res = await fetch('/api/ai/check-drug-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines: named }),
      })
      const data = await res.json()
      setInteractions(data.interactions ?? [])

      // Check allergy conflicts
      const alerts: string[] = []
      named.forEach(m => {
        patient.allergies?.forEach(allergy => {
          if (m.name.toLowerCase().includes(allergy.toLowerCase())) {
            alerts.push(`${m.name} may conflict with known allergy: ${allergy}`)
          }
        })
      })
      setAllergyAlerts(alerts)
    } catch {
      toast.error('Failed to check drug interactions')
    } finally {
      setCheckingInteractions(false)
    }
  }

  async function savePrescription() {
    const validMeds = medicines.filter(m => m.name.trim())
    if (!validMeds.length) {
      toast.error('Add at least one medicine')
      return
    }

    setSaving(true)
    try {
      const { data, error } = await supabase.from('prescriptions').insert({
        consultation_id: consultationId,
        patient_id: patient.id,
        doctor_id: doctorProfile.id,
        medicines: validMeds,
        interaction_warnings: interactions,
        allergy_alerts: allergyAlerts,
      }).select().single()

      if (error) throw error

      toast.success('Prescription saved!')
      router.push(`/dashboard/doctor/prescriptions/${data.id}`)
    } catch {
      toast.error('Failed to save prescription')
    } finally {
      setSaving(false)
    }
  }

  const hasWarnings = interactions.length > 0 || allergyAlerts.length > 0
  const highSeverityCount = interactions.filter(i => i.severity === 'high').length

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Prescription Generator</h1>
          <p className="text-slate-500 text-sm">Diagnosis: <span className="font-medium text-blue-700">{diagnosis || 'Not set'}</span></p>
        </div>
        <div className="flex items-center gap-2 text-right">
          <div>
            <p className="font-semibold text-slate-800">{patient.full_name}</p>
            <p className="text-xs text-slate-500">{patient.age}y · {patient.blood_group}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-full">
            <User className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Allergy Banner */}
      {patient.allergies?.length > 0 && (
        <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700">
            <span className="font-semibold">Known allergies:</span> {patient.allergies.join(', ')}
          </p>
        </div>
      )}

      {/* Warnings */}
      {hasWarnings && (
        <div className="space-y-2">
          {allergyAlerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 bg-red-50 border-l-4 border-l-red-500 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-700">{alert}</p>
            </div>
          ))}
          {interactions.map((interaction, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-2 p-2.5 border-l-4 rounded-lg',
                interaction.severity === 'high' ? 'border-l-red-500 bg-red-50' :
                interaction.severity === 'moderate' ? 'border-l-orange-500 bg-orange-50' :
                'border-l-yellow-500 bg-yellow-50'
              )}
            >
              <AlertTriangle className={cn(
                'h-4 w-4 flex-shrink-0 mt-0.5',
                interaction.severity === 'high' ? 'text-red-500' :
                interaction.severity === 'moderate' ? 'text-orange-500' : 'text-yellow-500'
              )} />
              <div>
                <p className="text-xs font-semibold text-slate-700">{interaction.drug_pair}</p>
                <p className="text-xs text-slate-600">{interaction.message}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'ml-auto text-xs capitalize flex-shrink-0',
                  interaction.severity === 'high' ? 'bg-red-100 text-red-700' :
                  interaction.severity === 'moderate' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                )}
              >
                {interaction.severity}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Medicine Table */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base font-semibold text-slate-800">Medicines</CardTitle>
            {highSeverityCount > 0 && (
              <Badge className="bg-red-100 text-red-700 text-xs">
                {highSeverityCount} interaction{highSeverityCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            className="h-8 text-xs bg-purple-600 hover:bg-purple-700"
            onClick={getSuggestedMedicines}
            disabled={loadingAI}
          >
            {loadingAI ? (
              <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Getting suggestions...</>
            ) : (
              <><Wand2 className="h-3.5 w-3.5 mr-1.5" /> AI Suggest Medicines</>
            )}
          </Button>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {/* Column Headers */}
          <div className="grid grid-cols-12 gap-2 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <div className="col-span-3">Medicine</div>
            <div className="col-span-2">Dosage</div>
            <div className="col-span-2">Frequency</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-2">Generic Alt.</div>
            <div className="col-span-1" />
          </div>

          <div className="space-y-2">
            {medicines.map((med, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-3">
                  <Input
                    placeholder="Paracetamol"
                    value={med.name}
                    onChange={(e) => updateMedicine(i, 'name', e.target.value)}
                    className="h-8 text-xs"
                  />
                  {med.instructions && (
                    <p className="text-xs text-slate-400 mt-0.5 px-1">{med.instructions}</p>
                  )}
                </div>
                <Input
                  placeholder="500mg"
                  value={med.dosage}
                  onChange={(e) => updateMedicine(i, 'dosage', e.target.value)}
                  className="col-span-2 h-8 text-xs"
                />
                <Input
                  placeholder="Twice daily"
                  value={med.frequency}
                  onChange={(e) => updateMedicine(i, 'frequency', e.target.value)}
                  className="col-span-2 h-8 text-xs"
                />
                <Input
                  placeholder="5 days"
                  value={med.duration}
                  onChange={(e) => updateMedicine(i, 'duration', e.target.value)}
                  className="col-span-2 h-8 text-xs"
                />
                <Input
                  placeholder="Generic"
                  value={med.generic_alt ?? ''}
                  onChange={(e) => updateMedicine(i, 'generic_alt', e.target.value)}
                  className="col-span-2 h-8 text-xs text-green-700 bg-green-50"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="col-span-1 h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                  onClick={() => removeMedicine(i)}
                  disabled={medicines.length === 1}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={addMedicine}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Medicine
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => checkInteractions()}
              disabled={checkingInteractions}
            >
              {checkingInteractions ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              )}
              Check Interactions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prescription Preview */}
      <Card className="border-2 border-dashed border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">Prescription Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div id="prescription-content" className="bg-white p-4 rounded-lg space-y-3">
            {/* Clinic Header */}
            <div className="text-center border-b pb-3">
              <h2 className="font-bold text-lg text-slate-800">CLINIQ-AI+</h2>
              <p className="text-xs text-slate-500">AI-Powered Clinic Management</p>
            </div>
            {/* Doctor + Patient Info */}
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" />
                <span className="font-semibold">Dr. {doctorProfile.full_name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                <span>{patient.full_name}, {patient.age}y, {patient.gender}</span>
              </div>
            </div>
            <Separator />
            {/* Diagnosis */}
            <div className="text-xs">
              <span className="font-semibold text-slate-700">Diagnosis: </span>
              <span className="text-blue-700">{diagnosis}</span>
            </div>
            {/* Medicines */}
            <div className="space-y-2">
              {medicines.filter(m => m.name).map((med, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="font-bold text-slate-500 w-4">{i + 1}.</span>
                  <div>
                    <span className="font-semibold text-slate-800">{med.name}</span>
                    {med.generic_alt && (
                      <span className="text-green-600 ml-1">(Generic: {med.generic_alt})</span>
                    )}
                    <p className="text-slate-500">
                      {med.dosage} · {med.frequency} · {med.duration}
                      {med.instructions ? ` · ${med.instructions}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <p className="text-xs text-slate-400 text-center">
              {new Date().toLocaleDateString('en-IN')} · CLINIQ-AI+ Digital Prescription
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={savePrescription}
          disabled={saving}
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
          ) : (
            <><Download className="h-4 w-4 mr-2" /> Save Prescription</>
          )}
        </Button>
        {patient.phone && (
          <Button
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50"
            onClick={() => {
              const msg = `Your prescription from Dr. ${doctorProfile.full_name}: Diagnosis - ${diagnosis}. ${medicines.filter(m => m.name).map(m => `${m.name} ${m.dosage} ${m.frequency} for ${m.duration}`).join(', ')}`
              window.open(`https://wa.me/91${patient.phone}?text=${encodeURIComponent(msg)}`, '_blank')
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Send via WhatsApp
          </Button>
        )}
        <Button variant="outline" onClick={() => router.push('/dashboard/doctor')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
