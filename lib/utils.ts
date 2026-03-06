import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generatePatientCode(index: number): string {
  return `CLQ-${String(index).padStart(4, '0')}`
}

export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `INV-${year}-${random}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

export function getRiskBadgeColor(risk: string): string {
  switch (risk) {
    case 'high': return 'bg-red-100 text-red-700 border-red-200'
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'low': return 'bg-green-100 text-green-700 border-green-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'waiting': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'in-consultation': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'completed': return 'bg-green-100 text-green-700 border-green-200'
    case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200'
    case 'scheduled': return 'bg-purple-100 text-purple-700 border-purple-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'emergency': return 'bg-red-100 text-red-700 border-red-200'
    case 'urgent': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'normal': return 'bg-green-100 text-green-700 border-green-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export function getAlertSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'border-l-red-500 bg-red-50'
    case 'high': return 'border-l-orange-500 bg-orange-50'
    case 'medium': return 'border-l-yellow-500 bg-yellow-50'
    case 'low': return 'border-l-blue-500 bg-blue-50'
    default: return 'border-l-gray-500 bg-gray-50'
  }
}

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
]

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const CONSULTATION_TYPES = ['general', 'follow-up', 'emergency'] as const
