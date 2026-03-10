'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserRole } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  LayoutDashboard, Users, Stethoscope, Calendar, FileText,
  FlaskConical, CreditCard, BarChart3, ShieldAlert, Settings,
  Activity, ClipboardList, UserPlus, Pill, BedDouble,
  Thermometer, TestTube2, Package, Receipt, TrendingUp,
  AlertTriangle, UserCog, Building2, DollarSign, Microscope,
  ClipboardCheck, Beaker, PackageSearch, FileBarChart,
  UserCheck, LogOut, Syringe, HeartPulse, NotepadText,
  Wallet, ShoppingBag, FileSearch, RotateCcw
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  receptionist: [
    { label: 'Dashboard', href: '/dashboard/receptionist', icon: LayoutDashboard },
    { label: 'Register Patient', href: '/dashboard/receptionist/register-patient', icon: UserPlus },
    { label: 'Appointments', href: '/dashboard/receptionist/appointments', icon: Calendar },
    { label: 'Patient Queue', href: '/dashboard/receptionist/queue', icon: ClipboardList },
    { label: 'Patient Search', href: '/dashboard/receptionist/patients', icon: FileSearch },
    { label: 'Follow-ups', href: '/dashboard/receptionist/follow-ups', icon: RotateCcw },
    { label: 'Billing Queue', href: '/dashboard/receptionist/billing', icon: CreditCard },
    { label: 'Daily Summary', href: '/dashboard/receptionist/daily-summary', icon: FileBarChart },
    { label: 'Settings', href: '/dashboard/receptionist/settings', icon: Settings },
  ],
  doctor: [
    { label: 'Dashboard', href: '/dashboard/doctor', icon: LayoutDashboard },
    { label: 'Patient Queue', href: '/dashboard/doctor/consultation', icon: ClipboardList },
    { label: 'Consultation', href: '/dashboard/doctor/consultation', icon: Stethoscope },
    { label: 'Patient Records', href: '/dashboard/doctor/patients', icon: Users },
    { label: 'Prescriptions', href: '/dashboard/doctor/prescriptions', icon: Pill },
    { label: 'Lab Orders', href: '/dashboard/doctor/lab-orders', icon: FlaskConical },
    { label: 'Inpatient Ward', href: '/dashboard/doctor/ward', icon: BedDouble },
    { label: 'Follow-ups', href: '/dashboard/doctor/follow-ups', icon: RotateCcw },
    { label: 'Analytics', href: '/dashboard/doctor/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/dashboard/doctor/settings', icon: Settings },
  ],
  visiting_doctor: [
    { label: 'Dashboard', href: '/dashboard/visiting-doctor', icon: LayoutDashboard },
    { label: 'My Patients', href: '/dashboard/visiting-doctor/consultation', icon: ClipboardList },
    { label: 'Consultation', href: '/dashboard/visiting-doctor/consultation', icon: Stethoscope },
    { label: 'Prescriptions', href: '/dashboard/visiting-doctor/prescriptions', icon: Pill },
    { label: 'Lab Orders', href: '/dashboard/visiting-doctor/lab-orders', icon: FlaskConical },
    { label: 'Schedule', href: '/dashboard/visiting-doctor/schedule', icon: Calendar },
    { label: 'Settings', href: '/dashboard/visiting-doctor/settings', icon: Settings },
  ],
  nurse: [
    { label: 'Dashboard', href: '/dashboard/nurse', icon: LayoutDashboard },
    { label: 'Patient Queue', href: '/dashboard/nurse/queue', icon: ClipboardList },
    { label: 'Vitals Entry', href: '/dashboard/nurse/vitals', icon: Thermometer },
    { label: 'Ward Management', href: '/dashboard/nurse/ward', icon: BedDouble },
    { label: 'Procedures', href: '/dashboard/nurse/procedures', icon: Syringe },
    { label: 'Lab Samples', href: '/dashboard/nurse/lab-samples', icon: TestTube2 },
    { label: 'Patient Monitoring', href: '/dashboard/nurse/monitoring', icon: HeartPulse },
    { label: 'Settings', href: '/dashboard/nurse/settings', icon: Settings },
  ],
  lab: [
    { label: 'Dashboard', href: '/dashboard/lab', icon: LayoutDashboard },
    { label: 'Test Orders', href: '/dashboard/lab/test-orders', icon: ClipboardCheck },
    { label: 'Sample Processing', href: '/dashboard/lab/sample-processing', icon: Beaker },
    { label: 'Reports', href: '/dashboard/lab/reports', icon: FileText },
    { label: 'Lab Analytics', href: '/dashboard/lab/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/dashboard/lab/settings', icon: Settings },
  ],
  pharmacy: [
    { label: 'Dashboard', href: '/dashboard/pharmacy', icon: LayoutDashboard },
    { label: 'Prescription Queue', href: '/dashboard/pharmacy/prescriptions', icon: ClipboardList },
    { label: 'Dispense Medicines', href: '/dashboard/pharmacy/dispense', icon: Pill },
    { label: 'Sales', href: '/dashboard/pharmacy/sales', icon: ShoppingBag },
    { label: 'Inventory', href: '/dashboard/pharmacy/inventory', icon: Package },
    { label: 'Expiry Alerts', href: '/dashboard/pharmacy/expiry-alerts', icon: AlertTriangle },
    { label: 'Pharmacy Reports', href: '/dashboard/pharmacy/reports', icon: FileBarChart },
    { label: 'Settings', href: '/dashboard/pharmacy/settings', icon: Settings },
  ],
  billing: [
    { label: 'Dashboard', href: '/dashboard/billing', icon: LayoutDashboard },
    { label: 'Generate Bill', href: '/dashboard/billing/generate', icon: Receipt },
    { label: 'Payments', href: '/dashboard/billing/payments', icon: Wallet },
    { label: 'Insurance', href: '/dashboard/billing/insurance', icon: ShieldAlert },
    { label: 'Billing Reports', href: '/dashboard/billing/reports', icon: FileBarChart },
    { label: 'Settings', href: '/dashboard/billing/settings', icon: Settings },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Staff Management', href: '/dashboard/admin/users', icon: UserCog },
    { label: 'Clinic Management', href: '/dashboard/admin/clinic', icon: Building2 },
    { label: 'Revenue', href: '/dashboard/admin/revenue', icon: DollarSign },
    { label: 'Inventory', href: '/dashboard/admin/inventory', icon: PackageSearch },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
    { label: 'System Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
}

const ROLE_COLORS: Record<UserRole, { gradient: string; accent: string; label: string }> = {
  receptionist: { gradient: 'from-cyan-950 via-cyan-900 to-slate-900', accent: 'bg-cyan-500', label: 'Reception' },
  doctor: { gradient: 'from-blue-950 via-blue-900 to-slate-900', accent: 'bg-blue-500', label: 'Doctor Portal' },
  visiting_doctor: { gradient: 'from-indigo-950 via-indigo-900 to-slate-900', accent: 'bg-indigo-500', label: 'Visiting Doctor' },
  nurse: { gradient: 'from-purple-950 via-purple-900 to-slate-900', accent: 'bg-purple-500', label: 'Nurse Station' },
  lab: { gradient: 'from-amber-950 via-amber-900 to-slate-900', accent: 'bg-amber-500', label: 'Laboratory' },
  pharmacy: { gradient: 'from-emerald-950 via-emerald-900 to-slate-900', accent: 'bg-emerald-500', label: 'Pharmacy' },
  billing: { gradient: 'from-rose-950 via-rose-900 to-slate-900', accent: 'bg-rose-500', label: 'Billing' },
  admin: { gradient: 'from-slate-800 via-slate-800 to-slate-900', accent: 'bg-violet-500', label: 'Admin Portal' },
}

interface SidebarProps {
  role: UserRole
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const navItems = NAV_ITEMS[role] ?? []
  const { gradient, accent, label } = ROLE_COLORS[role] ?? ROLE_COLORS.admin

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full w-56 bg-gradient-to-b text-white flex flex-col z-40 shadow-xl',
      gradient
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className={cn('p-1.5 rounded-lg flex-shrink-0', accent)}>
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight tracking-wide">CLINIQ-AI+</p>
            <p className="text-xs text-white/50 truncate">{label}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard/' + role && pathname.startsWith(item.href + '/'))
          const isExact = pathname === item.href
          const active = isExact || (item.href.split('/').length > 3 && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group relative',
                active
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/8 hover:text-white/90'
              )}
            >
              {active && (
                <span className={cn('absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full', accent)} />
              )}
              <item.icon className={cn('h-4 w-4 flex-shrink-0 transition-colors', active ? 'text-white' : 'text-white/50 group-hover:text-white/80')} />
              <span className="truncate">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-2.5 border-t border-white/10 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span>Logout</span>
        </button>
        <p className="text-xs text-white/20 text-center pt-1">CLINIQ-AI+ v2.0</p>
      </div>
    </aside>
  )
}
