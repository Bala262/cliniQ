'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Patient } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn, getRiskBadgeColor, formatDate } from '@/lib/utils'
import { Search, Users, Eye, AlertTriangle } from 'lucide-react'

interface Props {
  patients: Patient[]
  basePath: string
}

export function PatientListPage({ patients, basePath }: Props) {
  const [search, setSearch] = useState('')

  const filtered = patients.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.patient_code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Patients</h1>
          <p className="text-slate-500 text-sm">{patients.length} patients registered</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by name, phone, ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Risk summary */}
      <div className="flex gap-3">
        {(['high', 'medium', 'low'] as const).map(risk => (
          <div key={risk} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border', getRiskBadgeColor(risk))}>
            {risk === 'high' && <AlertTriangle className="h-3 w-3" />}
            {patients.filter(p => p.risk_level === risk).length} {risk} risk
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-base font-semibold text-slate-800">
            Patient List {search ? `(${filtered.length} results)` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500 w-28">Patient ID</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Name</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 w-14">Age</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Phone</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Conditions</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 w-24">Risk</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 w-20">Registered</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 text-right w-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-slate-400 py-10">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(p => (
                  <TableRow key={p.id} className="hover:bg-slate-50">
                    <TableCell>
                      <span className="font-mono text-xs text-blue-600 font-semibold">{p.patient_code}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm text-slate-800">{p.full_name}</p>
                        <p className="text-xs text-slate-400 capitalize">{p.gender} · {p.blood_group ?? '—'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{p.age ?? '—'}</TableCell>
                    <TableCell className="text-sm text-slate-600">{p.phone}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {p.allergies?.slice(0, 1).map(a => (
                          <Badge key={a} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                            {a}
                          </Badge>
                        ))}
                        {p.chronic_conditions?.slice(0, 1).map(c => (
                          <Badge key={c} variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            {c}
                          </Badge>
                        ))}
                        {(p.allergies?.length + p.chronic_conditions?.length) > 2 && (
                          <Badge variant="outline" className="text-xs text-slate-500">
                            +{(p.allergies?.length + p.chronic_conditions?.length) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs capitalize', getRiskBadgeColor(p.risk_level))}>
                        {p.risk_level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {formatDate(p.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`${basePath}/${p.id}`}>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          <Eye className="h-3 w-3" /> View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
