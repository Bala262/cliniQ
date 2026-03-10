'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pill, ClipboardList, Package, AlertTriangle, TrendingUp, ArrowRight, Clock, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const prescriptionQueue = [
  { id: 'RX001', patient: 'Priya Devi', age: 28, doctor: 'Dr. Priya', medicines: ['Azithromycin 500mg', 'Paracetamol 500mg', 'ORS'], time: '10:15 AM', status: 'pending' },
  { id: 'RX002', patient: 'Suresh Iyer', age: 45, doctor: 'Dr. Kumar', medicines: ['Metformin 500mg', 'Glipizide 5mg'], time: '10:30 AM', status: 'pending' },
  { id: 'RX003', patient: 'Ahmed Khan', age: 52, doctor: 'Dr. Ahmed', medicines: ['Tramadol 50mg', 'Pantoprazole 40mg', 'Calcium 500mg'], time: '09:00 AM', status: 'dispensed' },
]

const lowStockAlerts = [
  { medicine: 'Amoxicillin 500mg', stock: 12, reorder: 50, expiry: 'Mar 2026' },
  { medicine: 'Aspirin 75mg', stock: 8, reorder: 100, expiry: 'Jun 2026' },
  { medicine: 'Metformin 500mg', stock: 25, reorder: 100, expiry: 'Aug 2026' },
]

export function PharmacyDashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pharmacy Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Tuesday, March 10, 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Prescriptions Pending', value: '5', icon: <ClipboardList className="h-5 w-5" />, color: 'emerald' },
          { title: 'Dispensed Today', value: '18', icon: <Pill className="h-5 w-5" />, color: 'blue' },
          { title: 'Low Stock Items', value: '3', icon: <Package className="h-5 w-5" />, color: 'amber' },
          { title: "Today's Sales", value: '₹4,280', icon: <TrendingUp className="h-5 w-5" />, color: 'purple' },
        ].map((s) => (
          <PharmStatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescription Queue */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <ClipboardList className="h-4 w-4 text-emerald-600" />
                </div>
                Prescription Queue
              </CardTitle>
              <Link href="/dashboard/pharmacy/prescriptions">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">View All <ArrowRight className="h-3 w-3" /></Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs font-semibold text-slate-500">Rx #</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Patient</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Doctor</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Medicines</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Time</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptionQueue.map((rx) => (
                    <TableRow key={rx.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono text-xs font-bold text-emerald-700">{rx.id}</TableCell>
                      <TableCell>
                        <p className="font-medium text-sm text-slate-800">{rx.patient}</p>
                        <p className="text-xs text-slate-400">{rx.age} yrs</p>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{rx.doctor}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rx.medicines.slice(0, 2).map((m, i) => (
                            <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">{m}</span>
                          ))}
                          {rx.medicines.length > 2 && <span className="text-[10px] text-slate-400">+{rx.medicines.length - 2} more</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" />{rx.time}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs border-0 ${rx.status === 'dispensed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {rx.status === 'dispensed' ? 'Dispensed' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {rx.status === 'pending' && (
                          <Link href="/dashboard/pharmacy/dispense">
                            <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700">Dispense</Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alerts */}
        <div>
          <Card className="border-0 shadow-sm border-amber-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockAlerts.map((item, i) => (
                <div key={i} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-semibold text-slate-800">{item.medicine}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Stock: <span className="font-bold text-red-600">{item.stock}</span></p>
                      <p className="text-xs text-slate-500">Reorder at: {item.reorder}</p>
                    </div>
                    <div className="w-20">
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${Math.min((item.stock / item.reorder) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 text-right">{Math.round((item.stock / item.reorder) * 100)}% left</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-600 mt-1">Expires: {item.expiry}</p>
                </div>
              ))}
              <Link href="/dashboard/pharmacy/inventory">
                <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                  Manage Inventory
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function PharmStatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  const colors: Record<string, { border: string; text: string; icon: string }> = {
    emerald: { border: 'border-emerald-100', text: 'text-emerald-700', icon: 'bg-emerald-50 text-emerald-600' },
    blue: { border: 'border-blue-100', text: 'text-blue-700', icon: 'bg-blue-50 text-blue-600' },
    amber: { border: 'border-amber-100', text: 'text-amber-700', icon: 'bg-amber-50 text-amber-600' },
    purple: { border: 'border-purple-100', text: 'text-purple-700', icon: 'bg-purple-50 text-purple-600' },
  }
  const c = colors[color]
  return (
    <Card className={`border shadow-sm ${c.border}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
          </div>
          <div className={`p-2.5 rounded-xl ${c.icon}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
