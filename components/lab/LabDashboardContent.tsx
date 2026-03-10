'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  ClipboardCheck, Beaker, FileText, BarChart3, AlertTriangle, Clock, CheckCircle, ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const pendingOrders = [
  { id: 1, patient: 'Ravi Kumar', age: 35, test: 'CBC', doctor: 'Dr. Kumar', priority: 'high', time: '09:45 AM', status: 'pending' },
  { id: 2, patient: 'Sita Devi', age: 65, test: 'Sputum Culture', doctor: 'Dr. Kumar', priority: 'urgent', time: '10:00 AM', status: 'sample_collected' },
  { id: 3, patient: 'Ahmed Khan', age: 52, test: 'X-Ray Rt. Leg', doctor: 'Dr. Ahmed', priority: 'high', time: '10:15 AM', status: 'processing' },
  { id: 4, patient: 'Priya Devi', age: 28, test: 'Blood Sugar (PP)', doctor: 'Dr. Priya', priority: 'normal', time: '10:30 AM', status: 'pending' },
]

const recentReports = [
  { patient: 'Meena Lakshmi', test: 'Widal Test', result: 'Positive (1:160)', status: 'approved', time: '08:30 AM' },
  { patient: 'Suresh Iyer', test: 'Lipid Profile', result: 'Cholesterol: 220 mg/dL', status: 'approved', time: '08:00 AM' },
  { patient: 'Raj Kumar', test: 'Urine Routine', result: 'Normal', status: 'pending_approval', time: '09:00 AM' },
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  sample_collected: { label: 'Sample Collected', color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
}

export function LabDashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Laboratory Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Tuesday, March 10, 2026 — Morning Shift</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Pending Orders', value: '8', icon: <ClipboardCheck className="h-5 w-5" />, color: 'amber' },
          { title: 'Processing', value: '3', icon: <Beaker className="h-5 w-5" />, color: 'purple' },
          { title: 'Reports Today', value: '12', icon: <FileText className="h-5 w-5" />, color: 'blue' },
          { title: 'Urgent Cases', value: '2', icon: <AlertTriangle className="h-5 w-5" />, color: 'red' },
        ].map((s) => (
          <LabStatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Orders */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <ClipboardCheck className="h-4 w-4 text-amber-600" />
                </div>
                Pending Test Orders
              </CardTitle>
              <Link href="/dashboard/lab/test-orders">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs font-semibold text-slate-500">Patient</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Test</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Doctor</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Priority</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOrders.map((o) => (
                    <TableRow key={o.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <p className="font-medium text-sm text-slate-800">{o.patient}</p>
                        <p className="text-xs text-slate-400">{o.age} yrs</p>
                      </TableCell>
                      <TableCell className="font-medium text-sm text-amber-700">{o.test}</TableCell>
                      <TableCell className="text-sm text-slate-600">{o.doctor}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs border-0 ${o.priority === 'urgent' ? 'bg-red-100 text-red-700' : o.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {o.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs border-0 ${STATUS_CONFIG[o.status].color}`}>
                          {STATUS_CONFIG[o.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href="/dashboard/lab/sample-processing">
                          <Button size="sm" className="h-7 text-xs bg-amber-600 hover:bg-amber-700">Process</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <div>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentReports.map((r, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-800">{r.patient}</p>
                    <Badge className={`text-[10px] border-0 ${r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.status === 'approved' ? 'Approved' : 'Awaiting'}
                    </Badge>
                  </div>
                  <p className="text-xs font-medium text-amber-700">{r.test}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{r.result}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {r.time}
                  </p>
                </div>
              ))}
              <Link href="/dashboard/lab/reports">
                <Button variant="outline" size="sm" className="w-full h-8 text-xs mt-1">
                  View All Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function LabStatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  const colors: Record<string, { bg: string; text: string; icon: string }> = {
    amber: { bg: 'border-amber-100', text: 'text-amber-700', icon: 'bg-amber-50 text-amber-600' },
    purple: { bg: 'border-purple-100', text: 'text-purple-700', icon: 'bg-purple-50 text-purple-600' },
    blue: { bg: 'border-blue-100', text: 'text-blue-700', icon: 'bg-blue-50 text-blue-600' },
    red: { bg: 'border-red-100', text: 'text-red-700', icon: 'bg-red-50 text-red-600' },
  }
  const c = colors[color]
  return (
    <Card className={`border shadow-sm ${c.bg}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
            <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
          </div>
          <div className={`p-2.5 rounded-xl ${c.icon}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
