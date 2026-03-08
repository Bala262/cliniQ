'use client'

import { useState } from 'react'
import { Patient, Vitals } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getRiskBadgeColor, cn } from '@/lib/utils'
import { Heart, Activity, Brain, AlertTriangle, Loader2, RefreshCw, Shield } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  patient: Patient | null
  latestVitals: Vitals | null
}

interface RiskScore {
  diabetes: string
  hypertension: string
  cardiac: string
  overall: string
  summary: string
}

const riskToPercent: Record<string, number> = { low: 20, medium: 55, high: 85 }
const riskColors: Record<string, string> = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
}

export function HealthRisk({ patient, latestVitals }: Props) {
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null)
  const [loading, setLoading] = useState(false)

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p>Patient record not linked. Contact reception.</p>
      </div>
    )
  }

  async function calculateRisk() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/risk-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: patient!.age,
          gender: patient!.gender,
          chronicConditions: patient!.chronic_conditions,
          bmi: latestVitals?.bmi ?? null,
          bpSystolic: latestVitals?.bp_systolic ?? null,
          bpDiastolic: latestVitals?.bp_diastolic ?? null,
          bloodSugar: null,
        }),
      })
      const data = await res.json()
      setRiskScore(data.riskScore)
    } catch {
      toast.error('Failed to calculate risk score')
    } finally {
      setLoading(false)
    }
  }

  const overallRisk = riskScore?.overall ?? patient.risk_level ?? 'low'

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Health Risk Assessment</h1>
        <p className="text-slate-500 text-sm">AI-powered preventive health analysis for {patient.full_name}</p>
      </div>

      {/* Overall Risk Banner */}
      <Card className={cn(
        'border-2',
        overallRisk === 'high' ? 'border-red-300 bg-red-50' :
        overallRisk === 'medium' ? 'border-yellow-300 bg-yellow-50' :
        'border-green-300 bg-green-50'
      )}>
        <CardContent className="p-5 flex items-center gap-4">
          <div className={cn(
            'p-3 rounded-full',
            overallRisk === 'high' ? 'bg-red-100' :
            overallRisk === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
          )}>
            <Shield className={cn(
              'h-8 w-8',
              overallRisk === 'high' ? 'text-red-600' :
              overallRisk === 'medium' ? 'text-yellow-600' : 'text-green-600'
            )} />
          </div>
          <div>
            <p className="text-sm text-slate-600">Overall Health Risk</p>
            <p className={cn('text-3xl font-bold capitalize', riskColors[overallRisk] ?? 'text-slate-700')}>
              {overallRisk}
            </p>
            {riskScore?.summary && (
              <p className="text-xs text-slate-600 mt-1">{riskScore.summary}</p>
            )}
          </div>
          <div className="ml-auto">
            <Button
              onClick={calculateRisk}
              disabled={loading}
              size="sm"
              variant="outline"
              className="h-8 text-xs"
            >
              {loading ? (
                <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Analyzing...</>
              ) : (
                <><RefreshCw className="h-3.5 w-3.5 mr-1.5" />Recalculate</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Risk Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Diabetes Risk', key: 'diabetes', icon: Activity },
          { label: 'Hypertension Risk', key: 'hypertension', icon: Heart },
          { label: 'Cardiac Risk', key: 'cardiac', icon: Brain },
        ].map(({ label, key, icon: Icon }) => {
          const level = riskScore ? riskScore[key as keyof RiskScore] as string : 'low'
          const pct = riskToPercent[level] ?? 20
          return (
            <Card key={key}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-slate-500" />
                  <p className="text-xs font-semibold text-slate-600">{label}</p>
                </div>
                <Progress value={pct} className={cn(
                  'h-2',
                  level === 'high' ? '[&>div]:bg-red-500' :
                  level === 'medium' ? '[&>div]:bg-yellow-500' :
                  '[&>div]:bg-green-500'
                )} />
                <Badge
                  variant="outline"
                  className={cn('text-xs capitalize w-full justify-center', getRiskBadgeColor(level))}
                >
                  {riskScore ? level : '—'}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Patient Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">Your Profile Data</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 p-3 pt-0">
          {[
            { label: 'Age', value: patient.age ? `${patient.age} years` : '—' },
            { label: 'Gender', value: patient.gender ?? '—' },
            { label: 'Blood Group', value: patient.blood_group ?? '—' },
            {
              label: 'Chronic Conditions',
              value: patient.chronic_conditions?.length
                ? patient.chronic_conditions.join(', ')
                : 'None',
            },
            {
              label: 'Allergies',
              value: patient.allergies?.length ? patient.allergies.join(', ') : 'None',
            },
            {
              label: 'Latest BP',
              value: latestVitals?.bp_systolic
                ? `${latestVitals.bp_systolic}/${latestVitals.bp_diastolic} mmHg`
                : '—',
            },
            { label: 'BMI', value: latestVitals?.bmi ? `${latestVitals.bmi}` : '—' },
            { label: 'Weight', value: latestVitals?.weight ? `${latestVitals.weight} kg` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-50 p-2.5 rounded-lg">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5 capitalize">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Advisory */}
      {overallRisk !== 'low' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-800">Health Advisory</p>
              <p className="text-xs text-orange-700 mt-0.5 leading-relaxed">
                Based on your profile, you have an elevated health risk. Please consult your doctor for
                a detailed evaluation. Regular monitoring of blood pressure, blood sugar, and regular
                follow-ups are recommended.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!riskScore && (
        <Button
          onClick={calculateRisk}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Calculating...</>
          ) : (
            <><Brain className="h-4 w-4 mr-2" />Calculate AI Risk Score</>
          )}
        </Button>
      )}
    </div>
  )
}
