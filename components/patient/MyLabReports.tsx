'use client'

import { useState } from 'react'
import { LabReport, LabValue } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { FlaskConical, ChevronDown, ChevronUp, Brain, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  reports: LabReport[]
}

const statusColors: Record<string, string> = {
  normal: 'bg-green-100 text-green-700 border-green-200',
  high: 'bg-red-100 text-red-700 border-red-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  critical: 'bg-red-200 text-red-800 border-red-300',
}

export function MyLabReports({ reports }: Props) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Lab Reports</h1>
        <p className="text-slate-500 text-sm">{reports.length} report(s) on record</p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex items-center gap-3 p-6 text-slate-400">
            <FlaskConical className="h-6 w-6" />
            <p className="text-sm">No lab reports uploaded yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map(r => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  )
}

function ReportCard({ report }: { report: LabReport }) {
  const [expanded, setExpanded] = useState(false)
  const abnormal = report.extracted_values?.filter(
    (v: LabValue) => v.status === 'high' || v.status === 'low' || v.status === 'critical'
  ) ?? []

  return (
    <Card className={abnormal.length > 0 ? 'border-orange-200' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-teal-500" />
            <CardTitle className="text-sm font-semibold text-slate-700 truncate max-w-xs">
              {report.file_name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {abnormal.length > 0 && (
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                {abnormal.length} abnormal
              </Badge>
            )}
            {report.ai_summary && (
              <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200 gap-1">
                <Brain className="h-3 w-3" /> AI Analyzed
              </Badge>
            )}
            {report.file_url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => window.open(report.file_url, '_blank')}
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{formatDate(report.uploaded_at)}</p>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-3">
          <Separator />

          {/* AI Summary */}
          {report.ai_summary && (
            <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
              <p className="text-xs font-semibold text-teal-700 mb-1 flex items-center gap-1">
                <Brain className="h-3.5 w-3.5" /> AI Interpretation
              </p>
              <p className="text-xs text-teal-600 leading-relaxed">{report.ai_summary}</p>
            </div>
          )}

          {/* Lab values table */}
          {report.extracted_values?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wide">
                    <th className="px-3 py-2 text-left font-semibold">Test</th>
                    <th className="px-3 py-2 text-left font-semibold">Value</th>
                    <th className="px-3 py-2 text-left font-semibold">Normal Range</th>
                    <th className="px-3 py-2 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.extracted_values.map((val: LabValue, i: number) => (
                    <tr key={i} className={cn(
                      val.status !== 'normal' ? 'bg-red-50/50' : ''
                    )}>
                      <td className="px-3 py-2 font-medium text-slate-700">{val.test_name}</td>
                      <td className="px-3 py-2 text-slate-600">
                        {val.value} {val.unit}
                      </td>
                      <td className="px-3 py-2 text-slate-400">{val.normal_range}</td>
                      <td className="px-3 py-2">
                        <Badge
                          variant="outline"
                          className={cn('text-xs capitalize', statusColors[val.status] ?? 'bg-slate-100 text-slate-600')}
                        >
                          {val.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
