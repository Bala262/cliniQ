'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Bell, Search, LogOut, User, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

interface TopNavbarProps {
  profile: Profile
  alertCount?: number
}

const ROLE_COLORS: Record<string, string> = {
  doctor: 'bg-blue-100 text-blue-700',
  visiting_doctor: 'bg-indigo-100 text-indigo-700',
  admin: 'bg-violet-100 text-violet-700',
  receptionist: 'bg-cyan-100 text-cyan-700',
  nurse: 'bg-purple-100 text-purple-700',
  lab: 'bg-amber-100 text-amber-700',
  pharmacy: 'bg-emerald-100 text-emerald-700',
  billing: 'bg-rose-100 text-rose-700',
}

const ROLE_LABELS: Record<string, string> = {
  doctor: 'Doctor',
  visiting_doctor: 'Visiting Doctor',
  admin: 'Administrator',
  receptionist: 'Receptionist',
  nurse: 'Nurse',
  lab: 'Lab Technician',
  pharmacy: 'Pharmacist',
  billing: 'Billing Staff',
}

const AVATAR_COLORS: Record<string, string> = {
  doctor: 'bg-blue-100 text-blue-700',
  visiting_doctor: 'bg-indigo-100 text-indigo-700',
  admin: 'bg-violet-100 text-violet-700',
  receptionist: 'bg-cyan-100 text-cyan-700',
  nurse: 'bg-purple-100 text-purple-700',
  lab: 'bg-amber-100 text-amber-700',
  pharmacy: 'bg-emerald-100 text-emerald-700',
  billing: 'bg-rose-100 text-rose-700',
}

export function TopNavbar({ profile, alertCount = 0 }: TopNavbarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [searchQuery, setSearchQuery] = useState('')

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/login')
    router.refresh()
  }

  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const roleColor = ROLE_COLORS[profile.role] ?? 'bg-slate-100 text-slate-700'
  const avatarColor = AVATAR_COLORS[profile.role] ?? 'bg-slate-100 text-slate-700'
  const roleLabel = ROLE_LABELS[profile.role] ?? profile.role

  return (
    <header className="fixed top-0 left-56 right-0 h-14 bg-white border-b border-slate-200 flex items-center px-5 gap-4 z-30 shadow-sm">
      {/* Clinic name */}
      <div className="hidden md:flex items-center gap-2 mr-2">
        <span className="text-slate-400 text-sm font-medium">MedCity Clinic</span>
        <span className="text-slate-200">|</span>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search patient, token..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm focus-visible:ring-1 focus-visible:ring-slate-300"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-slate-500 hover:bg-slate-100">
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-2.5 text-slate-700 hover:bg-slate-100 rounded-lg">
              <Avatar className="h-7 w-7">
                <AvatarFallback className={`text-xs font-bold ${avatarColor}`}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold leading-tight text-slate-800">{profile.full_name}</p>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 border-0 font-medium capitalize ${roleColor}`}>
                  {roleLabel}
                </Badge>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div>
                <p className="text-sm font-semibold">{profile.full_name}</p>
                <p className="text-xs text-slate-500">{roleLabel}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
              <User className="h-4 w-4 text-slate-500" /> My Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 text-sm text-red-600 focus:text-red-600 cursor-pointer">
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
