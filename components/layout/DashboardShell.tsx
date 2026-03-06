import { Sidebar } from './Sidebar'
import { TopNavbar } from './TopNavbar'
import { Profile } from '@/types'

interface DashboardShellProps {
  profile: Profile
  children: React.ReactNode
  alertCount?: number
}

export function DashboardShell({ profile, children, alertCount }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role={profile.role} />
      <TopNavbar profile={profile} alertCount={alertCount} />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
