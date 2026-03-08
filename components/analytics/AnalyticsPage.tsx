'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import { TrendingUp, Users, CreditCard, Stethoscope, AlertTriangle } from 'lucide-react'

interface Props {
  appointments: { date: string; status: string; consultation_type: string }[]
  consultations: { final_diagnosis?: string; date: string }[]
  billing: { total: number; payment_status: string; payment_mode?: string; created_at: string }[]
  patients: { created_at: string; risk_level?: string }[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export function AnalyticsPage({ appointments, consultations, billing, patients }: Props) {
  // --- Daily appointments last 7 days ---
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
    return {
      label,
      total: appointments.filter(a => a.date === dateStr).length,
      completed: appointments.filter(a => a.date === dateStr && a.status === 'completed').length,
    }
  })

  // --- Consultation type breakdown ---
  const typeMap: Record<string, number> = {}
  appointments.forEach(a => {
    typeMap[a.consultation_type] = (typeMap[a.consultation_type] ?? 0) + 1
  })
  const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }))

  // --- Top 5 diagnoses ---
  const diagMap: Record<string, number> = {}
  consultations.forEach(c => {
    if (c.final_diagnosis) {
      diagMap[c.final_diagnosis] = (diagMap[c.final_diagnosis] ?? 0) + 1
    }
  })
  const diagData = Object.entries(diagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  // --- Revenue trend ---
  const revenueData = last7.map(({ label }) => {
    const dateStr = appointments.find(a =>
      new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }) === label
    )?.date ?? ''
    const dayRevenue = billing
      .filter(b => b.payment_status === 'paid' && b.created_at.startsWith(dateStr))
      .reduce((s, b) => s + (b.total ?? 0), 0)
    return { label, revenue: dayRevenue }
  })

  // --- Risk distribution ---
  const riskMap: Record<string, number> = { low: 0, medium: 0, high: 0 }
  patients.forEach(p => {
    const r = p.risk_level ?? 'low'
    riskMap[r] = (riskMap[r] ?? 0) + 1
  })
  const riskData = [
    { name: 'Low', value: riskMap.low, color: '#10b981' },
    { name: 'Medium', value: riskMap.medium, color: '#f59e0b' },
    { name: 'High', value: riskMap.high, color: '#ef4444' },
  ]

  // --- Summary Stats ---
  const totalRevenue = billing.filter(b => b.payment_status === 'paid').reduce((s, b) => s + (b.total ?? 0), 0)
  const pendingRevenue = billing.filter(b => b.payment_status === 'pending').reduce((s, b) => s + (b.total ?? 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Analytics</h1>
        <p className="text-slate-500 text-sm">Last 30 days clinic performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Appointments', value: appointments.length, icon: Stethoscope, color: 'text-blue-600 bg-blue-100' },
          { label: 'Total Patients', value: patients.length, icon: Users, color: 'text-teal-600 bg-teal-100' },
          { label: 'Revenue Collected', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: CreditCard, color: 'text-green-600 bg-green-100' },
          { label: 'Pending Bills', value: `₹${pendingRevenue.toLocaleString('en-IN')}`, icon: AlertTriangle, color: 'text-orange-600 bg-orange-100' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-full ${color.split(' ')[1]}`}>
                <Icon className={`h-5 w-5 ${color.split(' ')[0]}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="font-bold text-lg text-slate-800">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Appointments Bar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" /> Appointments (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={last7} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="total" fill="#3b82f6" name="Total" radius={[3, 3, 0, 0]} />
                <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-500" /> Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${v}`} />
                <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} contentStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" /> Patient Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {riskData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Diagnoses */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-purple-500" /> Top Diagnoses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {diagData.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No consultation data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={diagData} layout="vertical" barSize={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 3, 3, 0]} name="Cases" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Consultation Type Breakdown */}
      {typeData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Appointment Types</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {typeData.map((t, i) => (
              <div key={t.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium" style={{ borderColor: COLORS[i], color: COLORS[i], backgroundColor: `${COLORS[i]}15` }}>
                {t.value}× {t.name}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
