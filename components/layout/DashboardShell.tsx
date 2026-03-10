import { Sidebar } from './Sidebar'
import { TopNavbar } from './TopNavbar'
import { Profile } from '@/types'

interface DashboardShellProps {
  profile: Profile
  children: React.ReactNode
  alertCount?: number
  rightPanel?: React.ReactNode
}

export function DashboardShell({ profile, children, alertCount, rightPanel }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role={profile.role} />
      <TopNavbar profile={profile} alertCount={alertCount} />
      <main className={cn('ml-56 pt-14 min-h-screen flex', rightPanel ? 'pr-72' : '')}>
        <div className="flex-1 p-6 min-w-0">
          {children}
        </div>
      </main>
      {rightPanel && (
        <aside className="fixed right-0 top-14 bottom-0 w-72 bg-white border-l border-slate-200 overflow-y-auto z-20">
          {rightPanel}
        </aside>
      )}
    </div>
  )
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}
