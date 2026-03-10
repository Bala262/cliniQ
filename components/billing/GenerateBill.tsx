'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Receipt, Printer, Share2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const patients = [
  { id: '1', name: 'Priya Devi', token: 'A06', doctor: 'Dr. Priya' },
  { id: '2', name: 'Rajan Mehta', token: 'A05', doctor: 'Dr. Kumar' },
  { id: '3', name: 'Kavitha Nair', token: 'A04', doctor: 'Dr. Ahmed' },
]

type PaymentMode = 'cash' | 'upi' | 'card' | 'insurance'

const PAYMENT_MODES: { value: PaymentMode; label: string; icon: string }[] = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'upi', label: 'UPI', icon: '📱' },
  { value: 'card', label: 'Card', icon: '💳' },
  { value: 'insurance', label: 'Insurance', icon: '🏥' },
]

export function GenerateBill() {
  const [selectedPatient, setSelectedPatient] = useState('')
  const [charges, setCharges] = useState({
    consultation: '300',
    lab: '850',
    medicines: '420',
    ward: '0',
    other: '0',
  })
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash')
  const [paid, setPaid] = useState(false)

  const total = Object.values(charges).reduce((sum, v) => sum + (parseFloat(v) || 0), 0)
  const patient = patients.find(p => p.id === selectedPatient)

  function handleGenerate() {
    if (!selectedPatient) { toast.error('Select a patient'); return }
    setPaid(true)
    toast.success(`Bill generated for ${patient?.name} — ₹${total.toLocaleString()} collected via ${paymentMode.toUpperCase()}`)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Generate Bill</h1>
        <p className="text-sm text-slate-500 mt-0.5">Create invoice and collect payment</p>
      </div>

      {paid && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-5 flex items-center gap-4">
          <CheckCircle className="h-10 w-10 text-emerald-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-emerald-800 text-lg">Payment Collected!</p>
            <p className="text-emerald-700">₹{total.toLocaleString()} received via {paymentMode.toUpperCase()} from {patient?.name}</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success('Printing receipt...')}>
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success('Sent via WhatsApp')}>
              <Share2 className="h-4 w-4" /> WhatsApp
            </Button>
          </div>
        </div>
      )}

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="p-1.5 bg-rose-100 rounded-lg"><Receipt className="h-4 w-4 text-rose-600" /></div>
            Bill Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Patient Selection */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Select Patient</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Choose patient..." />
              </SelectTrigger>
              <SelectContent>
                {patients.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — Token {p.token} · {p.doctor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Charges */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Charge Breakdown</p>
            <div className="space-y-3">
              {[
                { key: 'consultation', label: 'Consultation Fee', icon: '🩺' },
                { key: 'lab', label: 'Lab Test Charges', icon: '🧪' },
                { key: 'medicines', label: 'Pharmacy / Medicine Charges', icon: '💊' },
                { key: 'ward', label: 'Ward / Bed Charges', icon: '🛏' },
                { key: 'other', label: 'Other Charges', icon: '📋' },
              ].map(({ key, label, icon }) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-8 text-center">{icon}</div>
                  <Label className="flex-1 text-sm text-slate-700">{label}</Label>
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
                    <Input
                      type="number"
                      value={charges[key as keyof typeof charges]}
                      onChange={(e) => setCharges(prev => ({ ...prev, [key]: e.target.value }))}
                      className="pl-7 h-9 text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Total Amount</span>
              <span className="text-2xl font-bold text-slate-800">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Payment Mode</p>
            <div className="grid grid-cols-4 gap-3">
              {PAYMENT_MODES.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setPaymentMode(mode.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${paymentMode === mode.value ? 'border-rose-500 bg-rose-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="text-xl mb-1">{mode.icon}</div>
                  <p className={`text-xs font-semibold ${paymentMode === mode.value ? 'text-rose-700' : 'text-slate-600'}`}>{mode.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              className="flex-1 bg-rose-600 hover:bg-rose-700 h-11 text-base font-semibold gap-2"
              onClick={handleGenerate}
            >
              <CheckCircle className="h-5 w-5" />
              Collect ₹{total.toLocaleString()} — {paymentMode.toUpperCase()}
            </Button>
            <Button variant="outline" className="h-11 gap-2" onClick={() => toast.success('Bill saved as draft')}>
              <Printer className="h-4 w-4" /> Print
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
