'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BedDouble, User, Stethoscope, AlertCircle, CheckCircle, Wrench, Clock } from 'lucide-react'
import { toast } from 'sonner'

type BedStatus = 'occupied' | 'available' | 'cleaning' | 'reserved'

const initialBeds = [
  { id: 1, bed: 'Bed 1', patient: 'Ravi Kumar', diagnosis: 'Dengue Fever', doctor: 'Dr. Kumar', condition: 'Stable', status: 'occupied' as BedStatus, since: '2 days' },
  { id: 2, bed: 'Bed 2', patient: null, diagnosis: null, doctor: null, condition: null, status: 'available' as BedStatus, since: null },
  { id: 3, bed: 'Bed 3', patient: 'Meena Lakshmi', diagnosis: 'Typhoid', doctor: 'Dr. Priya', condition: 'Improving', status: 'occupied' as BedStatus, since: '3 days' },
  { id: 4, bed: 'Bed 4', patient: null, diagnosis: null, doctor: null, condition: null, status: 'cleaning' as BedStatus, since: null },
  { id: 5, bed: 'Bed 5', patient: 'Ahmed Khan', diagnosis: 'Fracture (Rt. Leg)', doctor: 'Dr. Ahmed', condition: 'Post-Op', status: 'occupied' as BedStatus, since: '1 day' },
  { id: 6, bed: 'Bed 6', patient: null, diagnosis: null, doctor: null, condition: null, status: 'reserved' as BedStatus, since: null },
  { id: 7, bed: 'Bed 7', patient: 'Sita Devi', diagnosis: 'Pneumonia', doctor: 'Dr. Kumar', condition: 'Critical', status: 'occupied' as BedStatus, since: '5 days' },
  { id: 8, bed: 'Bed 8', patient: null, diagnosis: null, doctor: null, condition: null, status: 'available' as BedStatus, since: null },
  { id: 9, bed: 'Bed 9', patient: 'Rajesh Verma', diagnosis: 'Appendicitis', doctor: 'Dr. Priya', condition: 'Post-Op', status: 'occupied' as BedStatus, since: '1 day' },
  { id: 10, bed: 'Bed 10', patient: null, diagnosis: null, doctor: null, condition: null, status: 'available' as BedStatus, since: null },
]

const STATUS_CONFIG: Record<BedStatus, { label: string; color: string; badge: string; icon: React.ElementType }> = {
  occupied: { label: 'Occupied', color: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700', icon: User },
  available: { label: 'Available', color: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  cleaning: { label: 'Cleaning', color: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700', icon: Wrench },
  reserved: { label: 'Reserved', color: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: Clock },
}

export function NurseWardManagement() {
  const [beds, setBeds] = useState(initialBeds)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const stats = {
    occupied: beds.filter(b => b.status === 'occupied').length,
    available: beds.filter(b => b.status === 'available').length,
    cleaning: beds.filter(b => b.status === 'cleaning').length,
    reserved: beds.filter(b => b.status === 'reserved').length,
  }

  function updateBedStatus(id: number, status: BedStatus) {
    setBeds(prev => prev.map(b => b.id === id ? { ...b, status } : b))
    toast.success(`Bed status updated to ${status}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ward Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">10-Bed General Ward — Real-time Status</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
            className={view === 'grid' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            Grid View
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            List View
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, val]) => {
          const config = STATUS_CONFIG[key as BedStatus]
          return (
            <Card key={key} className={`border shadow-sm ${config.color}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <config.icon className="h-8 w-8 text-slate-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-800">{val}</p>
                  <p className="text-xs text-slate-500">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {beds.map((bed) => {
            const config = STATUS_CONFIG[bed.status]
            return (
              <Card key={bed.id} className={`border-2 shadow-sm transition-shadow hover:shadow-md ${config.color}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-800 text-sm">{bed.bed}</span>
                    <Badge className={`text-[10px] px-1.5 py-0 h-4 ${config.badge} border-0`}>
                      {config.label}
                    </Badge>
                  </div>
                  <div className="flex justify-center mb-3">
                    <BedDouble className={`h-10 w-10 ${bed.status === 'occupied' ? 'text-red-400' : bed.status === 'available' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  </div>
                  {bed.patient ? (
                    <div>
                      <p className="text-xs font-semibold text-slate-800 truncate">{bed.patient}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{bed.diagnosis}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{bed.since}</p>
                      <div className="mt-2 space-y-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-6 text-[10px] px-2"
                          onClick={() => toast.info(`Viewing ${bed.patient}'s details`)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-6 text-[10px] px-2 text-amber-600 border-amber-200 hover:bg-amber-50"
                          onClick={() => updateBedStatus(bed.id, 'cleaning')}
                        >
                          Discharge
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs text-slate-400">{bed.status === 'cleaning' ? 'Being cleaned' : bed.status === 'reserved' ? 'Reserved' : 'Empty'}</p>
                      {bed.status === 'cleaning' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-6 text-[10px] px-2 mt-2 text-emerald-600 border-emerald-200"
                          onClick={() => updateBedStatus(bed.id, 'available')}
                        >
                          Mark Ready
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Bed</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Patient</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Diagnosis</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Doctor</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Condition</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {beds.map((bed) => {
                  const config = STATUS_CONFIG[bed.status]
                  return (
                    <tr key={bed.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="font-bold text-sm text-slate-800">{bed.bed}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-700">{bed.patient ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-600">{bed.diagnosis ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-600">{bed.doctor ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        {bed.condition ? (
                          <span className={`text-xs font-medium ${bed.condition === 'Critical' ? 'text-red-600' : bed.condition === 'Stable' ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {bed.condition}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${config.badge} border-0`}>{config.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {bed.status === 'occupied' ? (
                          <Button size="sm" variant="outline" className="h-7 text-xs"
                            onClick={() => toast.info(`Viewing ${bed.patient}`)}>
                            Details
                          </Button>
                        ) : bed.status === 'cleaning' ? (
                          <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600"
                            onClick={() => updateBedStatus(bed.id, 'available')}>
                            Mark Ready
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="h-7 text-xs"
                            onClick={() => toast.info('Assign patient from queue')}>
                            Assign
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
