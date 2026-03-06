'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Appointment } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { cn, getStatusBadgeColor, formatTime, TIME_SLOTS } from '@/lib/utils'
import { toast } from 'sonner'
import { Calendar, Plus, Loader2, Clock } from 'lucide-react'

interface Patient { id: string; full_name: string; phone: string }
interface Doctor { id: string; full_name: string }

interface Props {
  patients: Patient[]
  doctors: Doctor[]
  appointments: Appointment[]
}

export function AppointmentManager({ patients, doctors, appointments: initialAppointments }: Props) {
  const supabase = createClient()
  const [appointments, setAppointments] = useState(initialAppointments)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0])

  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    date: new Date().toISOString().split('T')[0],
    time_slot: '',
    consultation_type: 'general',
  })

  function updateForm(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function bookAppointment(e: React.FormEvent) {
    e.preventDefault()
    if (!form.patient_id || !form.doctor_id || !form.time_slot) {
      toast.error('Fill all required fields')
      return
    }

    setLoading(true)
    try {
      // Get next token for that day
      const { count } = await supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('date', form.date)

      const { data, error } = await supabase.from('appointments').insert({
        ...form,
        status: 'scheduled',
        token_number: (count ?? 0) + 101,
      }).select('*, patient:patients(full_name, phone), doctor:profiles(full_name)').single()

      if (error) throw error

      setAppointments(prev => [data, ...prev])
      toast.success('Appointment booked!')
      setOpen(false)
      setForm({ patient_id: '', doctor_id: '', date: new Date().toISOString().split('T')[0], time_slot: '', consultation_type: 'general' })
    } catch {
      toast.error('Failed to book appointment')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
    if (!error) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: status as Appointment['status'] } : a))
      toast.success('Status updated')
    }
  }

  const filtered = appointments.filter(a => !filterDate || a.date === filterDate)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Appointment Management</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" /> Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={bookAppointment} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Patient *</Label>
                <Select value={form.patient_id} onValueChange={v => updateForm('patient_id', v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.full_name} · {p.phone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Doctor *</Label>
                <Select value={form.doctor_id} onValueChange={v => updateForm('doctor_id', v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select doctor" /></SelectTrigger>
                  <SelectContent>
                    {doctors.map(d => (
                      <SelectItem key={d.id} value={d.id}>Dr. {d.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Date *</Label>
                  <Input type="date" value={form.date} onChange={e => updateForm('date', e.target.value)} className="h-9 text-sm" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Time Slot *</Label>
                  <Select value={form.time_slot} onValueChange={v => updateForm('time_slot', v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select time" /></SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(t => <SelectItem key={t} value={t}><Clock className="h-3 w-3 mr-1 inline" />{formatTime(t)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Consultation Type</Label>
                <Select value={form.consultation_type} onValueChange={v => updateForm('consultation_type', v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="follow-up">Follow-Up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Booking...</> : <><Calendar className="h-4 w-4 mr-2" />Book Appointment</>}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Label className="text-xs font-medium text-slate-600">Filter by date:</Label>
        <Input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="w-40 h-8 text-sm"
        />
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setFilterDate('')}>All</Button>
        <Badge variant="outline" className="text-xs">{filtered.length} appointments</Badge>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-base font-semibold text-slate-800">Appointments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs w-16">Token</TableHead>
                <TableHead className="text-xs">Patient</TableHead>
                <TableHead className="text-xs">Doctor</TableHead>
                <TableHead className="text-xs">Date & Time</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-slate-400 py-8">No appointments found</TableCell></TableRow>
              ) : (
                filtered.map(appt => (
                  <TableRow key={appt.id} className="hover:bg-slate-50">
                    <TableCell className="font-bold text-slate-700">#{appt.token_number}</TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{(appt.patient as unknown as Patient)?.full_name}</p>
                      <p className="text-xs text-slate-400">{(appt.patient as unknown as Patient)?.phone}</p>
                    </TableCell>
                    <TableCell className="text-sm">Dr. {(appt.doctor as unknown as Doctor)?.full_name?.split(' ')[0]}</TableCell>
                    <TableCell>
                      <p className="text-sm">{appt.date}</p>
                      <p className="text-xs text-slate-400">{formatTime(appt.time_slot)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">{appt.consultation_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs capitalize', getStatusBadgeColor(appt.status))}>
                        {appt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {appt.status === 'scheduled' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(appt.id, 'waiting')}>
                          Mark Waiting
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
