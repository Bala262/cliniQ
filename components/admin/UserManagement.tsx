'use client'

import { Profile } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn, formatDate } from '@/lib/utils'
import { Users, Shield, Stethoscope, ClipboardList, UserCheck } from 'lucide-react'

interface Props {
  users: Profile[]
  currentUserId: string
}

const roleConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  admin: { icon: Shield, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  doctor: { icon: Stethoscope, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  receptionist: { icon: ClipboardList, color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
  patient: { icon: UserCheck, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
}

export function UserManagement({ users, currentUserId }: Props) {
  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">User Management</h1>
        <p className="text-slate-500 text-sm">{users.length} registered users</p>
      </div>

      {/* Role Summary */}
      <div className="grid grid-cols-4 gap-3">
        {(['admin', 'doctor', 'receptionist', 'patient'] as const).map(role => {
          const cfg = roleConfig[role]
          const Icon = cfg.icon
          return (
            <div key={role} className={cn('flex items-center gap-2 p-3 rounded-xl border', cfg.bg)}>
              <Icon className={cn('h-5 w-5', cfg.color)} />
              <div>
                <p className={cn('text-xs font-medium capitalize', cfg.color)}>{role}s</p>
                <p className={cn('text-xl font-bold', cfg.color)}>{roleCounts[role] ?? 0}</p>
              </div>
            </div>
          )
        })}
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <Users className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-base font-semibold text-slate-800">All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Phone</TableHead>
                <TableHead className="text-xs">Specialization</TableHead>
                <TableHead className="text-xs">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(u => {
                const cfg = roleConfig[u.role] ?? roleConfig.patient
                const Icon = cfg.icon
                return (
                  <TableRow key={u.id} className={cn('hover:bg-slate-50', u.id === currentUserId ? 'bg-blue-50/40' : '')}>
                    <TableCell>
                      <p className="font-medium text-sm">
                        {u.full_name}
                        {u.id === currentUserId && (
                          <span className="ml-2 text-xs text-blue-500 font-normal">(you)</span>
                        )}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs capitalize gap-1', cfg.bg, cfg.color)}>
                        <Icon className="h-3 w-3" /> {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{u.phone ?? '—'}</TableCell>
                    <TableCell className="text-sm text-slate-600">{u.specialization ?? '—'}</TableCell>
                    <TableCell className="text-xs text-slate-400">{formatDate(u.created_at)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
