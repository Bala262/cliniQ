'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts'
import { BarChart3, PieChart as PieIcon } from 'lucide-react'
import { format, subDays } from 'date-fns'

interface Props {
  appointmentTrend: { date: string; status: string }[]
}

const DISEASE_DATA = [
  { name: 'Viral Fever', value: 32 },
  { name: 'Hypertension', value: 24 },
  { name: 'Diabetes', value: 18 },
  { name: 'Dengue', value: 12 },
  { name: 'Others', value: 14 },
]

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#94a3b8']

export function AdminAnalyticsCharts({ appointmentTrend }: Props) {
  // Build last 7 days appointment chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i)
    const dateStr = format(d, 'yyyy-MM-dd')
    const count = appointmentTrend.filter(a => a.date === dateStr).length
    return { day: format(d, 'EEE'), count }
  })

  return (
    <div className="space-y-4">
      {/* Appointment trend */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-500" />
          <CardTitle className="text-sm font-semibold text-slate-700">Appointments (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" name="Appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Disease distribution */}
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <PieIcon className="h-4 w-4 text-purple-500" />
          <CardTitle className="text-sm font-semibold text-slate-700">Disease Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={DISEASE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {DISEASE_DATA.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
