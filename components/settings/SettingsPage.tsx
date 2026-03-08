'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { User, Shield, Loader2, Save } from 'lucide-react'

interface Props {
  profile: Profile
}

export function SettingsPage({ profile }: Props) {
  const supabase = createClient()
  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    phone: profile.phone ?? '',
    specialization: profile.specialization ?? '',
    license_number: profile.license_number ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [changingPwd, setChangingPwd] = useState(false)

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: form.full_name, phone: form.phone, specialization: form.specialization, license_number: form.license_number })
        .eq('id', profile.id)
      if (error) throw error
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setChangingPwd(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success('Password changed successfully')
      setNewPassword('')
    } catch {
      toast.error('Failed to change password')
    } finally {
      setChangingPwd(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 text-sm">Manage your profile and account</p>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-base font-semibold text-slate-800">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Full Name</Label>
                <Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Phone</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-9 text-sm" />
              </div>
              {profile.role === 'doctor' && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Specialization</Label>
                    <Input value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))} placeholder="e.g. General Medicine" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">License Number</Label>
                    <Input value={form.license_number} onChange={e => setForm(p => ({ ...p, license_number: e.target.value }))} placeholder="MCI Registration Number" className="h-9 text-sm" />
                  </div>
                </>
              )}
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Profile</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center gap-2">
          <Shield className="h-5 w-5 text-slate-500" />
          <CardTitle className="text-base font-semibold text-slate-800">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-slate-700">Role</p>
              <p className="text-xs text-slate-500">Your system role</p>
            </div>
            <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 border-blue-200">
              {profile.role}
            </Badge>
          </div>
          <Separator />
          <form onSubmit={changePassword} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Change Password</Label>
              <Input
                type="password"
                placeholder="New password (min 6 characters)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <Button type="submit" variant="outline" disabled={changingPwd || !newPassword}>
              {changingPwd ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</> : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
