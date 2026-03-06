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

const roleColors: Record<string, string> = {
  doctor: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
  receptionist: 'bg-teal-100 text-teal-700',
  patient: 'bg-orange-100 text-orange-700',
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

  return (
    <header className="fixed top-0 left-56 right-0 h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-4 z-30">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search patient..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-slate-600">
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 text-slate-700 hover:bg-slate-100">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold leading-tight">{profile.full_name}</p>
                <Badge variant="outline" className={`text-xs px-1.5 py-0 h-4 capitalize ${roleColors[profile.role] ?? ''}`}>
                  {profile.role}
                </Badge>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-slate-500">Account</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 text-sm">
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 text-sm text-red-600 focus:text-red-600">
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
