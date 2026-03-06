export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CLINIQ-AI+ | AI Clinical Workflow Copilot',
  description: 'AI-powered clinical workflow copilot for small clinics. Voice-to-EMR, AI diagnosis, smart prescriptions.',
  keywords: ['clinic', 'EMR', 'AI', 'healthcare', 'prescription'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
