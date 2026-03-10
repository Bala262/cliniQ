'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Syringe, Clock, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const procedures = [
  { id: 1, patient: 'Ravi Kumar', bed: 'Bed 1', procedure: 'IV Cannula Insertion', doctor: 'Dr. Kumar', scheduled: '10:00 AM', status: 'completed', priority: 'high' },
  { id: 2, patient: 'Sita Devi', bed: 'Bed 7', procedure: 'Nebulization', doctor: 'Dr. Kumar', scheduled: '10:30 AM', status: 'pending', priority: 'urgent' },
  { id: 3, patient: 'Ahmed Khan', bed: 'Bed 5', procedure: 'Wound Dressing', doctor: 'Dr. Ahmed', scheduled: '11:00 AM', status: 'pending', priority: 'normal' },
  { id: 4, patient: 'Meena Lakshmi', bed: 'Bed 3', procedure: 'Blood Sample Collection', doctor: 'Dr. Priya', scheduled: '11:30 AM', status: 'in_progress', priority: 'high' },
]

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-amber-100 text-amber-700',
  normal: 'bg-slate-100 text-slate-600',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
}

export function NurseProcedures() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Procedures</h1>
        <p className="text-sm text-slate-500 mt-0.5">Scheduled nursing procedures for today</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-amber-50 border-amber-100">
          <CardContent className="p-4"><p className="text-2xl font-bold text-amber-700">{procedures.filter(p => p.status === 'pending').length}</p><p className="text-xs text-amber-600">Pending</p></CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-blue-50 border-blue-100">
          <CardContent className="p-4"><p className="text-2xl font-bold text-blue-700">{procedures.filter(p => p.status === 'in_progress').length}</p><p className="text-xs text-blue-600">In Progress</p></CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-emerald-50 border-emerald-100">
          <CardContent className="p-4"><p className="text-2xl font-bold text-emerald-700">{procedures.filter(p => p.status === 'completed').length}</p><p className="text-xs text-emerald-600">Completed</p></CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg"><Syringe className="h-4 w-4 text-purple-600" /></div>
            Today's Procedures
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500">Patient</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Procedure</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Doctor</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Scheduled</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Priority</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {procedures.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <p className="font-medium text-sm text-slate-800">{p.patient}</p>
                    <p className="text-xs text-slate-400">{p.bed}</p>
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">{p.procedure}</TableCell>
                  <TableCell className="text-sm text-slate-600">{p.doctor}</TableCell>
                  <TableCell><span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" />{p.scheduled}</span></TableCell>
                  <TableCell><Badge className={`text-xs ${PRIORITY_COLORS[p.priority]} border-0`}>{p.priority}</Badge></TableCell>
                  <TableCell><Badge className={`text-xs ${STATUS_COLORS[p.status]} border-0`}>{p.status.replace('_', ' ')}</Badge></TableCell>
                  <TableCell className="text-right">
                    {p.status !== 'completed' && (
                      <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700"
                        onClick={() => toast.success(`${p.procedure} marked complete`)}>
                        {p.status === 'in_progress' ? 'Complete' : 'Start'}
                      </Button>
                    )}
                    {p.status === 'completed' && <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto" />}
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
