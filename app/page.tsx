import Link from 'next/link'
import { Activity, Brain, Mic, Pill, Shield, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500 rounded-lg">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">CLINIQ-AI+</span>
        </div>
        <Link href="/login">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white h-9">
            Sign In <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-300 mb-6">
          <Zap className="h-3 w-3" /> AI-Powered · Hackathon 2026
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          AI Clinical Workflow
          <span className="text-blue-400"> Copilot</span>
          <br />for Small Clinics
        </h1>
        <p className="text-lg text-blue-200/70 max-w-2xl mb-10">
          Reduce documentation time by 50%. Voice-to-EMR, AI diagnosis suggestions,
          smart prescriptions, and real-time patient management — built for Indian small clinics.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 h-12 px-8 text-base">
              Enter Dashboard <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10 text-white/90">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Mic,
              title: 'Voice-to-EMR',
              desc: 'Speak naturally — AI extracts symptoms and generates structured medical records automatically.',
              color: 'text-red-400',
            },
            {
              icon: Brain,
              title: 'AI Diagnosis Support',
              desc: 'GPT-4o suggests differential diagnoses with probability scores and transparent reasoning.',
              color: 'text-purple-400',
            },
            {
              icon: Pill,
              title: 'Smart Prescriptions',
              desc: 'AI-generated medicine suggestions with drug interaction checking and generic alternatives.',
              color: 'text-blue-400',
            },
            {
              icon: Shield,
              title: 'Drug Interaction Alerts',
              desc: 'Real-time safety warnings prevent unsafe drug combinations and allergy conflicts.',
              color: 'text-orange-400',
            },
            {
              icon: Activity,
              title: 'Patient Risk Scoring',
              desc: 'AI assesses diabetes, hypertension, and cardiac risk for every patient automatically.',
              color: 'text-green-400',
            },
            {
              icon: Zap,
              title: 'Role-Based Access',
              desc: 'Doctor, Admin, Receptionist, and Patient portals — each with the right tools.',
              color: 'text-yellow-400',
            },
          ].map((f) => (
            <div key={f.title} className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <f.icon className={`h-8 w-8 mb-3 ${f.color}`} />
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-white/50">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Roles */}
      <section className="px-8 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-white/90">Try Demo Accounts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { role: 'Doctor', email: 'doctor@cliniq.demo', color: 'border-blue-500 bg-blue-500/10' },
            { role: 'Admin', email: 'admin@cliniq.demo', color: 'border-purple-500 bg-purple-500/10' },
            { role: 'Receptionist', email: 'reception@cliniq.demo', color: 'border-teal-500 bg-teal-500/10' },
            { role: 'Patient', email: 'patient@cliniq.demo', color: 'border-orange-500 bg-orange-500/10' },
          ].map((d) => (
            <div key={d.role} className={`p-4 rounded-xl border ${d.color}`}>
              <p className="font-semibold text-white text-sm">{d.role}</p>
              <p className="text-xs text-white/50 mt-0.5 break-all">{d.email}</p>
              <p className="text-xs text-white/40 mt-1">Pass: Demo@1234</p>
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle2 className="h-3 w-3 text-green-400" />
                <span className="text-xs text-green-400">Ready to use</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/30">
        CLINIQ-AI+ · Hackathon 2026 · Built with Next.js, Supabase & OpenAI
      </footer>
    </div>
  )
}
