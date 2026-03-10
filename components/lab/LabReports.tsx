'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FileText, Search, Download, Printer, CheckCircle, Eye, Plus } from 'lucide-react'
import { toast } from 'sonner'

const reports = [
  {
    id: 1, patient: 'Meena Lakshmi', age: 28, test: 'Widal Test',
    result: 'Positive — Salmonella Typhi H 1:160, O 1:80',
    status: 'approved', technician: 'Lab Tech Arjun', date: '10 Mar 2026 08:30 AM',
    values: [
      { name: 'S.Typhi H', value: '1:160', range: 'Negative (<1:20)', flag: 'HIGH' },
      { name: 'S.Typhi O', value: '1:80', range: 'Negative (<1:20)', flag: 'HIGH' },
    ]
  },
  {
    id: 2, patient: 'Suresh Iyer', age: 45, test: 'Lipid Profile',
    result: 'Total Cholesterol 220 mg/dL — Borderline High',
    status: 'approved', technician: 'Lab Tech Arjun', date: '10 Mar 2026 08:00 AM',
    values: [
      { name: 'Total Cholesterol', value: '220', range: '< 200 mg/dL', flag: 'HIGH' },
      { name: 'LDL', value: '140', range: '< 100 mg/dL', flag: 'HIGH' },
      { name: 'HDL', value: '48', range: '> 40 mg/dL', flag: 'NORMAL' },
      { name: 'Triglycerides', value: '165', range: '< 150 mg/dL', flag: 'HIGH' },
    ]
  },
  {
    id: 3, patient: 'Raj Kumar', age: 50, test: 'Urine Routine/Microscopy',
    result: 'Pus cells 8-10/HPF — Suggests UTI',
    status: 'pending_approval', technician: 'Lab Tech Arjun', date: '10 Mar 2026 09:00 AM',
    values: [
      { name: 'Pus Cells', value: '8-10/HPF', range: '0-5/HPF', flag: 'HIGH' },
      { name: 'RBC', value: '2-4/HPF', range: '0-2/HPF', flag: 'HIGH' },
      { name: 'Protein', value: 'Trace', range: 'Nil', flag: 'HIGH' },
    ]
  },
  {
    id: 4, patient: 'Kavitha Nair', age: 32, test: 'Thyroid Profile (TSH, T3, T4)',
    result: 'TSH 6.8 mIU/L — Hypothyroidism suspected',
    status: 'pending_approval', technician: 'Lab Tech Arjun', date: '10 Mar 2026 09:30 AM',
    values: [
      { name: 'TSH', value: '6.8 mIU/L', range: '0.4-4.0 mIU/L', flag: 'HIGH' },
      { name: 'Free T4', value: '0.7 ng/dL', range: '0.8-1.8 ng/dL', flag: 'LOW' },
      { name: 'Free T3', value: '2.8 pg/mL', range: '2.3-4.2 pg/mL', flag: 'NORMAL' },
    ]
  },
]

export function LabReports() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending_approval'>('all')

  const filtered = reports.filter(r =>
    (statusFilter === 'all' || r.status === statusFilter) &&
    (r.patient.toLowerCase().includes(search.toLowerCase()) || r.test.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lab Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">Generate, approve and manage lab reports</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700 gap-2 h-9">
          <Plus className="h-4 w-4" /> Generate Report
        </Button>
      </div>

      {/* Filter + Search */}
      <div className="flex items-center gap-3">
        {(['all', 'pending_approval', 'approved'] as const).map(f => (
          <button key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === f ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f === 'all' ? 'All Reports' : f === 'pending_approval' ? 'Awaiting Approval' : 'Approved'}
            <span className="ml-1.5 bg-white/30 px-1 rounded text-[10px]">
              {f === 'all' ? reports.length : reports.filter(r => r.status === f).length}
            </span>
          </button>
        ))}
        <div className="relative ml-auto w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input placeholder="Search..." className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((r) => (
          <Card key={r.id} className="border-0 shadow-sm">
            <CardContent className="p-0">
              {/* Report Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${r.status === 'approved' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                    <FileText className={`h-5 w-5 ${r.status === 'approved' ? 'text-emerald-600' : 'text-amber-600'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-slate-800">{r.patient}</h3>
                      <span className="text-slate-400">·</span>
                      <span className="text-sm text-slate-500">{r.age} yrs</span>
                      <Badge className={`text-[10px] border-0 ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {r.status === 'approved' ? 'Approved' : 'Awaiting Approval'}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-amber-700">{r.test}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.result}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-400">{r.date}</span>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
                    <Eye className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast.success('Downloading...')}>
                    <Download className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => toast.success('Printing...')}>
                    <Printer className="h-4 w-4 text-slate-500" />
                  </Button>
                  {r.status === 'pending_approval' && (
                    <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 gap-1">
                      <CheckCircle className="h-3 w-3" /> Approve
                    </Button>
                  )}
                </div>
              </div>

              {/* Expanded Values */}
              {expanded === r.id && (
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Test Values</p>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="text-xs">Test Parameter</TableHead>
                        <TableHead className="text-xs">Result</TableHead>
                        <TableHead className="text-xs">Normal Range</TableHead>
                        <TableHead className="text-xs">Flag</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {r.values.map((v, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm font-medium text-slate-700">{v.name}</TableCell>
                          <TableCell className={`text-sm font-bold ${v.flag === 'HIGH' ? 'text-red-600' : v.flag === 'LOW' ? 'text-blue-600' : 'text-emerald-600'}`}>
                            {v.value}
                          </TableCell>
                          <TableCell className="text-sm text-slate-500">{v.range}</TableCell>
                          <TableCell>
                            <Badge className={`text-[10px] border-0 ${v.flag === 'HIGH' ? 'bg-red-100 text-red-700' : v.flag === 'LOW' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {v.flag}
                            </Badge>
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
