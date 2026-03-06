'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { TrendingUp, Activity } from 'lucide-react'

const patientVisitsData = [
  { day: 'Mon', patients: 18 },
  { day: 'Tue', patients: 24 },
  { day: 'Wed', patients: 21 },
  { day: 'Thu', patients: 28 },
  { day: 'Fri', patients: 25 },
  { day: 'Sat', patients: 15 },
  { day: 'Sun', patients: 8 },
]

const diagnosisData = [
  { name: 'Viral Fever', cases: 12 },
  { name: 'Hypertension', cases: 9 },
  { name: 'Diabetes', cases: 7 },
  { name: 'Dengue', cases: 5 },
  { name: 'Typhoid', cases: 4 },
]

export function ClinicMiniCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Patient Visits */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <CardTitle className="text-sm font-semibold text-slate-700">Patient Visits (This Week)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={patientVisitsData}>
              <defs>
                <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Area
                type="monotone"
                dataKey="patients"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#patientGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Diagnoses */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <Activity className="h-4 w-4 text-purple-500" />
          <CardTitle className="text-sm font-semibold text-slate-700">Top Diagnoses</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={diagnosisData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 9, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="cases" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
