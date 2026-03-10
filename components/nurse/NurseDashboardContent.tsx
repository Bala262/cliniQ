'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  ClipboardList, BedDouble, AlertTriangle, Stethoscope,
  Thermometer, HeartPulse, Activity, ArrowRight, Clock, CheckCircle
} from 'lucide-react'
import Link from 'next/link'

const waitingPatients = [
  { token: 'A04', name: 'Priya Sharma', age: 32, symptoms: 'Fever, Headache', time: '10:15 AM' },
  { token: 'A05', name: 'Rajan Mehta', age: 58, symptoms: 'Chest Pain', time: '10:30 AM', urgent: true },
  { token: 'A06', name: 'Kavitha Nair', age: 24, symptoms: 'Cold, Cough', time: '10:45 AM' },
  { token: 'A07', name: 'Suresh Iyer', age: 45, symptoms: 'Diabetes Follow-up', time: '11:00 AM' },
]

const wardPatients = [
  { bed: 'Bed 1', name: 'Ravi Kumar', diagnosis: 'Dengue Fever', condition: 'Stable', vitals: '↑ Temp', time: '08:00 AM' },
  { bed: 'Bed 3', name: 'Meena Lakshmi', diagnosis: 'Typhoid', condition: 'Improving', vitals: 'Normal', time: '08:00 AM' },
  { bed: 'Bed 5', name: 'Ahmed Khan', diagnosis: 'Fracture (Rt. Leg)', condition: 'Post-Op', vitals: 'Normal', time: '07:30 AM' },
]

const doctorRequests = [
  { id: 1, patient: 'Ravi Kumar', bed: 'Bed 1', request: 'Check IV drip, administer Paracetamol 500mg', priority: 'high', time: '5 min ago' },
  { id: 2, patient: 'Meena Lakshmi', bed: 'Bed 3', request: 'Record vitals every 2 hours', priority: 'normal', time: '15 min ago' },
]

export function NurseDashboardContent() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Nurse Station</h1>
        <p className="text-sm text-slate-500 mt-0.5">Tuesday, March 10, 2026 — Morning Shift</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Waiting for Vitals"
          value="4"
          icon={<ClipboardList className="h-5 w-5" />}
          color="purple"
          sub="2 urgent"
        />
        <StatCard
          title="Ward Patients"
          value="6"
          icon={<BedDouble className="h-5 w-5" />}
          color="blue"
          sub="10 beds total"
        />
        <StatCard
          title="Emergency Alerts"
          value="1"
          icon={<AlertTriangle className="h-5 w-5" />}
          color="red"
          sub="Needs attention"
        />
        <StatCard
          title="Doctor Requests"
          value="2"
          icon={<Stethoscope className="h-5 w-5" />}
          color="amber"
          sub="Pending"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waiting for Vitals */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <Thermometer className="h-4 w-4 text-purple-600" />
                </div>
                Patients Waiting for Vitals
              </CardTitle>
              <Link href="/dashboard/nurse/vitals">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  Enter Vitals <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="text-xs font-semibold text-slate-500 w-16">Token</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Patient</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Symptoms</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Time</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitingPatients.map((p) => (
                    <TableRow key={p.token} className="hover:bg-slate-50/50">
                      <TableCell>
                        <span className="font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded text-xs">{p.token}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.age} yrs</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-xs text-slate-600">{p.symptoms}</span>
                          {p.urgent && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">Urgent</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {p.time}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href="/dashboard/nurse/vitals">
                          <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700">
                            Record Vitals
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Doctor Requests */}
        <div>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <Stethoscope className="h-4 w-4 text-amber-600" />
                </div>
                Doctor Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {doctorRequests.map((req) => (
                <div key={req.id} className={`p-3 rounded-lg border ${req.priority === 'high' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{req.patient}</p>
                      <p className="text-xs text-slate-500">{req.bed}</p>
                    </div>
                    <Badge className={`text-[10px] ${req.priority === 'high' ? 'bg-red-100 text-red-700 hover:bg-red-100' : 'bg-slate-200 text-slate-600 hover:bg-slate-200'}`}>
                      {req.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">{req.request}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">{req.time}</span>
                    <Button size="sm" variant="outline" className="h-6 text-[10px] px-2">Mark Done</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ward Summary */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <HeartPulse className="h-4 w-4 text-blue-600" />
            </div>
            Ward Patients — Current Status
          </CardTitle>
          <Link href="/dashboard/nurse/ward">
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              Full Ward View <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500">Bed</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Patient</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Diagnosis</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Condition</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Last Vitals</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wardPatients.map((p) => (
                <TableRow key={p.bed} className="hover:bg-slate-50/50">
                  <TableCell>
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">{p.bed}</span>
                  </TableCell>
                  <TableCell className="font-medium text-sm text-slate-800">{p.name}</TableCell>
                  <TableCell className="text-sm text-slate-600">{p.diagnosis}</TableCell>
                  <TableCell>
                    <ConditionBadge condition={p.condition} />
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs ${p.vitals === 'Normal' ? 'text-emerald-600' : 'text-amber-600 font-medium'}`}>
                      {p.vitals}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href="/dashboard/nurse/monitoring">
                      <Button size="sm" variant="outline" className="h-7 text-xs">Monitor</Button>
                    </Link>
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

function StatCard({ title, value, icon, color, sub }: {
  title: string; value: string; icon: React.ReactNode; color: string; sub: string
}) {
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  }
  const cardColors: Record<string, string> = {
    purple: 'border-purple-100',
    blue: 'border-blue-100',
    red: 'border-red-100',
    amber: 'border-amber-100',
    green: 'border-emerald-100',
  }
  const valueColors: Record<string, string> = {
    purple: 'text-purple-700',
    blue: 'text-blue-700',
    red: 'text-red-700',
    amber: 'text-amber-700',
    green: 'text-emerald-700',
  }
  return (
    <Card className={`border shadow-sm ${cardColors[color]}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
            <p className={`text-3xl font-bold ${valueColors[color]}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </div>
          <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ConditionBadge({ condition }: { condition: string }) {
  const map: Record<string, string> = {
    Stable: 'bg-emerald-100 text-emerald-700',
    Improving: 'bg-blue-100 text-blue-700',
    Critical: 'bg-red-100 text-red-700',
    'Post-Op': 'bg-amber-100 text-amber-700',
    Discharged: 'bg-slate-100 text-slate-600',
  }
  return (
    <Badge className={`text-xs ${map[condition] ?? 'bg-slate-100 text-slate-600'} hover:opacity-90`}>
      {condition}
    </Badge>
  )
}
