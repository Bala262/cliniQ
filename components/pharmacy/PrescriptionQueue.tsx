'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pill, Search, Clock, CheckCircle, Eye } from 'lucide-react'
import { toast } from 'sonner'

type RxStatus = 'pending' | 'partial' | 'dispensed'

const prescriptions = [
  {
    id: 'RX001', patient: 'Priya Devi', age: 28, doctor: 'Dr. Priya', time: '10:15 AM', status: 'pending' as RxStatus,
    medicines: [
      { name: 'Azithromycin 500mg', dose: '1-0-0', days: 5, qty: 5, available: true },
      { name: 'Paracetamol 500mg', dose: '1-1-1', days: 5, qty: 15, available: true },
      { name: 'ORS Sachet', dose: 'As needed', days: 3, qty: 6, available: true },
    ]
  },
  {
    id: 'RX002', patient: 'Suresh Iyer', age: 45, doctor: 'Dr. Kumar', time: '10:30 AM', status: 'pending' as RxStatus,
    medicines: [
      { name: 'Metformin 500mg', dose: '1-0-1', days: 30, qty: 60, available: true },
      { name: 'Glipizide 5mg', dose: '1-0-0', days: 30, qty: 30, available: false },
      { name: 'Aspirin 75mg', dose: '0-1-0', days: 30, qty: 30, available: false },
    ]
  },
  {
    id: 'RX003', patient: 'Ravi Kumar', age: 35, doctor: 'Dr. Kumar', time: '09:00 AM', status: 'dispensed' as RxStatus,
    medicines: [
      { name: 'Dolo 650mg', dose: '1-1-1', days: 5, qty: 15, available: true },
      { name: 'Cetirizine 10mg', dose: '0-0-1', days: 5, qty: 5, available: true },
    ]
  },
]

const STATUS_COLORS: Record<RxStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  partial: 'bg-blue-100 text-blue-700',
  dispensed: 'bg-emerald-100 text-emerald-700',
}

export function PrescriptionQueue() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = prescriptions.filter(rx =>
    rx.patient.toLowerCase().includes(search.toLowerCase()) || rx.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Prescription Queue</h1>
        <p className="text-sm text-slate-500 mt-0.5">Pending prescriptions from doctors</p>
      </div>

      {/* Counts */}
      <div className="grid grid-cols-3 gap-4">
        {(['pending', 'partial', 'dispensed'] as RxStatus[]).map(s => (
          <Card key={s} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-slate-800">{prescriptions.filter(rx => rx.status === s).length}</p>
              <p className="text-xs text-slate-500 mt-0.5 capitalize">{s}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input placeholder="Search Rx or patient..." className="pl-8 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-4">
        {filtered.map((rx) => (
          <Card key={rx.id} className="border-0 shadow-sm">
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${rx.status === 'dispensed' ? 'bg-emerald-100' : 'bg-emerald-50'}`}>
                    <Pill className={`h-5 w-5 ${rx.status === 'dispensed' ? 'text-emerald-600' : 'text-emerald-500'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-sm font-bold text-emerald-700">{rx.id}</span>
                      <span className="text-slate-300">·</span>
                      <h3 className="font-semibold text-slate-800">{rx.patient}</h3>
                      <span className="text-xs text-slate-400">{rx.age} yrs</span>
                      <Badge className={`text-xs border-0 ${STATUS_COLORS[rx.status]}`}>
                        {rx.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">Prescribed by {rx.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" />{rx.time}</span>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0"
                    onClick={() => setExpanded(expanded === rx.id ? null : rx.id)}>
                    <Eye className="h-4 w-4 text-slate-500" />
                  </Button>
                  {rx.status !== 'dispensed' && (
                    <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => toast.success(`${rx.id} dispensed!`)}>
                      Dispense All
                    </Button>
                  )}
                </div>
              </div>

              {/* Expanded */}
              {expanded === rx.id && (
                <div className="px-5 py-4">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="text-xs">Medicine</TableHead>
                        <TableHead className="text-xs">Dosage</TableHead>
                        <TableHead className="text-xs">Days</TableHead>
                        <TableHead className="text-xs">Qty</TableHead>
                        <TableHead className="text-xs">Stock</TableHead>
                        <TableHead className="text-xs text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rx.medicines.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-sm text-slate-800">{m.name}</TableCell>
                          <TableCell className="text-sm text-slate-600">{m.dose}</TableCell>
                          <TableCell className="text-sm text-slate-600">{m.days} days</TableCell>
                          <TableCell className="text-sm font-medium text-slate-700">{m.qty} tabs</TableCell>
                          <TableCell>
                            <Badge className={`text-xs border-0 ${m.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                              {m.available ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {m.available ? (
                              <Button size="sm" variant="outline" className="h-6 text-[11px] px-2"
                                onClick={() => toast.success(`${m.name} dispensed`)}>
                                <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" /> Dispense
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="h-6 text-[11px] px-2 text-amber-600 border-amber-200">
                                Substitute
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
