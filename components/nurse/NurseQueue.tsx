'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Search, Clock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

type QueueStatus = 'waiting' | 'with_nurse' | 'ready_for_doctor' | 'completed'

const STATUS_COLORS: Record<QueueStatus, string> = {
  waiting: 'bg-amber-100 text-amber-700',
  with_nurse: 'bg-purple-100 text-purple-700',
  ready_for_doctor: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
}

const STATUS_LABELS: Record<QueueStatus, string> = {
  waiting: 'Waiting',
  with_nurse: 'With Nurse',
  ready_for_doctor: 'Ready for Doctor',
  completed: 'Completed',
}

const initialQueue = [
  { token: 'A01', name: 'Ravi Kumar', age: 35, gender: 'M', symptoms: 'Fever, Body Ache', doctor: 'Dr. Kumar', time: '09:00 AM', status: 'completed' as QueueStatus },
  { token: 'A02', name: 'Priya Devi', age: 28, gender: 'F', symptoms: 'Headache, Nausea', doctor: 'Dr. Priya', time: '09:30 AM', status: 'ready_for_doctor' as QueueStatus },
  { token: 'A03', name: 'Suresh Iyer', age: 50, gender: 'M', symptoms: 'Chest Pain', doctor: 'Dr. Kumar', time: '10:00 AM', status: 'with_nurse' as QueueStatus, urgent: true },
  { token: 'A04', name: 'Kavitha Nair', age: 32, gender: 'F', symptoms: 'Cold, Cough', doctor: 'Dr. Ahmed', time: '10:15 AM', status: 'waiting' as QueueStatus },
  { token: 'A05', name: 'Mohan Das', age: 45, gender: 'M', symptoms: 'Diabetes Follow-up', doctor: 'Dr. Priya', time: '10:30 AM', status: 'waiting' as QueueStatus },
  { token: 'A06', name: 'Lalitha Rani', age: 38, gender: 'F', symptoms: 'Joint Pain', doctor: 'Dr. Kumar', time: '10:45 AM', status: 'waiting' as QueueStatus },
]

export function NurseQueue() {
  const [queue, setQueue] = useState(initialQueue)
  const [search, setSearch] = useState('')

  const filtered = queue.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.token.toLowerCase().includes(search.toLowerCase())
  )

  function updateStatus(token: string, status: QueueStatus) {
    setQueue(prev => prev.map(p => p.token === token ? { ...p, status } : p))
    toast.success(`Status updated`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Patient Queue</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage today's patient flow</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {(['waiting', 'with_nurse', 'ready_for_doctor', 'completed'] as QueueStatus[]).map(s => (
          <Card key={s} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-slate-800">{queue.filter(p => p.status === s).length}</p>
              <p className="text-xs text-slate-500 mt-0.5">{STATUS_LABELS[s]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-800">Today's Queue</CardTitle>
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input placeholder="Search patient or token..." className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500">Token</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Patient</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Symptoms</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Doctor</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Time</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.token} className="hover:bg-slate-50/50">
                  <TableCell>
                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded text-xs">{p.token}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium text-sm text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.age}y · {p.gender}</p>
                      </div>
                      {(p as any).urgent && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{p.symptoms}</TableCell>
                  <TableCell className="text-sm text-slate-600">{p.doctor}</TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" />{p.time}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${STATUS_COLORS[p.status]} border-0 hover:opacity-90`}>
                      {STATUS_LABELS[p.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {p.status === 'waiting' && (
                      <Link href="/dashboard/nurse/vitals">
                        <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700">
                          Record Vitals
                        </Button>
                      </Link>
                    )}
                    {p.status === 'with_nurse' && (
                      <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() => updateStatus(p.token, 'ready_for_doctor')}>
                        Send to Doctor <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                    {p.status === 'ready_for_doctor' && (
                      <span className="text-xs text-blue-600 font-medium flex items-center gap-1 justify-end">
                        <CheckCircle className="h-3 w-3" /> Sent
                      </span>
                    )}
                    {p.status === 'completed' && (
                      <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 justify-end">
                        <CheckCircle className="h-3 w-3" /> Done
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
