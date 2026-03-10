'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'
import { TrendingUp, Users, CreditCard, BarChart3 } from 'lucide-react'

const weekData = [
  { day: 'Mon', patients: 28, revenue: 14500 },
  { day: 'Tue', patients: 34, revenue: 18200 },
  { day: 'Wed', patients: 25, revenue: 12800 },
  { day: 'Thu', patients: 31, revenue: 16500 },
  { day: 'Fri', patients: 38, revenue: 21000 },
  { day: 'Sat', patients: 42, revenue: 24500 },
  { day: 'Sun', patients: 20, revenue: 9500 },
]

const monthData = [
  { month: 'Oct', revenue: 285000 },
  { month: 'Nov', revenue: 312000 },
  { month: 'Dec', revenue: 298000 },
  { month: 'Jan', revenue: 341000 },
  { month: 'Feb', revenue: 358000 },
  { month: 'Mar', revenue: 127000 },
]

interface SimpleAnalyticsProps {
  title?: string
}

export function SimpleAnalytics({ title = 'Analytics' }: SimpleAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-500 mt-0.5">Performance overview — March 2026</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'This Week', value: '218', sub: 'Patients', icon: <Users className="h-5 w-5" />, color: 'blue' },
          { label: 'Today', value: '34', sub: 'Patients', icon: <Users className="h-5 w-5" />, color: 'cyan' },
          { label: "Today's Revenue", value: '₹18,200', sub: '↑ 12%', icon: <TrendingUp className="h-5 w-5" />, color: 'emerald' },
          { label: 'Monthly Revenue', value: '₹1,27,000', sub: 'March 2026', icon: <CreditCard className="h-5 w-5" />, color: 'purple' },
        ].map((s) => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">{s.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Weekly Patients */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Weekly Patient Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="patients" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number | undefined) => [`₹${(v ?? 0).toLocaleString()}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5}
                  dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Revenue Bar */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">Daily Revenue This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number | undefined) => [`₹${(v ?? 0).toLocaleString()}`, 'Revenue']}
                />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
