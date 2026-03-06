'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Patient } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { formatTime, TIME_SLOTS } from '@/lib/utils'
import { toast } from 'sonner'
import { Calendar, Clock, Loader2, CheckCircle2 } from 'lucide-react'

interface Doctor { id: string; full_name: string; specialization: string | null }

interface Props {
  patient: Patient | null
  doctors: Doctor[]
}

export function PatientBookAppointment({ patient, doctors }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    doctor_id: '',
    date: '',
    time_slot: '',
    consultation_type: 'general',
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p>Your patient record is not linked. Please contact reception.</p>
      </div>
    )
  }

  async function bookAppointment(e: React.FormEvent) {
    e.preventDefault()
    if (!form.doctor_id || !form.date || !form.time_slot) {
      toast.error('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const { count } = await supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('date', form.date)

      const { error } = await supabase.from('appointments').insert({
        patient_id: patient!.id,
        doctor_id: form.doctor_id,
        date: form.date,
        time_slot: form.time_slot,
        consultation_type: form.consultation_type,
        status: 'scheduled',
        token_number: (count ?? 0) + 101,
      })

      if (error) throw error

      setDone(true)
      toast.success('Appointment booked successfully!')
    } catch {
      toast.error('Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="p-4 bg-green-100 rounded-full">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Appointment Booked!</h2>
        <p className="text-slate-500 text-sm">Your appointment has been confirmed. Please arrive 10 minutes early.</p>
        <Button onClick={() => router.push('/dashboard/patient/my-appointments')} className="bg-orange-500 hover:bg-orange-600">
          View My Appointments
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Book an Appointment</h1>
        <p className="text-slate-500 text-sm">Choose your preferred doctor, date, and time</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" /> Appointment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={bookAppointment} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Select Doctor *</Label>
              <Select value={form.doctor_id} onValueChange={v => setForm(p => ({ ...p, doctor_id: v }))}>
                <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Choose a doctor" /></SelectTrigger>
                <SelectContent>
                  {doctors.map(d => (
                    <SelectItem key={d.id} value={d.id}>
                      Dr. {d.full_name}
                      {d.specialization ? ` · ${d.specialization}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Preferred Date *</Label>
              <Input
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Time Slot *</Label>
              <Select value={form.time_slot} onValueChange={v => setForm(p => ({ ...p, time_slot: v }))}>
                <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select time" /></SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map(t => (
                    <SelectItem key={t} value={t}>
                      <Clock className="h-3 w-3 mr-1 inline" /> {formatTime(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Consultation Type</Label>
              <Select value={form.consultation_type} onValueChange={v => setForm(p => ({ ...p, consultation_type: v }))}>
                <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-Up Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 h-11" disabled={loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Booking...</>
              ) : (
                <><Calendar className="h-4 w-4 mr-2" /> Confirm Appointment</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
