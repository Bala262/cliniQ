'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Filter, Beaker, Clock, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

type OrderStatus = 'pending' | 'sample_collected' | 'processing' | 'completed'

const initialOrders = [
  { id: 1, patient: 'Ravi Kumar', age: 35, test: 'CBC (Complete Blood Count)', doctor: 'Dr. Kumar', priority: 'high', status: 'pending' as OrderStatus, time: '09:45 AM', notes: 'Check for dengue' },
  { id: 2, patient: 'Sita Devi', age: 65, test: 'Sputum Culture & Sensitivity', doctor: 'Dr. Kumar', priority: 'urgent', status: 'sample_collected' as OrderStatus, time: '10:00 AM', notes: 'Rule out TB' },
  { id: 3, patient: 'Ahmed Khan', age: 52, test: 'X-Ray Right Leg (AP/Lateral)', doctor: 'Dr. Ahmed', priority: 'high', status: 'processing' as OrderStatus, time: '10:15 AM', notes: 'Post-op check' },
  { id: 4, patient: 'Priya Devi', age: 28, test: 'Blood Sugar PP', doctor: 'Dr. Priya', priority: 'normal', status: 'pending' as OrderStatus, time: '10:30 AM', notes: '' },
  { id: 5, patient: 'Suresh Iyer', age: 45, test: 'HbA1c', doctor: 'Dr. Priya', priority: 'normal', status: 'pending' as OrderStatus, time: '10:45 AM', notes: 'Diabetes monitoring' },
  { id: 6, patient: 'Kavitha Nair', age: 32, test: 'Thyroid Profile (T3, T4, TSH)', doctor: 'Dr. Ahmed', priority: 'normal', status: 'completed' as OrderStatus, time: '08:00 AM', notes: '' },
]

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  pending: 'sample_collected',
  sample_collected: 'processing',
  processing: 'completed',
  completed: null,
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; next: string | null }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', next: 'Collect Sample' },
  sample_collected: { label: 'Sample Collected', color: 'bg-blue-100 text-blue-700', next: 'Start Processing' },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-700', next: 'Upload Report' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700', next: null },
}

export function LabTestOrders() {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')

  const filtered = orders.filter(o =>
    (filter === 'all' || o.status === filter) &&
    (o.patient.toLowerCase().includes(search.toLowerCase()) || o.test.toLowerCase().includes(search.toLowerCase()))
  )

  function advance(id: number) {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o
      const next = STATUS_FLOW[o.status]
      if (!next) return o
      toast.success(`Order updated to ${STATUS_CONFIG[next].label}`)
      return { ...o, status: next }
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Test Orders</h1>
        <p className="text-sm text-slate-500 mt-0.5">Doctor-ordered tests — track and process each order</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'pending', 'sample_collected', 'processing', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {f === 'all' ? 'All' : STATUS_CONFIG[f].label}
            <span className="ml-1.5 bg-white/30 text-inherit px-1 rounded text-[10px]">
              {f === 'all' ? orders.length : orders.filter(o => o.status === f).length}
            </span>
          </button>
        ))}
        <div className="relative ml-auto w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input placeholder="Search patient or test..." className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500">#</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Patient</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Test Type</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Doctor</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Priority</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Time</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => {
                const sc = STATUS_CONFIG[o.status]
                return (
                  <TableRow key={o.id} className={`hover:bg-slate-50/50 ${o.priority === 'urgent' ? 'bg-red-50/30' : ''}`}>
                    <TableCell className="text-xs text-slate-400 font-medium">#{o.id.toString().padStart(3, '0')}</TableCell>
                    <TableCell>
                      <p className="font-medium text-sm text-slate-800">{o.patient}</p>
                      <p className="text-xs text-slate-400">{o.age} yrs</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Beaker className="h-3.5 w-3.5 text-amber-500" />
                        <p className="text-sm font-medium text-slate-800">{o.test}</p>
                      </div>
                      {o.notes && <p className="text-xs text-slate-400 mt-0.5">{o.notes}</p>}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{o.doctor}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs border-0 flex items-center gap-1 w-fit ${o.priority === 'urgent' ? 'bg-red-100 text-red-700' : o.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {o.priority === 'urgent' && <AlertTriangle className="h-2.5 w-2.5" />}
                        {o.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />{o.time}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs border-0 ${sc.color}`}>{sc.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {sc.next && (
                        <Button size="sm" className="h-7 text-xs bg-amber-600 hover:bg-amber-700"
                          onClick={() => advance(o.id)}>
                          {sc.next}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
