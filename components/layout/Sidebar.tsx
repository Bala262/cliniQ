'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserRole } from '@/types'
import {
  LayoutDashboard, Users, Stethoscope, Calendar, FileText,
  FlaskConical, CreditCard, BarChart3, ShieldAlert, Settings,
  Activity, ClipboardList, UserPlus, Home, Pill
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  doctor: [
    { label: 'Dashboard', href: '/dashboard/doctor', icon: LayoutDashboard },
    { label: 'Consultation', href: '/dashboard/doctor/consultation', icon: Stethoscope },
    { label: 'Patients', href: '/dashboard/doctor/patients', icon: Users },
    { label: 'Prescriptions', href: '/dashboard/doctor/prescriptions', icon: Pill },
    { label: 'Lab Reports', href: '/dashboard/doctor/lab-reports', icon: FlaskConical },
    { label: 'Appointments', href: '/dashboard/doctor/appointments', icon: Calendar },
    { label: 'Health Alerts', href: '/dashboard/doctor/alerts', icon: ShieldAlert },
    { label: 'Settings', href: '/dashboard/doctor/settings', icon: Settings },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
    { label: 'Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Patients', href: '/dashboard/admin/patients', icon: ClipboardList },
    { label: 'Billing', href: '/dashboard/admin/billing', icon: CreditCard },
    { label: 'Health Alerts', href: '/dashboard/admin/alerts', icon: ShieldAlert },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
  receptionist: [
    { label: 'Dashboard', href: '/dashboard/receptionist', icon: LayoutDashboard },
    { label: 'Register Patient', href: '/dashboard/receptionist/register-patient', icon: UserPlus },
    { label: 'Appointments', href: '/dashboard/receptionist/appointments', icon: Calendar },
    { label: 'Patient Queue', href: '/dashboard/receptionist/queue', icon: ClipboardList },
    { label: 'Billing', href: '/dashboard/receptionist/billing', icon: CreditCard },
    { label: 'Patients', href: '/dashboard/receptionist/patients', icon: Users },
    { label: 'Settings', href: '/dashboard/receptionist/settings', icon: Settings },
  ],
  patient: [
    { label: 'Home', href: '/dashboard/patient', icon: Home },
    { label: 'Book Appointment', href: '/dashboard/patient/book-appointment', icon: Calendar },
    { label: 'My Appointments', href: '/dashboard/patient/my-appointments', icon: ClipboardList },
    { label: 'My Prescriptions', href: '/dashboard/patient/my-prescriptions', icon: FileText },
    { label: 'My Lab Reports', href: '/dashboard/patient/my-reports', icon: FlaskConical },
    { label: 'Health Risk', href: '/dashboard/patient/health-risk', icon: Activity },
  ],
}

interface SidebarProps {
  role: UserRole
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const navItems = NAV_ITEMS[role]

  const roleColors: Record<UserRole, string> = {
    doctor: 'from-blue-900 to-slate-900',
    admin: 'from-purple-900 to-slate-900',
    receptionist: 'from-teal-900 to-slate-900',
    patient: 'from-orange-900 to-slate-900',
  }

  const roleLabels: Record<UserRole, string> = {
    doctor: 'Doctor Portal',
    admin: 'Admin Portal',
    receptionist: 'Reception',
    patient: 'Patient Portal',
  }

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full w-56 bg-gradient-to-b text-white flex flex-col z-40',
      roleColors[role]
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500 rounded-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">CLINIQ-AI+</p>
            <p className="text-xs text-white/50">{roleLabels[role]}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-white' : 'text-white/60')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <p className="text-xs text-white/30 text-center">CLINIQ-AI+ v1.0</p>
      </div>
    </aside>
  )
}
