'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Receipt, Wallet, Clock, CheckCircle, ArrowRight, TrendingUp, Users, CreditCard, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const pendingBills = [
  { id: 'INV-2601', patient: 'Priya Devi', consultation: 300, lab: 850, medicines: 420, ward: 0, total: 1570, status: 'pending', time: '10:15 AM' },
  { id: 'INV-2602', patient: 'Rajan Mehta', consultation: 500, lab: 1200, medicines: 680, ward: 1500, total: 3880, status: 'pending', time: '10:30 AM' },
  { id: 'INV-2603', patient: 'Kavitha Nair', consultation: 300, lab: 0, medicines: 150, ward: 0, total: 450, status: 'partial', time: '09:45 AM' },
]

const recentPaid = [
  { id: 'INV-2598', patient: 'Ravi Kumar', total: 2340, mode: 'UPI', time: '09:30 AM' },
  { id: 'INV-2599', patient: 'Suresh Iyer', total: 680, mode: 'Cash', time: '09:00 AM' },
  { id: 'INV-2600', patient: 'Ahmed Khan (Ward)', total: 8500, mode: 'Card', time: '08:30 AM' },
]

export function BillingDashboardContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Billing Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Tuesday, March 10, 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Pending Bills', value: '8', icon: <Clock className="h-5 w-5" />, color: 'amber', sub: 'To be generated' },
          { title: "Today's Collection", value: '₹24,850', icon: <TrendingUp className="h-5 w-5" />, color: 'emerald', sub: '↑ 12% vs yesterday' },
          { title: 'Patients Billed', value: '22', icon: <Users className="h-5 w-5" />, color: 'blue', sub: 'Out of 34 today' },
          { title: 'Insurance Pending', value: '3', icon: <AlertCircle className="h-5 w-5" />, color: 'red', sub: 'Claims processing' },
        ].map((s) => (
          <BillStatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Bills */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-rose-100 rounded-lg">
                  <Receipt className="h-4 w-4 text-rose-600" />
                </div>
                Pending Bills
              </CardTitle>
              <Link href="/dashboard/billing/generate">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  Generate Bill <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs font-semibold text-slate-500">Invoice</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Patient</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Consult</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Lab</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Pharmacy</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500">Ward</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 font-bold">Total</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingBills.map((bill) => (
                    <TableRow key={bill.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-mono text-xs font-bold text-rose-700">{bill.id}</TableCell>
                      <TableCell>
                        <p className="font-medium text-sm text-slate-800">{bill.patient}</p>
                        <p className="text-xs text-slate-400">{bill.time}</p>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">₹{bill.consultation}</TableCell>
                      <TableCell className="text-sm text-slate-600">₹{bill.lab}</TableCell>
                      <TableCell className="text-sm text-slate-600">₹{bill.medicines}</TableCell>
                      <TableCell className="text-sm text-slate-600">{bill.ward > 0 ? `₹${bill.ward}` : '—'}</TableCell>
                      <TableCell className="font-bold text-slate-800">₹{bill.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <Badge className={`text-xs border-0 ${bill.status === 'partial' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                            {bill.status}
                          </Badge>
                          <Link href="/dashboard/billing/generate">
                            <Button size="sm" className="h-7 text-xs bg-rose-600 hover:bg-rose-700">Collect</Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <div>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPaid.map((p) => (
                <div key={p.id} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{p.patient}</p>
                      <p className="font-mono text-xs text-slate-500">{p.id}</p>
                    </div>
                    <span className="font-bold text-emerald-700 text-sm">₹{p.total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{p.time}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${p.mode === 'UPI' ? 'bg-purple-100 text-purple-700' : p.mode === 'Card' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {p.mode}
                    </span>
                  </div>
                </div>
              ))}
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Cash in Register</p>
                    <p className="text-lg font-bold text-slate-800">₹12,450</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium text-right">UPI / Card</p>
                    <p className="text-lg font-bold text-slate-800">₹12,400</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function BillStatCard({ title, value, icon, color, sub }: { title: string; value: string; icon: React.ReactNode; color: string; sub: string }) {
  const colors: Record<string, { border: string; text: string; icon: string }> = {
    amber: { border: 'border-amber-100', text: 'text-amber-700', icon: 'bg-amber-50 text-amber-600' },
    emerald: { border: 'border-emerald-100', text: 'text-emerald-700', icon: 'bg-emerald-50 text-emerald-600' },
    blue: { border: 'border-blue-100', text: 'text-blue-700', icon: 'bg-blue-50 text-blue-600' },
    red: { border: 'border-red-100', text: 'text-red-700', icon: 'bg-red-50 text-red-600' },
  }
  const c = colors[color]
  return (
    <Card className={`border shadow-sm ${c.border}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </div>
          <div className={`p-2.5 rounded-xl ${c.icon}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
