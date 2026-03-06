'use client'

import { AIAlert } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SummaryCard } from './SummaryCard'
import { AIAlertsPanel } from './AIAlertsPanel'
import { AdminAnalyticsCharts } from '../charts/AdminAnalyticsCharts'
import { Users, Calendar, TrendingUp, Clock, ShieldAlert, UserCheck } from 'lucide-react'

interface Props {
  totalPatients: number
  todayAppointments: number
  todayRevenue: number
  pendingRevenue: number
  totalUsers: number
  recentAlerts: AIAlert[]
  appointmentTrend: { date: string; status: string }[]
  allUsers: { id: string; full_name: string; role: string; created_at: string }[]
}

export function AdminDashboardContent({
  totalPatients, todayAppointments, todayRevenue, pendingRevenue,
  totalUsers, recentAlerts, appointmentTrend, allUsers
}: Props) {
  const roleCount = allUsers.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm">Clinic performance overview</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Patients" value={totalPatients} icon={Users} color="blue" />
        <SummaryCard title="Appointments Today" value={todayAppointments} icon={Calendar} color="green" />
        <SummaryCard title="Active Alerts" value={recentAlerts.length} icon={ShieldAlert} color="red" urgent={recentAlerts.length > 0} />
        <SummaryCard title="Total Staff" value={totalUsers} icon={UserCheck} color="purple" />
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-green-700 font-medium">Today&apos;s Revenue (Paid)</p>
              <p className="text-2xl font-bold text-green-800">₹{todayRevenue.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-orange-700 font-medium">Pending Collections</p>
              <p className="text-2xl font-bold text-orange-800">₹{pendingRevenue.toLocaleString('en-IN')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts + Alerts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AdminAnalyticsCharts appointmentTrend={appointmentTrend} />
        </div>
        <div className="space-y-4">
          <AIAlertsPanel alerts={recentAlerts} />

          {/* Role Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-700">Staff by Role</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              {Object.entries(roleCount).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-slate-600">{role}</span>
                  <Badge variant="outline" className="text-xs">{count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-purple-500" /> System Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-1.5">
            {allUsers.map(u => (
              <div key={u.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700">{u.full_name}</p>
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${
                    u.role === 'doctor' ? 'bg-blue-50 text-blue-700' :
                    u.role === 'admin' ? 'bg-purple-50 text-purple-700' :
                    u.role === 'receptionist' ? 'bg-teal-50 text-teal-700' :
                    'bg-orange-50 text-orange-700'
                  }`}
                >
                  {u.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
