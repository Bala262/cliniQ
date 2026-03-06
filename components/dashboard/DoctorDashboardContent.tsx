'use client'

import { Profile, Appointment, AIAlert, DashboardStats } from '@/types'
import { SummaryCard } from './SummaryCard'
import { PatientQueueTable } from './PatientQueueTable'
import { AIAlertsPanel } from './AIAlertsPanel'
import { AppointmentTimeline } from './AppointmentTimeline'
import { ClinicMiniCharts } from '../charts/ClinicMiniCharts'
import { Users, Clock, CheckCircle2, AlertTriangle, CalendarClock } from 'lucide-react'

interface Props {
  profile: Profile
  stats: DashboardStats
  appointments: Appointment[]
  alerts: AIAlert[]
}

export function DoctorDashboardContent({ profile, stats, appointments, alerts }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Good {getGreeting()}, Dr. {profile.full_name.split(' ')[0]}
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard
          title="Total Patients Today"
          value={stats.total_patients_today}
          icon={Users}
          color="blue"
        />
        <SummaryCard
          title="Waiting Patients"
          value={stats.waiting_patients}
          icon={Clock}
          color="yellow"
        />
        <SummaryCard
          title="Completed"
          value={stats.completed_consultations}
          icon={CheckCircle2}
          color="green"
        />
        <SummaryCard
          title="Emergency Alerts"
          value={stats.emergency_alerts}
          icon={AlertTriangle}
          color="red"
          urgent={stats.emergency_alerts > 0}
        />
        <SummaryCard
          title="Follow-Ups Today"
          value={stats.follow_ups_today}
          icon={CalendarClock}
          color="purple"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Patient Queue (takes 2/3) */}
        <div className="xl:col-span-2 space-y-6">
          <PatientQueueTable appointments={appointments} doctorId={profile.id} />
          <ClinicMiniCharts />
        </div>

        {/* Right: Alerts + Appointments */}
        <div className="space-y-6">
          <AIAlertsPanel alerts={alerts} />
          <AppointmentTimeline appointments={appointments} />
        </div>
      </div>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
