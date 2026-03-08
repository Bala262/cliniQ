'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Billing } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { cn, formatDate, generateInvoiceNumber } from '@/lib/utils'
import { toast } from 'sonner'
import { CreditCard, Plus, Loader2, IndianRupee, CheckCircle2, Clock } from 'lucide-react'

interface Patient { id: string; full_name: string; patient_code: string }

interface Props {
  bills: Billing[]
  patients: Patient[]
}

export function BillingManager({ bills: initialBills, patients }: Props) {
  const supabase = createClient()
  const [bills, setBills] = useState(initialBills)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    patient_id: '',
    consultation_fee: '',
    lab_charges: '',
    medicine_charges: '',
    payment_mode: '',
    payment_status: 'pending',
  })

  const totalRevenue = bills.filter(b => b.payment_status === 'paid').reduce((s, b) => s + (b.total ?? 0), 0)
  const pendingAmount = bills.filter(b => b.payment_status === 'pending').reduce((s, b) => s + (b.total ?? 0), 0)

  function updateForm(f: string, v: string) {
    setForm(prev => ({ ...prev, [f]: v }))
  }

  const total =
    parseFloat(form.consultation_fee || '0') +
    parseFloat(form.lab_charges || '0') +
    parseFloat(form.medicine_charges || '0')

  async function createBill(e: React.FormEvent) {
    e.preventDefault()
    if (!form.patient_id) { toast.error('Select a patient'); return }
    setLoading(true)
    try {
      const { data, error } = await supabase.from('billing').insert({
        patient_id: form.patient_id,
        consultation_fee: parseFloat(form.consultation_fee || '0'),
        lab_charges: parseFloat(form.lab_charges || '0'),
        medicine_charges: parseFloat(form.medicine_charges || '0'),
        total,
        payment_mode: form.payment_mode || null,
        payment_status: form.payment_status,
        invoice_number: generateInvoiceNumber(),
      }).select('*, patient:patients(full_name, patient_code, phone)').single()

      if (error) throw error
      setBills(prev => [data, ...prev])
      toast.success(`Invoice ${data.invoice_number} created!`)
      setOpen(false)
      setForm({ patient_id: '', consultation_fee: '', lab_charges: '', medicine_charges: '', payment_mode: '', payment_status: 'pending' })
    } catch {
      toast.error('Failed to create bill')
    } finally {
      setLoading(false)
    }
  }

  async function markPaid(id: string) {
    const { error } = await supabase.from('billing').update({ payment_status: 'paid' }).eq('id', id)
    if (!error) {
      setBills(prev => prev.map(b => b.id === id ? { ...b, payment_status: 'paid' } : b))
      toast.success('Payment recorded')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Billing</h1>
          <p className="text-slate-500 text-sm">{bills.length} invoices</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" /> New Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Invoice</DialogTitle>
            </DialogHeader>
            <form onSubmit={createBill} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Patient *</Label>
                <Select value={form.patient_id} onValueChange={v => updateForm('patient_id', v)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.full_name} · {p.patient_code}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Consultation ₹</Label>
                  <Input type="number" placeholder="500" value={form.consultation_fee} onChange={e => updateForm('consultation_fee', e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Lab ₹</Label>
                  <Input type="number" placeholder="0" value={form.lab_charges} onChange={e => updateForm('lab_charges', e.target.value)} className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Medicine ₹</Label>
                  <Input type="number" placeholder="0" value={form.medicine_charges} onChange={e => updateForm('medicine_charges', e.target.value)} className="h-9 text-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-semibold text-slate-700">Total</span>
                <span className="text-xl font-bold text-slate-800">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Payment Mode</Label>
                  <Select value={form.payment_mode} onValueChange={v => updateForm('payment_mode', v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Mode" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Status</Label>
                  <Select value={form.payment_status} onValueChange={v => updateForm('payment_status', v)}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</> : <><CreditCard className="h-4 w-4 mr-2" />Create Invoice</>}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-xs text-green-700">Collected</p>
              <p className="text-2xl font-bold text-green-800">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-xs text-orange-700">Pending</p>
              <p className="text-2xl font-bold text-orange-800">₹{pendingAmount.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bills Table */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <CreditCard className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-base font-semibold text-slate-800">Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs">Invoice No.</TableHead>
                <TableHead className="text-xs">Patient</TableHead>
                <TableHead className="text-xs">Breakdown</TableHead>
                <TableHead className="text-xs">Total</TableHead>
                <TableHead className="text-xs">Mode</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-slate-400 py-10">No invoices yet</TableCell></TableRow>
              ) : (
                bills.map(bill => {
                  const patient = bill.patient as { full_name?: string; patient_code?: string } | undefined
                  return (
                    <TableRow key={bill.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono text-xs text-blue-600">{bill.invoice_number}</TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{patient?.full_name}</p>
                        <p className="text-xs text-slate-400">{patient?.patient_code}</p>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        <div className="space-y-0.5">
                          {bill.consultation_fee > 0 && <p>Consult: ₹{bill.consultation_fee}</p>}
                          {bill.lab_charges > 0 && <p>Lab: ₹{bill.lab_charges}</p>}
                          {bill.medicine_charges > 0 && <p>Meds: ₹{bill.medicine_charges}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-800">
                        <div className="flex items-center gap-0.5">
                          <IndianRupee className="h-3 w-3" />
                          {bill.total?.toLocaleString('en-IN')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">{bill.payment_mode ?? '—'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn('text-xs capitalize',
                            bill.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-orange-100 text-orange-700 border-orange-200'
                          )}
                        >
                          {bill.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {bill.payment_status === 'pending' && (
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-green-600 hover:bg-green-700"
                            onClick={() => markPaid(bill.id)}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
