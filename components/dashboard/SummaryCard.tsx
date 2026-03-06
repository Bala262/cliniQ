import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface SummaryCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'teal'
  urgent?: boolean
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-100 text-blue-600',
    value: 'text-blue-700',
    border: 'border-blue-100',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'bg-yellow-100 text-yellow-600',
    value: 'text-yellow-700',
    border: 'border-yellow-100',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-100 text-green-600',
    value: 'text-green-700',
    border: 'border-green-100',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-100 text-red-600',
    value: 'text-red-700',
    border: 'border-red-100',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-100 text-purple-600',
    value: 'text-purple-700',
    border: 'border-purple-100',
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-100 text-teal-600',
    value: 'text-teal-700',
    border: 'border-teal-100',
  },
}

export function SummaryCard({ title, value, icon: Icon, color, urgent }: SummaryCardProps) {
  const colors = colorMap[color]

  return (
    <Card className={cn(
      'border transition-all duration-200',
      colors.border,
      urgent && value > 0 ? 'ring-2 ring-red-400 animate-pulse' : ''
    )}>
      <CardContent className={cn('p-4', colors.bg)}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 leading-tight">{title}</p>
            <p className={cn('text-3xl font-bold mt-1', colors.value)}>{value}</p>
          </div>
          <div className={cn('p-2 rounded-lg', colors.icon)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
