'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Package, Search, Plus, AlertTriangle, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const inventory = [
  { id: 1, name: 'Paracetamol 500mg', generic: 'Acetaminophen', category: 'Analgesic', stock: 350, unit: 'Tablets', expiry: 'Dec 2026', supplier: 'Sun Pharma', price: 2.50, reorder: 100 },
  { id: 2, name: 'Amoxicillin 500mg', generic: 'Amoxicillin', category: 'Antibiotic', stock: 12, unit: 'Capsules', expiry: 'Mar 2026', supplier: 'Cipla', price: 8.00, reorder: 50 },
  { id: 3, name: 'Metformin 500mg', generic: 'Metformin HCl', category: 'Antidiabetic', stock: 25, unit: 'Tablets', expiry: 'Jun 2027', supplier: 'Dr. Reddy\'s', price: 3.50, reorder: 100 },
  { id: 4, name: 'Azithromycin 500mg', generic: 'Azithromycin', category: 'Antibiotic', stock: 80, unit: 'Tablets', expiry: 'Aug 2026', supplier: 'Abbott', price: 35.00, reorder: 30 },
  { id: 5, name: 'Aspirin 75mg', generic: 'Acetylsalicylic acid', category: 'Antiplatelet', stock: 8, unit: 'Tablets', expiry: 'Jun 2026', supplier: 'Bayer', price: 1.50, reorder: 100 },
  { id: 6, name: 'Omeprazole 20mg', generic: 'Omeprazole', category: 'PPI', stock: 200, unit: 'Capsules', expiry: 'Oct 2026', supplier: 'Zydus', price: 5.00, reorder: 60 },
  { id: 7, name: 'Cetirizine 10mg', generic: 'Cetirizine HCl', category: 'Antihistamine', stock: 150, unit: 'Tablets', expiry: 'Nov 2026', supplier: 'UCB Pharma', price: 4.00, reorder: 50 },
  { id: 8, name: 'ORS Sachet', generic: 'Oral Rehydration Salts', category: 'Electrolyte', stock: 60, unit: 'Sachets', expiry: 'May 2027', supplier: 'WHO', price: 12.00, reorder: 20 },
]

function getStockStatus(stock: number, reorder: number) {
  const pct = (stock / reorder) * 100
  if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700', bar: 'bg-red-500' }
  if (pct < 25) return { label: 'Critical', color: 'bg-red-100 text-red-700', bar: 'bg-red-500' }
  if (pct < 75) return { label: 'Low', color: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500' }
  return { label: 'Adequate', color: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' }
}

function isExpiringSoon(expiry: string) {
  const parts = expiry.split(' ')
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
  const d = new Date(parseInt(parts[1]), months[parts[0]])
  const diff = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
  return diff < 3
}

export function PharmacyInventory() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'expiring'>('all')

  const filtered = inventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (filter === 'low') return (item.stock / item.reorder) < 0.75
    if (filter === 'expiring') return isExpiringSoon(item.expiry)
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
          <p className="text-sm text-slate-500 mt-0.5">{inventory.length} medicines tracked</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2 h-9">
          <Plus className="h-4 w-4" /> Add Medicine
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-slate-50"><CardContent className="p-4"><p className="text-2xl font-bold text-slate-800">{inventory.length}</p><p className="text-xs text-slate-500">Total Items</p></CardContent></Card>
        <Card className="border-0 shadow-sm bg-red-50"><CardContent className="p-4"><p className="text-2xl font-bold text-red-700">{inventory.filter(i => (i.stock / i.reorder) < 0.25).length}</p><p className="text-xs text-red-600">Critical Stock</p></CardContent></Card>
        <Card className="border-0 shadow-sm bg-amber-50"><CardContent className="p-4"><p className="text-2xl font-bold text-amber-700">{inventory.filter(i => isExpiringSoon(i.expiry)).length}</p><p className="text-xs text-amber-600">Expiring Soon</p></CardContent></Card>
        <Card className="border-0 shadow-sm bg-emerald-50"><CardContent className="p-4"><p className="text-2xl font-bold text-emerald-700">{inventory.filter(i => (i.stock / i.reorder) >= 0.75).length}</p><p className="text-xs text-emerald-600">Adequate Stock</p></CardContent></Card>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-3">
        {(['all', 'low', 'expiring'] as const).map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f === 'all' ? 'All Medicines' : f === 'low' ? 'Low Stock' : 'Expiring Soon'}
          </button>
        ))}
        <div className="relative ml-auto w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input placeholder="Search medicine..." className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="text-xs font-semibold text-slate-500">Medicine</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Category</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Stock</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Expiry</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Supplier</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Unit Price</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const ss = getStockStatus(item.stock, item.reorder)
                const expiring = isExpiringSoon(item.expiry)
                return (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <p className="font-medium text-sm text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.generic}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">{item.category}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${item.stock < item.reorder * 0.25 ? 'text-red-600' : 'text-slate-800'}`}>
                          {item.stock}
                        </span>
                        <span className="text-xs text-slate-400">{item.unit}</span>
                      </div>
                      <div className="h-1 w-16 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div className={`h-full rounded-full ${ss.bar}`} style={{ width: `${Math.min((item.stock / (item.reorder * 2)) * 100, 100)}%` }} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${expiring ? 'text-red-600 font-medium' : 'text-slate-600'}`}>{item.expiry}</span>
                      {expiring && <p className="text-[10px] text-red-500">Expiring soon!</p>}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{item.supplier}</TableCell>
                    <TableCell className="text-sm font-medium text-slate-700">₹{item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={`text-xs border-0 ${ss.color}`}>{ss.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toast.info(`Editing ${item.name}`)}>
                          <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        {ss.label !== 'Adequate' && (
                          <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 px-2"
                            onClick={() => toast.success(`Reorder placed for ${item.name}`)}>
                            Reorder
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
