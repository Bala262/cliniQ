'use client'

import Link from 'next/link'
import { Patient, Appointment, Prescription, LabReport } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatDate, formatTime, getStatusBadgeColor, getRiskBadgeColor } from '@/lib/utils'
import {
  Calendar, Pill, FlaskConical, Heart, User,
  CalendarPlus, Clock, Stethoscope, AlertTriangle, CheckCircle2
} from 'lucide-react'

interface Props {
  patient: Patient
  upcomingAppointments: Appointment[]
  recentPrescriptions: Prescription[]
  recentReports: LabReport[]
}

export function PatientPortalHome({ patient, upcomingAppointments, recentPrescriptions, recentReports }: Props) {
  const nextAppointment = upcomingAppointments[0]

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome, {patient.full_name.split(' ')[0]}!</h1>
          <p className="text-slate-500 text-sm mt-0.5">Your personal health dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-slate-500">Patient ID</p>
            <p className="font-mono font-bold text-blue-600">{patient.patient_code}</p>
          </div>
          <div className="p-2 bg-orange-100 rounded-full">
            <User className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <Link href="/dashboard/patient/book-appointment">
        <Button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white h-12 text-sm font-medium">
          <CalendarPlus className="h-5 w-5 mr-2" />
          Book New Appointment
        </Button>
      </Link>

      {/* Next Appointment Banner */}
      {nextAppointment ? (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-orange-800">Next Appointment</p>
              <p className="text-sm text-orange-700">
                {formatDate(nextAppointment.date)} at {formatTime(nextAppointment.time_slot)}
              </p>
              <p className="text-xs text-orange-600">
                Dr. {(nextAppointment.doctor as { full_name?: string })?.full_name} · {nextAppointment.consultation_type}
              </p>
            </div>
            <Badge variant="outline" className={cn('capitalize text-xs', getStatusBadgeColor(nextAppointment.status))}>
              {nextAppointment.status}
            </Badge>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3 text-slate-400">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-sm">No upcoming appointments. Book one when needed.</p>
          </CardContent>
        </Card>
      )}

      {/* Health Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Allergies */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <CardTitle className="text-sm font-semibold text-slate-700">Allergies</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {patient.allergies?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies.map(a => (
                  <Badge key={a} variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">{a}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">None recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <Stethoscope className="h-4 w-4 text-yellow-500" />
            <CardTitle className="text-sm font-semibold text-slate-700">Conditions</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {patient.chronic_conditions?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {patient.chronic_conditions.map(c => (
                  <Badge key={c} variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">{c}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">None recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Risk Level */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center gap-2">
            <Heart className="h-4 w-4 text-pink-500" />
            <CardTitle className="text-sm font-semibold text-slate-700">Health Risk</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Overall Risk</span>
              <Badge variant="outline" className={cn('text-xs capitalize', getRiskBadgeColor(patient.risk_level))}>
                {patient.risk_level}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Blood Group</span>
              <span className="text-xs font-bold text-slate-700">{patient.blood_group ?? '—'}</span>
            </div>
            <Link href="/dashboard/patient/health-risk">
              <Button variant="link" className="text-xs p-0 h-auto text-blue-600">View full risk assessment →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Prescriptions */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-sm font-semibold text-slate-700">Recent Prescriptions</CardTitle>
          </div>
          <Link href="/dashboard/patient/my-prescriptions">
            <Button variant="outline" size="sm" className="h-7 text-xs">View All</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          {recentPrescriptions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No prescriptions yet</p>
          ) : (
            recentPrescriptions.map(rx => (
              <div key={rx.id} className="flex items-start justify-between p-2.5 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {rx.medicines?.length ?? 0} medicine(s)
                  </p>
                  <p className="text-xs text-slate-400">
                    Dr. {(rx.doctor as { full_name?: string })?.full_name} · {formatDate(rx.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {rx.interaction_warnings?.length > 0 && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 text-xs">
                      <AlertTriangle className="h-3 w-3 mr-0.5" /> Warning
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Lab Reports */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-teal-500" />
            <CardTitle className="text-sm font-semibold text-slate-700">Recent Lab Reports</CardTitle>
          </div>
          <Link href="/dashboard/patient/my-reports">
            <Button variant="outline" size="sm" className="h-7 text-xs">View All</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-2">
          {recentReports.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No lab reports yet</p>
          ) : (
            recentReports.map(report => (
              <div key={report.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-700">{report.file_name}</p>
                  <p className="text-xs text-slate-400">{formatDate(report.uploaded_at)}</p>
                </div>
                {report.ai_summary && (
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 text-xs">
                    AI Analyzed
                  </Badge>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Nav Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: '/dashboard/patient/my-appointments', icon: Clock, label: 'All Appointments', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
          { href: '/dashboard/patient/my-prescriptions', icon: Pill, label: 'All Prescriptions', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
          { href: '/dashboard/patient/my-reports', icon: FlaskConical, label: 'Lab Reports', color: 'bg-teal-50 text-teal-700 hover:bg-teal-100' },
          { href: '/dashboard/patient/health-risk', icon: Heart, label: 'Health Risk', color: 'bg-pink-50 text-pink-700 hover:bg-pink-100' },
        ].map(item => (
          <Link key={item.href} href={item.href}>
            <div className={cn('flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors cursor-pointer', item.color)}>
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium text-center">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
