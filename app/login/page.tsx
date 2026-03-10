'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Read role from profiles table (reliable — not dependent on user_metadata)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const role = profile?.role ?? data.user?.user_metadata?.role ?? 'receptionist'
    const rolePathMap: Record<string, string> = {
      visiting_doctor: '/dashboard/visiting-doctor',
    }
    const dashboardPath = rolePathMap[role] ?? `/dashboard/${role}`
    toast.success(`Welcome back! Redirecting to your dashboard...`)
    router.push(dashboardPath)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-white">
            <div className="p-2 bg-blue-500 rounded-xl">
              <Activity className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold tracking-tight">CLINIQ-AI+</span>
          </div>
          <p className="text-blue-300 text-sm text-center">
            AI Clinical Workflow Copilot for Small Clinics
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-slate-800">Sign in</CardTitle>
            <CardDescription className="text-slate-500">
              Enter your clinic credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-slate-200 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 border-slate-200 focus:border-blue-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                ) : (
                  'Sign in to Dashboard'
                )}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs font-semibold text-slate-600 mb-2">Demo Accounts:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                <p><span className="font-medium text-blue-600">Doctor:</span> doctor@cliniq.demo</p>
                <p><span className="font-medium text-purple-600">Nurse:</span> nurse@cliniq.demo</p>
                <p><span className="font-medium text-amber-600">Lab Tech:</span> lab@cliniq.demo</p>
                <p><span className="font-medium text-emerald-600">Pharmacy:</span> pharmacy@cliniq.demo</p>
                <p><span className="font-medium text-rose-600">Billing:</span> billing@cliniq.demo</p>
                <p><span className="font-medium text-cyan-600">Reception:</span> reception@cliniq.demo</p>
                <p><span className="font-medium text-violet-600">Admin:</span> admin@cliniq.demo</p>
                <p className="col-span-2 text-[10px] text-slate-400 mt-1">All passwords: Demo@1234</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-blue-300/60">
          © 2026 CLINIQ-AI+ · Hackathon Prototype
        </p>
      </div>
    </div>
  )
}
