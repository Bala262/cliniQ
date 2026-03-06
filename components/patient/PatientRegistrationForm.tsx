'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { generatePatientCode, BLOOD_GROUPS } from '@/lib/utils'
import { toast } from 'sonner'
import { UserPlus, X, Plus, Loader2, Eye, EyeOff } from 'lucide-react'

interface Props {
  nextIndex: number
}

export function PatientRegistrationForm({ nextIndex }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const patientCode = generatePatientCode(nextIndex)

  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    blood_group: '',
    emergency_contact: '',
  })
  const [allergies, setAllergies] = useState<string[]>([])
  const [conditions, setConditions] = useState<string[]>([])
  const [allergyInput, setAllergyInput] = useState('')
  const [conditionInput, setConditionInput] = useState('')

  // Portal credentials
  const [createPortal, setCreatePortal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function addTag(list: string[], setList: (v: string[]) => void, input: string, setInput: (v: string) => void) {
    const val = input.trim()
    if (val && !list.includes(val)) {
      setList([...list, val])
    }
    setInput('')
  }

  function removeTag(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.filter(v => v !== item))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name || !form.phone || !form.gender) {
      toast.error('Name, phone, and gender are required')
      return
    }

    setLoading(true)
    try {
      // Check duplicate phone
      const { data: existing } = await supabase
        .from('patients')
        .select('id')
        .eq('phone', form.phone)
        .single()

      if (existing) {
        toast.error('A patient with this phone number already exists')
        setLoading(false)
        return
      }

      let profileId: string | null = null

      // Create portal account if requested
      if (createPortal && email && password) {
        const { data: authData, error: authError } = await supabase.auth.admin
          ? // Service role needed — use API route instead
          { data: null, error: new Error('use-api-route') }
          : { data: null, error: new Error('use-api-route') }

        if (authError?.message === 'use-api-route') {
          const res = await fetch('/api/auth/create-patient', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, full_name: form.full_name }),
          })
          const data = await res.json()
          if (data.profileId) profileId = data.profileId
          else toast.warning('Patient record created, but portal account failed: ' + (data.error ?? 'Unknown error'))
        }
      }

      // Insert patient
      const { data: patient, error } = await supabase.from('patients').insert({
        patient_code: patientCode,
        full_name: form.full_name,
        age: form.age ? parseInt(form.age) : null,
        gender: form.gender,
        phone: form.phone,
        address: form.address || null,
        blood_group: form.blood_group || null,
        emergency_contact: form.emergency_contact || null,
        allergies,
        chronic_conditions: conditions,
        profile_id: profileId,
      }).select().single()

      if (error) throw error

      toast.success(`Patient ${patient.patient_code} registered successfully!`)
      router.push(`/dashboard/receptionist/patients`)
    } catch (err) {
      toast.error('Failed to register patient')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Register New Patient</h1>
        <p className="text-slate-500 text-sm">Patient ID will be: <span className="font-mono font-semibold text-blue-600">{patientCode}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-teal-500" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Full Name *</Label>
              <Input placeholder="Anil Kumar Patel" value={form.full_name} onChange={e => update('full_name', e.target.value)} required className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Age</Label>
              <Input type="number" placeholder="35" value={form.age} onChange={e => update('age', e.target.value)} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Gender *</Label>
              <Select value={form.gender} onValueChange={v => update('gender', v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Phone Number *</Label>
              <Input placeholder="9876543210" value={form.phone} onChange={e => update('phone', e.target.value)} required className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Blood Group</Label>
              <Select value={form.blood_group} onValueChange={v => update('blood_group', v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select blood group" /></SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Address</Label>
              <Input placeholder="123, MG Road, Chennai" value={form.address} onChange={e => update('address', e.target.value)} className="h-9" />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Emergency Contact</Label>
              <Input placeholder="Name: Ravi Kumar · Phone: 9123456789" value={form.emergency_contact} onChange={e => update('emergency_contact', e.target.value)} className="h-9" />
            </div>
          </CardContent>
        </Card>

        {/* Medical Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700">Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Allergies */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-600">Known Allergies</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Penicillin"
                  value={allergyInput}
                  onChange={e => setAllergyInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(allergies, setAllergies, allergyInput, setAllergyInput) } }}
                  className="h-8 text-sm"
                />
                <Button type="button" size="sm" variant="outline" className="h-8" onClick={() => addTag(allergies, setAllergies, allergyInput, setAllergyInput)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {allergies.map(a => (
                    <Badge key={a} variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs gap-1">
                      {a}
                      <button type="button" onClick={() => removeTag(allergies, setAllergies, a)}>
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Chronic conditions */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-600">Chronic Conditions</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Diabetes Type 2"
                  value={conditionInput}
                  onChange={e => setConditionInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(conditions, setConditions, conditionInput, setConditionInput) } }}
                  className="h-8 text-sm"
                />
                <Button type="button" size="sm" variant="outline" className="h-8" onClick={() => addTag(conditions, setConditions, conditionInput, setConditionInput)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              {conditions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {conditions.map(c => (
                    <Badge key={c} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs gap-1">
                      {c}
                      <button type="button" onClick={() => removeTag(conditions, setConditions, c)}>
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patient Portal */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700">Patient Portal Access</CardTitle>
              <button
                type="button"
                onClick={() => setCreatePortal(!createPortal)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${createPortal ? 'bg-teal-500' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${createPortal ? 'translate-x-4' : 'translate-x-1'}`} />
              </button>
            </div>
            <p className="text-xs text-slate-500">Allow patient to log in and check appointments/prescriptions</p>
          </CardHeader>
          {createPortal && (
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Patient Email</Label>
                <Input type="email" placeholder="patient@email.com" value={email} onChange={e => setEmail(e.target.value)} className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Temporary Password</Label>
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Set a password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-9 pr-9"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2 top-2.5 text-slate-400">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <Separator />

        <div className="flex gap-3">
          <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registering...</> : <><UserPlus className="h-4 w-4 mr-2" /> Register Patient</>}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
